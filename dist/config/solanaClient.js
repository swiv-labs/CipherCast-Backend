"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.programId = exports.getProvider = exports.loadKeypair = exports.connection = void 0;
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@coral-xyz/anchor");
const env_1 = require("./env");
const fs_1 = __importDefault(require("fs"));
exports.connection = new web3_js_1.Connection(env_1.env.SOLANA_RPC_URL, 'confirmed');
const loadKeypair = () => {
    const keypairFile = fs_1.default.readFileSync(env_1.env.AUTHORITY_KEYPAIR_PATH, 'utf-8');
    const keypairData = JSON.parse(keypairFile);
    return web3_js_1.Keypair.fromSecretKey(new Uint8Array(keypairData));
};
exports.loadKeypair = loadKeypair;
const getProvider = () => {
    const wallet = new anchor_1.Wallet((0, exports.loadKeypair)());
    return new anchor_1.AnchorProvider(exports.connection, wallet, { commitment: 'confirmed' });
};
exports.getProvider = getProvider;
exports.programId = new web3_js_1.PublicKey(env_1.env.PROGRAM_ID);
//# sourceMappingURL=solanaClient.js.map