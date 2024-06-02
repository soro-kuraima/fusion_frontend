# Fusion - Frontend

![Made-With-React](https://img.shields.io/badge/MADE%20WITH-NEXT-000000.svg?colorA=222222&style=for-the-badge&logoWidth=14&logo=nextdotjs)
![Made-With-Tailwind](https://img.shields.io/badge/MADE%20WITH-TAILWIND-06B6D4.svg?colorA=222222&style=for-the-badge&logoWidth=14&logo=tailwindcss)
![Made-With-Javascript](https://img.shields.io/badge/MADE%20WITH-Javascript-ffd000.svg?colorA=222222&style=for-the-badge&logoWidth=14&logo=javascript)
![Made-With-ChainLink](https://img.shields.io/badge/MADE%20WITH-ChainLink-fef8f4.svg?colorA=222222&style=for-the-badge&logoWidth=14)
![Made-With-Noir](https://img.shields.io/badge/MADE%20WITH-NOIR-f2c2b6.svg?colorA=222222&style=for-the-badge&logoWidth=14)

> Fusion is a multi-chain smart contract wallet that leverages ChainLink Functions and zero-knowledge proofs for cross-chain deployments and authentication. It also uses Avalanche Sub-Chain to provide unified Gas Credits and indexing transactions.

This is the frontend for the _[getFusion.tech](https://getFusion.tech/)_ hackathon project at [Chainlink BlockMagic Hackathon 2024](https://chain.link/hackathon). The repository was scaffolded with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

> **Deployments and Subscriptions:**
>
> - Verified contracts - [Fusion-Contracts](https://github.com/FusionWallet/fusion_contracts)
> - Active ChainLink Functions Subscription - [Fusion-Backend](https://github.com/FusionWallet/fusion_backend)

> **Pre-requisites:**
>
> - Setup Node.js v18+ (recommended via [nvm](https://github.com/nvm-sh/nvm) with `nvm install 18`)
> - Install [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
> - Clone this repository

```bash
# Install dependencies
npm install

# fill environments
cp .env.local.example .env.local
```

## Development

```bash
# Start development server
npm run dev

# Build production frontend & start server
npm run build
npm run start
```
