"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cyphercastClient = exports.CypherCastClient = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const solanaClient_1 = require("../../config/solanaClient");
const nacl = __importStar(require("tweetnacl"));
const swiv_privacy_json_1 = __importDefault(require("./idl/swiv_privacy.json"));
const client_1 = require("@arcium-hq/client");
class CypherCastClient {
    constructor() {
        this.provider = (0, solanaClient_1.getProvider)();
        this.program = new anchor_1.Program(swiv_privacy_json_1.default, this.provider);
        this.authority = (0, solanaClient_1.loadKeypair)();
    }
    getProtocolStatePDA() {
        return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from('protocol_state')], this.program.programId);
    }
    /**
     * Derive pool PDA
     */
    getPoolPDA(poolId) {
        return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from('pool'), new anchor_1.BN(poolId).toArrayLike(Buffer, 'le', 8)], this.program.programId);
    }
    /**
     * Derive pool vault PDA
     */
    getPoolVaultPDA(poolId) {
        return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from('pool_vault'), new anchor_1.BN(poolId).toArrayLike(Buffer, 'le', 8)], this.program.programId);
    }
    /**
     * Derive bet PDA
     */
    getBetPDA(poolPubkey, userPubkey) {
        return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from('bet'), poolPubkey.toBuffer(), userPubkey.toBuffer()], this.program.programId);
    }
    /**
     * Initialize the protocol (one-time setup)
     */
    async initializeProtocol(protocolFeeBps = 250) {
        try {
            const [protocolState] = this.getProtocolStatePDA();
            const tx = await this.program.methods
                .initialize(protocolFeeBps)
                .accounts({
                protocolState,
                admin: this.authority.publicKey,
                systemProgram: web3_js_1.SystemProgram.programId,
            })
                .signers([this.authority])
                .rpc();
            console.log('Protocol initialized:', tx);
            return tx;
        }
        catch (error) {
            console.error('Failed to initialize protocol:', error);
            throw error;
        }
    }
    /**
     * Create a new prediction pool on-chain
     */
    async createPool(params) {
        try {
            const [protocolState] = this.getProtocolStatePDA();
            const [pool] = this.getPoolPDA(params.poolId);
            const [poolVault] = this.getPoolVaultPDA(params.poolId);
            const tx = await this.program.methods
                .createPool(new anchor_1.BN(params.poolId), params.assetSymbol, new anchor_1.BN(params.entryFee), new anchor_1.BN(params.targetTimestamp), params.maxParticipants)
                .accounts({
                protocolState,
                pool,
                poolVault,
                tokenMint: params.tokenMint,
                admin: this.authority.publicKey,
                tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                systemProgram: web3_js_1.SystemProgram.programId,
                rent: web3_js_1.SYSVAR_RENT_PUBKEY,
            })
                .signers([this.authority])
                .rpc();
            console.log('Pool created on-chain:', tx);
            return {
                signature: tx,
                poolPubkey: pool.toBase58(),
                vaultPubkey: poolVault.toBase58(),
            };
        }
        catch (error) {
            console.error('Failed to create pool on-chain:', error);
            throw error;
        }
    }
    /**
     * Fetch pool data from blockchain
     */
    async getPool(poolId) {
        try {
            const [pool] = this.getPoolPDA(poolId);
            const poolData = await this.program.account.pool.fetch(pool);
            return {
                poolId: poolData.poolId.toString(),
                admin: poolData.admin.toBase58(),
                assetSymbol: poolData.assetSymbol,
                entryFee: poolData.entryFee.toNumber(),
                targetTimestamp: poolData.targetTimestamp.toNumber(),
                maxParticipants: poolData.maxParticipants,
                totalParticipants: poolData.totalParticipants,
                totalPoolAmount: poolData.totalPoolAmount.toNumber(),
                status: poolData.status,
                actualPrice: poolData.actualPrice.toNumber(),
                bump: poolData.bump,
                vaultBump: poolData.vaultBump,
            };
        }
        catch (error) {
            console.error('Failed to fetch pool:', error);
            return null;
        }
    }
    /**
     * Finalize pool with oracle price
     */
    async finalizePool(params) {
        try {
            const [pool] = this.getPoolPDA(params.poolId);
            const tx = await this.program.methods
                .finalizePool(new anchor_1.BN(params.actualPrice))
                .accounts({
                pool,
                admin: this.authority.publicKey,
            })
                .signers([this.authority])
                .rpc();
            console.log('Pool finalized on-chain:', tx);
            return tx;
        }
        catch (error) {
            console.error('Failed to finalize pool on-chain:', error);
            throw error;
        }
    }
    /**
     * Close pool (emergency)
     */
    async closePool(poolId) {
        try {
            const [pool] = this.getPoolPDA(poolId);
            const tx = await this.program.methods
                .closePool()
                .accounts({
                pool,
                admin: this.authority.publicKey,
            })
                .signers([this.authority])
                .rpc();
            console.log('Pool closed on-chain:', tx);
            return tx;
        }
        catch (error) {
            console.error('Failed to close pool on-chain:', error);
            throw error;
        }
    }
    /**
     * Get protocol state
     */
    async getProtocolState() {
        try {
            const [protocolState] = this.getProtocolStatePDA();
            const state = await this.program.account.protocolState.fetch(protocolState);
            return {
                admin: state.admin.toBase58(),
                protocolFeeBps: state.protocolFeeBps,
                totalPoolsCreated: state.totalPoolsCreated.toString(),
                bump: state.bump,
            };
        }
        catch (error) {
            console.error('Failed to fetch protocol state:', error);
            return null;
        }
    }
    /**
     * Initialize process_bet computation definition (one-time setup)
     */
    async initProcessBetCompDef() {
        try {
            const baseSeedCompDefAcc = (0, client_1.getArciumAccountBaseSeed)("ComputationDefinitionAccount");
            const offset = (0, client_1.getCompDefAccOffset)("process_bet");
            const compDefPDA = web3_js_1.PublicKey.findProgramAddressSync([baseSeedCompDefAcc, this.program.programId.toBuffer(), offset], (0, client_1.getArciumProgAddress)())[0];
            console.log("getMXEAccAddress:", (0, client_1.getMXEAccAddress)(this.program.programId));
            console.log("Init process bet computation definition pda is ", compDefPDA.toBase58());
            const tx = await this.program.methods
                .initProcessBetCompDef()
                .accounts({
                payer: this.authority.publicKey,
                mxeAccount: (0, client_1.getMXEAccAddress)(this.program.programId),
                compDefAccount: compDefPDA,
            })
                .signers([this.authority])
                .rpc();
            console.log('Process bet comp def initialized:', tx);
            return tx;
        }
        catch (error) {
            console.error('Failed to initialize process bet comp def:', error);
            throw error;
        }
    }
    /**
     * Initialize calculate_reward computation definition (one-time setup)
     */
    async initCalculateRewardCompDef() {
        try {
            const baseSeedCompDefAcc = (0, client_1.getArciumAccountBaseSeed)("ComputationDefinitionAccount");
            const offset = (0, client_1.getCompDefAccOffset)("calculate_reward");
            const compDefPDA = web3_js_1.PublicKey.findProgramAddressSync([baseSeedCompDefAcc, this.program.programId.toBuffer(), offset], (0, client_1.getArciumProgAddress)())[0];
            console.log("getMXEAccAddress:", (0, client_1.getMXEAccAddress)(this.program.programId));
            console.log("Init calculate reward computation definition pda is ", compDefPDA.toBase58());
            const tx = await this.program.methods
                .initCalculateRewardCompDef()
                .accounts({
                payer: this.authority.publicKey,
                mxeAccount: (0, client_1.getMXEAccAddress)(this.program.programId),
                compDefAccount: compDefPDA,
            })
                .signers([this.authority])
                .rpc();
            console.log('Calculate reward comp def initialized:', tx);
            return tx;
        }
        catch (error) {
            console.error('Failed to initialize calculate reward comp def:', error);
            throw error;
        }
    }
    /**
     * Derive computation definition PDA
     */
    getCompDefPDA(offset) {
        console.log('Deriving comp def PDA with offset:', new anchor_1.BN(offset).toArrayLike(Buffer, 'le', 4));
        return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from('comp_def'), new anchor_1.BN(offset).toArrayLike(Buffer, 'le', 4)], this.program.programId);
    }
    /**
     * Helper: Encrypt prediction price (for client-side use)
     * This is an example - in production, encryption happens client-side
     */
    encryptPrediction(predictedPrice, userSecretKey) {
        const nonceBytes = nacl.randomBytes(24);
        const nonce = BigInt('0x' + Buffer.from(nonceBytes).toString('hex'));
        const priceBuffer = Buffer.alloc(8);
        priceBuffer.writeBigUInt64LE(BigInt(predictedPrice));
        const plaintext = new Uint8Array(32);
        plaintext.set(priceBuffer);
        const key = userSecretKey.slice(0, 32);
        const encrypted = nacl.secretbox(plaintext, nonceBytes, key);
        const paddedCiphertext = new Uint8Array(32);
        paddedCiphertext.set(encrypted.slice(0, 32));
        return {
            ciphertext: paddedCiphertext,
            publicKey: userSecretKey.slice(32, 64), // public key part
            nonce,
        };
    }
}
exports.CypherCastClient = CypherCastClient;
exports.cyphercastClient = new CypherCastClient();
//# sourceMappingURL=cyphercastClient.js.map