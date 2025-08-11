<div align="center">
  <img height="120x" src="https://uploads-ssl.webflow.com/611580035ad59b20437eb024/616f97a42f5637c4517d0193_Logo%20(1)%20(1).png" />

  <h1 style="margin-top:20px;">Drift Protocol v2</h1>

  <p>
    <a href="https://drift-labs.github.io/v2-teacher/"><img alt="Docs" src="https://img.shields.io/badge/docs-tutorials-blueviolet" /></a>
    <a href="https://discord.com/channels/849494028176588802/878700556904980500"><img alt="Discord Chat" src="https://img.shields.io/discord/889577356681945098?color=blueviolet" /></a>
    <a href="https://opensource.org/licenses/Apache-2.0"><img alt="License" src="https://img.shields.io/github/license/project-serum/anchor?color=blueviolet" /></a>
  </p>
</div>

# Drift Protocol v2

This repository provides open source access to Drift V2's Typescript SDK, Solana Programs, and more.

Integrating Drift? [Go here](./sdk/README.md)

# SDK Guide

SDK docs can be found [here](./sdk/README.md)

# Example Bot Implementations

Example bots (makers, liquidators, fillers, etc) can be found [here](https://github.com/drift-labs/keeper-bots-v2)

# Building Locally

Note: If you are running the build on an Apple computer with an M1 chip, please set the default rust toolchain to `stable-x86_64-apple-darwin`

```bash
rustup default stable-x86_64-apple-darwin
```

## Compiling Programs

```bash
# build v2
anchor build
# install packages
yarn
# build sdk
cd sdk/ && yarn && yarn build && cd ..
```

## Running Rust Test

```bash
cargo test
```

## Running Javascript Tests

```bash
bash test-scripts/run-anchor-tests.sh
```

# Bug Bounty

Information about the Bug Bounty can be found [here](./bug-bounty/README.md)

# Apex Drift - Commodities Trading UI

A high-performance commodities trading platform built on Drift Protocol v2, featuring real-time market data, advanced order management, and institutional-grade trading tools.

## 🚀 Features

- **Real-time Market Data**: Live price feeds, volume, and market statistics
- **Advanced Order Types**: Market, limit, stop-market, and stop-limit orders
- **Portfolio Management**: Real-time position tracking with PnL calculations
- **Wallet Integration**: Support for Phantom, Solflare, and other Solana wallets
- **Responsive Design**: Modern UI built with Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## 🏗️ Architecture

### Core Components

1. **DriftService** (`src/services/DriftService.ts`)
   - Manages all Drift SDK interactions
   - Handles wallet connections and user account management
   - Provides real-time market and position data
   - Manages order placement and cancellation

2. **DriftProvider** (`src/providers/DriftProvider.tsx`)
   - React Context for global state management
   - Automatically initializes when wallet connects
   - Provides service instance to all components

3. **Custom Hooks**
   - `useMarkets()`: Market data with filtering and sorting
   - `usePositions()`: Real-time position tracking

4. **Trading Interface**
   - Market selector with search and filtering
   - Interactive chart area (ready for TradingView integration)
   - Comprehensive positions table
   - Advanced order form with validation

## 📋 Prerequisites

- Node.js 18+ 
- A Solana wallet (Phantom, Solflare, etc.)
- RPC endpoint (Alchemy, QuickNode, or custom)

## 🛠️ Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_RPC_URL=https://api.mainnet-beta.solana.com
   NEXT_PUBLIC_PROGRAM_ID=dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH
   NEXT_PUBLIC_SOLANA_ENV=mainnet-beta
   NEXT_PUBLIC_COMMITMENT=confirmed
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🎯 Usage

### Getting Started

1. **Connect Your Wallet**: Click "Connect Wallet" and select your preferred Solana wallet
2. **Create Trading Account**: If you don't have a Drift account, create one by signing a transaction
3. **Select a Market**: Browse and select from available perpetual and spot markets
4. **Start Trading**: Place orders using the order form

### Trading Features

- **Market Orders**: Execute immediately at current market price
- **Limit Orders**: Set specific price levels for execution
- **Stop Orders**: Trigger orders when price reaches specified levels
- **Advanced Options**: Reduce-only, post-only, and immediate-or-cancel flags

### Portfolio Management

- **Real-time Positions**: Monitor all open positions with live P&L
- **Market Overview**: Quick access to price changes and volume data
- **Order History**: Track all trading activity (coming soon)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_RPC_URL` | Solana RPC endpoint | `https://api.mainnet-beta.solana.com` |
| `NEXT_PUBLIC_PROGRAM_ID` | Drift program ID | `dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH` |
| `NEXT_PUBLIC_SOLANA_ENV` | Network environment | `mainnet-beta` |
| `NEXT_PUBLIC_COMMITMENT` | Transaction commitment level | `confirmed` |

### Supported Networks

- **Mainnet Beta**: Production environment
- **Devnet**: Development and testing
- **Localnet**: Local validator for development

## 🧩 Extending the Application

### Adding New Features

1. **Custom Indicators**: Extend the chart component with technical analysis
2. **Advanced Orders**: Implement bracket orders, trailing stops, etc.
3. **Risk Management**: Add position sizing and risk controls
4. **Analytics**: Integrate trading performance metrics

### Chart Integration

The chart component is ready for TradingView integration:

```typescript
// In src/components/Chart.tsx
// Replace placeholder with TradingView widget
const TradingViewWidget = () => {
  // TradingView widget implementation
};
```

### Custom Markets

To add support for additional markets:

```typescript
// In src/services/DriftService.ts
// Extend fetchMarkets() method to include custom market filtering
```

## 🛡️ Security

- **Wallet Security**: All private keys remain in your wallet
- **Transaction Signing**: Every transaction requires user approval
- **Environment Variables**: Never commit sensitive data to version control
- **Audited Protocol**: Built on the audited Drift Protocol v2

## 📚 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
npm run prettify     # Check code formatting
```

### Project Structure

```
src/
├── components/          # React components
│   ├── Chart.tsx       # Market chart (ready for TradingView)
│   ├── MarketSelector.tsx
│   ├── OrderForm.tsx
│   └── PositionsTable.tsx
├── hooks/              # Custom React hooks
│   ├── useMarkets.ts
│   └── usePositions.ts
├── providers/          # React context providers
│   ├── DriftProvider.tsx
│   └── WalletProviders.tsx
├── services/           # Business logic layer
│   └── DriftService.ts # Main Drift SDK interface
└── types/              # TypeScript type definitions
    └── index.ts
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Drift Protocol Docs](https://docs.drift.trade)
- **Discord**: Join the Drift community
- **Issues**: Report bugs via GitHub Issues

## 🙏 Acknowledgments

- **Drift Protocol**: For providing the underlying trading infrastructure
- **Solana**: For the high-performance blockchain platform
- **Next.js**: For the excellent React framework
- **Tailwind CSS**: For the utility-first CSS framework

---

**⚠️ Risk Warning**: Trading cryptocurrencies and derivatives involves substantial risk and may not be suitable for all investors. Past performance is not indicative of future results.
