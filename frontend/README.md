# Memory Storage Frontend

## Deployed Frontend

https://store-memory.netlify.app/

## Overview
This is the frontend application for the Memory Storage Solana program. Built with Vite and React, it provides a user-friendly interface for interacting with the Solana program to store on the blockchain.

## Prerequisites
- Node.js (v23.1.0)
- npm (v9.6.2)
- A Solana wallet (like Phantom) installed in your browser
- Access to a Solana RPC endpoint (local or devnet)

## Installation and Setup

1. Clone the repository:
```bash
git clone https://github.com/School-of-Solana/program-arwatkin.git
cd program-arwatkin
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Build the application:
```bash
npx vite build
```

4. Start the development server:
```bash
npm run dev
```

The application should now be running at `http://localhost:8888` (or another port if 8888 is in use).

## Troubleshooting

Common issues and solutions:

1. Wallet Connection Issues:
   - Ensure your wallet is installed and unlocked
   - Check if you're wallet is on the correct network (Devnet)

2. Transaction Errors:
   - Verify you have sufficient SOL for transactions
   - Check the browser console for detailed error messages

