# ChainScope 🔍

> Unmask the blockchain. Every address tells a story.

ChainScope is a cryptocurrency address intelligence system that collects, 
analyzes, and categorizes Bitcoin and Ethereum wallet addresses using 
on-chain data — identifying whales, exchanges, mixers, dormant wallets, 
and suspicious actors automatically.

## What it does

- Submit any BTC or ETH address
- Pulls live transaction history, balance, and activity from public blockchain APIs
- Runs it through a categorization engine
- Labels it: `exchange` `whale` `mixer` `dormant` `suspicious` `clean` `unknown`
- Stores everything for search, filter, and review

## Tech Stack

- **Backend:** Node.js + Express
- **Database:** SQLite
- **Blockchain APIs:** Etherscan (Ethereum) · Blockchain.info (Bitcoin)
- **Frontend:** HTML/CSS/JS
- **Deployment:** Render

## Quickstart

git clone https://github.com/yourname/chainscope
cd chainscope
npm install
npm start

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /address | Submit address for analysis |
| GET | /address/:id | Get full analysis |
| GET | /addresses | List all with filters |
| GET | /analyze/:address | Live lookup, no storage |
| DELETE | /address/:id | Remove an address |

## Categories

| Label | Criteria |
|-------|----------|
| 🐋 whale | Balance > 1000 ETH or > 100 BTC |
| 💤 dormant | No activity in 2+ years |
| 🏦 exchange | Matches known hot wallet list |
| 🌀 mixer | High-frequency equal-value shuffling |
| ⚠️ suspicious | Interacted with mixers or sanctioned addresses |
| ✅ clean | Regular activity, no red flags |
| ❓ unknown | Insufficient data |

## Built for SIH 2025 — Problem Statement #25228