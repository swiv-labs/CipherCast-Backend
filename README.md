# CypherCast Backend

Production-ready backend API for CypherCast - A decentralized prediction platform on Solana.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Cron Jobs](#cron-jobs)
- [Testing](#testing)
- [Deployment](#deployment)

## Features

- **User Management**: Wallet-based registration and profile management
- **Pool Creation**: Create prediction pools with custom parameters
- **Predictions**: Place bets on price movements (up/down)
- **Oracle Integration**: Real-time price feeds from Binance & CoinGecko
- **Automated Finalization**: Cron job to settle expired pools
- **Leaderboard**: Track top performers by earnings and win rate
- **Statistics**: Platform-wide and asset-specific analytics
- **Solana Integration**: Seamless blockchain synchronization via Anchor
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Comprehensive validation and error responses

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js with TypeScript
- **Database**: Supabase (PostgreSQL)
- **Validation**: Joi
- **Blockchain**: Solana Web3.js + Anchor
- **Job Scheduler**: Node Cron
- **Oracle APIs**: Binance & CoinGecko
- **HTTP Client**: Axios

## Prerequisites

Before you begin, ensure you have:

- Node.js >= 18.x
- npm or yarn
- A Supabase account and project
- Solana CLI tools (optional, for keypair generation)
- Access to Solana RPC (Devnet/Mainnet)

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-org/cyphercast-backend.git
cd cyphercast-backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Generate a Solana keypair** (if you don't have one)

```bash
solana-keygen new --outfile ./keypair.json
```

## Configuration

1. **Create `.env` file**

```bash
cp .env.example .env
```

2. **Configure environment variables**

```env
# Server
PORT=5000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Solana
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_NETWORK=devnet
PROGRAM_ID=your-anchor-program-id
AUTHORITY_KEYPAIR_PATH=./keypair.json

# Oracle APIs
BINANCE_API_KEY=
BINANCE_API_URL=https://api.binance.com/api/v3
COINGECKO_API_URL=https://api.coingecko.com/api/v3

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Environment Variables Explained

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | Yes |
| `SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SOLANA_RPC_URL` | Solana RPC endpoint | Yes |
| `PROGRAM_ID` | Deployed Anchor program ID | Yes |
| `AUTHORITY_KEYPAIR_PATH` | Path to authority keypair JSON | Yes |
| `BINANCE_API_KEY` | Optional for higher rate limits | No |
| `CORS_ORIGIN` | Frontend URL for CORS | Yes |

## Database Setup

1. **Go to your Supabase project**

2. **Open SQL Editor**

3. **Run the schema script**

Copy and paste the contents of `schema.sql` (provided above) into the SQL editor and execute it.

The schema creates:
- `users` table
- `pools` table
- `predictions` table
- `leaderboard` table
- `activity` table
- Indexes for performance
- Row Level Security policies
- Triggers for timestamp updates

4. **Verify tables were created**

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

## Running the Server

### Development Mode

```bash
npm run dev
```

This starts the server with hot-reload using `ts-node-dev`.

### Production Mode

```bash
# Build TypeScript
npm run build

# Start server
npm start
```

### Health Check

Once running, verify the server:

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "success",
  "message": "CypherCast API is running",
  "data": {
    "status": "healthy",
    "timestamp": "2025-10-18T12:00:00.000Z",
    "environment": "development"
  }
}
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Response Format

All responses follow this structure:

**Success:**
```json
{
  "status": "success",
  "message": "Description",
  "data": { ... }
}
```

**Error:**
```json
{
  "status": "error",
  "message": "Error description",
  "error": "Details"
}
```

---

### Users Endpoints

#### Register User
```http
POST /api/users/register
```

**Body:**
```json
{
  "walletAddress": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "username": "alice" // optional
}
```

#### Get User Profile
```http
GET /api/users/:walletAddress
```

---

### Pools Endpoints

#### Get All Pools
```http
GET /api/pools?status=active
```

**Query Params:**
- `status`: `active` | `closed` (optional)

#### Get Pool by ID
```http
GET /api/pools/:id
```

#### Create Pool
```http
POST /api/pools/create
```

**Body:**
```json
{
  "assetSymbol": "BTC",
  "targetPrice": 45000,
  "endTime": "2025-10-20T12:00:00Z",
  "creator": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
}
```

#### Close Pool Manually
```http
POST /api/pools/:id/close
```

**Body:**
```json
{
  "finalizedBy": "admin_wallet_address" // optional
}
```

#### Finalize Pool
```http
POST /api/pools/:id/finalize
```

---

### Predictions Endpoints

#### Place Prediction
```http
POST /api/predictions
```

**Body:**
```json
{
  "poolId": "uuid-here",
  "userWallet": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "predictedPrice": 46000,
  "direction": "up",
  "amount": 10
}
```

#### Get User Predictions
```http
GET /api/predictions/:userWallet
```

#### Claim Reward
```http
POST /api/predictions/:id/claim
```

**Body:**
```json
{
  "userWallet": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
}
```

---

### Leaderboard Endpoints

#### Get Leaderboard
```http
GET /api/leaderboard?limit=10
```

**Query Params:**
- `limit`: Number of top users (default: 10)

#### Get User Stats
```http
GET /api/leaderboard/:walletAddress
```

---

### Statistics Endpoints

#### Get Platform Stats
```http
GET /api/stats/platform
```

**Response:**
```json
{
  "status": "success",
  "message": "Platform stats retrieved successfully",
  "data": {
    "totalPools": 150,
    "activePools": 25,
    "totalVolume": 50000,
    "activeUsers": 500,
    "totalPredictions": 2500
  }
}
```

#### Get Asset Stats
```http
GET /api/stats/assets
```

**Response:**
```json
{
  "status": "success",
  "message": "Asset stats retrieved successfully",
  "data": [
    {
      "assetSymbol": "BTC",
      "totalPools": 50,
      "totalVolume": 30000,
      "totalPredictions": 1000
    }
  ]
}
```

---

## Project Structure

```
/cyphercast-backend
├── src/
│   ├── config/
│   │   ├── env.ts              # Environment configuration
│   │   ├── supabaseClient.ts   # Supabase client setup
│   │   └── solanaClient.ts     # Solana/Anchor setup
│   ├── controllers/
│   │   ├── users.controller.ts
│   │   ├── pools.controller.ts
│   │   ├── predictions.controller.ts
│   │   ├── leaderboard.controller.ts
│   │   └── stats.controller.ts
│   ├── models/
│   │   ├── User.ts             # User database model
│   │   ├── Pool.ts             # Pool database model
│   │   ├── Prediction.ts       # Prediction database model
│   │   ├── Leaderboard.ts      # Leaderboard database model
│   │   └── Activity.ts         # Activity log model
│   ├── routes/
│   │   ├── users.routes.ts
│   │   ├── pools.routes.ts
│   │   ├── predictions.routes.ts
│   │   ├── leaderboard.routes.ts
│   │   └── stats.routes.ts
│   ├── services/
│   │   ├── solana/
│   │   │   ├── cyphercastClient.ts           # Anchor wrapper
│   │   │   └── poolFinalization.service.ts   # Finalization logic
│   │   ├── oracle.service.ts                 # Price oracle
│   │   └── leaderboard.service.ts            # Leaderboard logic
│   ├── jobs/
│   │   └── finalizePools.job.ts              # Cron job
│   ├── utils/
│   │   ├── constants.ts        # App constants
│   │   ├── errorHandler.ts     # Error handling
│   │   ├── response.ts         # Response helpers
│   │   └── validator.ts        # Joi validators
│   ├── app.ts                  # Express app setup
│   └── index.ts                # Server entry point
├── .env                        # Environment variables
├── .env.example                # Example env file
├── package.json
├── tsconfig.json
└── schema.sql                  # Database schema
```

## Cron Jobs

### Pool Finalization Job

**Schedule**: Every 1 minute

**What it does**:
1. Queries active pools with `end_time < now()`
2. Fetches final price from oracle (Binance/CoinGecko)
3. Calls Solana `finalize_pool()` instruction
4. Updates pool status to `closed`
5. Calculates winners/losers
6. Updates predictions and leaderboard

**Located in**: `src/jobs/finalizePools.job.ts`

To modify the schedule, edit the cron expression:
```typescript
cron.schedule('* * * * *', async () => { ... });
// * * * * * = every minute
// 0 * * * * = every hour
// 0 0 * * * = every day at midnight
```

## Testing

### Manual Testing

Use tools like Postman, Insomnia, or curl:

```bash
# Register a user
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    "username": "testuser"
  }'

# Create a pool
curl -X POST http://localhost:5000/api/pools/create \
  -H "Content-Type: application/json" \
  -d '{
    "assetSymbol": "BTC",
    "targetPrice": 45000,
    "endTime": "2025-10-20T12:00:00Z",
    "creator": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
  }'
```

### Integration Testing

For production, consider adding:
- Jest for unit tests
- Supertest for API testing
- Test database for isolated testing

## Deployment

### Deploying to Railway/Render/Heroku

1. **Prepare the app**
```bash
npm run build
```

2. **Set environment variables** in your hosting platform

3. **Configure start command**
```json
{
  "scripts": {
    "start": "node dist/index.js"
  }
}
```

4. **Deploy**
```bash
git push railway main  # or your platform
```

### Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t cyphercast-backend .
docker run -p 5000:5000 --env-file .env cyphercast-backend
```

### Important Production Considerations

1. **Security**
   - Never commit `.env` or `keypair.json`
   - Use environment variables for all secrets
   - Enable CORS only for your frontend domain
   - Implement rate limiting (e.g., express-rate-limit)

2. **Performance**
   - Use connection pooling for Supabase
   - Implement caching for frequently accessed data
   - Monitor API response times

3. **Monitoring**
   - Add logging (Winston/Pino)
   - Set up error tracking (Sentry)
   - Monitor cron job execution

4. **Scalability**
   - Use Redis for caching
   - Implement queue system for blockchain transactions
   - Consider horizontal scaling

## Troubleshooting

### Common Issues

**1. Supabase Connection Error**
```
Error: Missing environment variable: SUPABASE_URL
```
**Solution**: Ensure `.env` file exists and contains valid Supabase credentials.

**2. Solana RPC Error**
```
Failed to create pool on-chain
```
**Solution**: 
- Verify `SOLANA_RPC_URL` is accessible
- Check your keypair has sufficient SOL
- Ensure `PROGRAM_ID` is correct

**3. Oracle Price Fetch Failed**
```
Failed to fetch price from Binance
```
**Solution**: Falls back to CoinGecko automatically. Check API rate limits.

**4. Cron Job Not Running**
```
Pool finalization job not triggering
```
**Solution**: Verify cron service started in `index.ts` and check server logs.
