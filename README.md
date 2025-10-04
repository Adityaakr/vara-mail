# Vara Network - Passwordless Authentication

A Next.js application that integrates passwordless authentication with Vara Network for seamless Web3 onboarding and native VARA token transactions.

## 🌟 Features

- **📧 Email OTP Authentication**: Secure passwordless login via email verification
- **🔗 Vara Network Integration**: Direct connection to Vara Network testnet (`wss://testnet.vara.network`)
- **🏠 Native VARA Addresses**: Uses Vara Network's native SS58 address format (starts with k, g, h, etc.)
- **💰 VARA Transactions**: Send native VARA tokens on Vara Network testnet
- **🎨 Modern UI**: Clean, responsive interface with Vara Network branding

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Your authentication API key is already configured. The app uses:
- **Publishable Key**: `pk_live_4D9D3DA5E9716545`
- **Network**: Vara Network Testnet
- **RPC Endpoint**: `wss://testnet.vara.network`

### 3. Configure Authentication Service

**Important**: Add these domains to your authentication service allowlist:
1. Go to authentication service dashboard
2. Navigate to your project settings
3. Add to domain allowlist:
   - `localhost:3000`
   - `127.0.0.1:3000`
   - `127.0.0.1:53199`

### 4. Run the Application

```bash
# Development server
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) to access your Vara Network app.

## 🎯 Usage

### Email Authentication
1. Enter your email address
2. Check your email for secure OTP code
3. Complete authentication to get your Vara Network address

### Google OAuth
1. Click "Login with Google"
2. Complete OAuth flow
3. Automatic redirect back to Vara Network app

### VARA Token Transactions
1. After login, view your Vara Network address (format: `kGgw...`)
2. Get testnet VARA tokens from the faucet
3. Enter destination Vara Network address and amount
4. Send VARA tokens on Vara Network testnet

## 📁 Project Structure

```
├── app/
│   ├── auth/callback/     # OAuth callback for Vara Network
│   ├── globals.css        # Vara Network themed styles
│   ├── layout.js          # Root layout with Vara branding
│   └── page.js            # Main Vara Network application
├── auth/
│   ├── email.js           # Email OTP for Vara Network
│   └── google.js          # Google OAuth for Vara Network
├── chain/
│   └── transfer.js        # VARA token transaction functions
├── lib/
│   └── magic.js           # Magic.link + Vara Network configuration
└── env.example            # Environment template
```

## 🔧 Magic.link Extensions

- **@magic-ext/polkadot**: Provides `getAccount()` and `sendTransaction()` for Vara Network
- **@magic-ext/oauth2**: Enables Google OAuth for Vara Network authentication

## 🌐 Vara Network Details

- **Network**: Vara Network Testnet
- **RPC Endpoint**: `wss://testnet.vara.network`
- **Native Token**: VARA
- **Address Format**: SS58 with Vara prefix (kGgw..., gH8E..., hN9F...)
- **Explorer**: [vara.subscan.io](https://vara.subscan.io)
- **Faucet**: [Vara Network Testnet Faucet](https://idea.gear-tech.io/programs?node=wss%3A%2F%2Ftestnet.vara.network)

## 🛠️ Technical Implementation

The app follows Magic.link best practices for Vara Network:

```javascript
// Vara Network Magic.link setup
new Magic('pk_live_4D9D3DA5E9716545', {
  extensions: [
    new PolkadotExtension({ rpcUrl: 'wss://testnet.vara.network' }),
    new OAuthExtension(),
  ],
});
```

## 🚨 Troubleshooting

### Domain Allowlist Error
- Add your domains to Magic.link dashboard allowlist
- Ensure `localhost:3000` is included

### Build Issues
```bash
rm -rf .next node_modules
npm install
npm run build
```

## 📚 Learn More

- [Vara Network Documentation](https://vara.network/docs)
- [Magic.link Documentation](https://magic.link/docs)
- [Next.js Documentation](https://nextjs.org/docs)
# vara-mail
