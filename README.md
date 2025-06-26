# legacyON APTOS - SimpleWill Blockchain Will Contract

A decentralized will-like contract built on the Aptos blockchain that allows users to deposit APT tokens and designate a recipient who can claim the funds. This project combines a Move smart contract with a modern React frontend for a complete dApp experience.

## 🏗️ Project Overview

legacyON APTOS SimpleWill is a trustless, decentralized solution for managing digital assets as a will. The contract allows an owner to:
- Deposit APT tokens into a secure contract
- Designate a recipient who can claim the funds
- Maintain full control over the will until the recipient claims the funds

#address
-https://explorer.aptoslabs.com/txn/0x6615658c6f7a8fdeaaf4dc5ffad498c6d6d94e5c5285bb47808d7f707396f252?network=testnet

## ✨ Features

### Smart Contract Features
- **Secure Deposits**: Deposit APT tokens into the will contract
- **Recipient Management**: Set and change the designated recipient
- **Fund Claiming**: Recipients can claim deposited funds
- **Balance Tracking**: View current contract balance
- **Access Control**: Only owner can deposit and set recipient, only recipient can claim

### Frontend Features
- **Modern UI**: Built with React, Next.js, and Tailwind CSS
- **Wallet Integration**: Seamless Aptos wallet connection
- **Real-time Updates**: Live balance and transaction status
- **Responsive Design**: Works on desktop and mobile devices
- **PWA Support**: Progressive Web App capabilities

## 🏛️ Smart Contract Architecture

### Core Resources

```move
struct Will has key {
    owner: address,           // Contract owner
    recipient: address,       // Designated recipient
    amount: u64,             // Total deposited amount
    balance: coin::Coin<AptosCoin>, // Actual coin balance
}
```

### Key Functions

- `initialize(account)` - Initialize a new will contract
- `deposit(account, amount)` - Deposit APT tokens
- `set_recipient(account, recipient_addr)` - Set or change recipient
- `claim(account)` - Claim deposited funds (recipient only)
- `get_balance(account_addr)` - View contract balance

### Error Handling

The contract includes comprehensive error handling for:
- Uninitialized contracts
- Unauthorized access
- Invalid recipient addresses
- Insufficient funds

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Aptos CLI (optional, for direct contract interaction)
- Aptos wallet (Petra, Martian, or other compatible wallet)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd legacyonchain
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Deploy the smart contract**
   ```bash
   npm run move:publish
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📋 Available Scripts

### Smart Contract Commands
```bash
npm run move:test      # Run Move unit tests
npm run move:compile   # Compile the Move contract
npm run move:publish   # Publish contract to Aptos network
npm run move:upgrade   # Upgrade existing contract
```

### Frontend Commands
```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
npm run deploy        # Deploy to Vercel
npm run lint          # Run ESLint
npm run fmt           # Format code with Prettier
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_APTOS_NETWORK=devnet  # or mainnet, testnet
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... # Your deployed contract address
```

### Contract Configuration

The contract address is configured in `contract/Move.toml`:

```toml
[addresses]
contract = "0x886e62f62be5436e4c8501c7615793d496ae1e123d3457823e7f54a0797e6817"
```

## 💡 Usage Guide

### For Will Owners

1. **Initialize Your Will**
   - Connect your wallet
   - Click "Initialize Will" to create your will contract

2. **Set Recipient**
   - Enter the recipient's Aptos address
   - Click "Set Recipient" to designate who can claim your funds

3. **Deposit Funds**
   - Enter the amount of APT to deposit
   - Click "Deposit" to add funds to your will

### For Recipients

1. **Claim Funds**
   - Connect your wallet (must be the designated recipient)
   - Click "Claim Funds" to withdraw the deposited APT

### Viewing Information

- **Check Balance**: View the current balance of any will contract
- **Transaction History**: Monitor all transactions through your wallet

## 🛡️ Security Features

- **Access Control**: Only authorized users can perform specific actions
- **Input Validation**: All inputs are validated before processing
- **Error Handling**: Comprehensive error messages for debugging
- **Immutable Logic**: Contract logic cannot be changed after deployment

## 🧪 Testing

### Run Unit Tests
```bash
npm run move:test
```

### Test Coverage
The contract includes tests for:
- Contract initialization
- Deposit functionality
- Recipient management
- Fund claiming
- Error conditions

## 📦 Dependencies

### Smart Contract
- **Aptos Framework**: Core Aptos blockchain functionality
- **Move Standard Library**: Standard Move language features

### Frontend
- **Next.js**: React framework
- **Aptos TS SDK**: Aptos blockchain integration
- **Aptos Wallet Adapter**: Wallet connection management
- **Tailwind CSS**: Styling framework
- **shadcn/ui**: UI component library
- **React Query**: Data fetching and caching

## 🌐 Deployment

### Smart Contract Deployment

1. **Compile the contract**
   ```bash
   npm run move:compile
   ```

2. **Publish to network**
   ```bash
   npm run move:publish
   ```

3. **Update contract address**
   Update the address in your environment variables

### Frontend Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npm run deploy
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

- **Documentation**: Check the [Aptos Developer Portal](https://aptos.dev/)
- **Community**: Join the [Aptos Discord](https://discord.gg/aptos)
- **Issues**: Report bugs and feature requests via GitHub Issues

## ⚠️ Disclaimer

This software is provided "as is" without warranty. Users should conduct their own security audits and testing before using this contract for significant financial transactions. The developers are not responsible for any loss of funds or other damages.

---

**Built with ❤️ by legacyON APTOS**
# LegacyON-APTOS
