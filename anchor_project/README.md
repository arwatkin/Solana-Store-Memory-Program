# Memory Storage Solana Program

## Deployed Program

https://solscan.io/account/EGspw3uLPvcW6CdH41x9kMuLQRF6jN7Qo8zMkyv9eYTn?cluster=devnet

## Overview
This Solana program allows users to store and manage personal memory strings on the blockchain using the Anchor framework. Each user gets their own PDA (Program Derived Address) account where they can store a memory string of up to 250 characters.

### Features
- Store personal memories on the Solana blockchain
- User-specific storage using PDAs
- Memory size validation
- Transaction logging
- Security measures through Anchor's account validation

## Building and Testing Locally

### Prerequisites
- Rust and Cargo (latest stable version)
- Solana CLI tools (v1.18.18)
- Anchor CLI (v0.30.1)
- Node.js and npm (for testing)

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/School-of-Solana/program-arwatkin.git
cd program-arwatkin
cd anchor_project
```

2. Install Anchor dependencies:
```bash
yarn install
```

3. Build the program:
```bash
anchor build
```

### Testing

1. Run the tests:
```bash
anchor test
```

### Deployment

1. Build the program:
```bash
anchor build
```

2. Deploy to localnet:
```bash
anchor deploy
```

For devnet deployment:
```bash
anchor deploy --provider.cluster devnet
```

## Program Structure

- `lib.rs`: Main program entry point and instruction definitions
- `states.rs`: Account structures and constants
- `errors.rs`: Custom error definitions
- `instructions/`: Contains program instruction logic
  - `store_memory.rs`: Memory storage implementation
  - `mod.rs`: Module declarations

## Account Structure

The program uses the following accounts:
- `Memory`: Stores the user's memory string
- `user`: The signer of the transaction
- `system_program`: Required for account creation

## Security Considerations

- Memory length is limited to 250 characters
- PDAs ensure each user can only access their own memory account
- Anchor's account validation prevents unauthorized access
