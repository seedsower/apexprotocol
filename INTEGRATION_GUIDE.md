# 🏔️ NG Token Integration Guide - Apex Commodities

## 🎯 **What You Need to Complete the Integration**

To integrate your NG token into the NG-PERP market in Apex Commodities, you need the following information about your token:

### **Required Information:**
1. **NG Token Mint Address** - The Solana address of your NG token contract
2. **Token Decimals** - Number of decimal places (usually 6 or 9)
3. **Current Price** - Current market price of your NG token
4. **Oracle Information** (Optional) - Price feed source for real-time pricing

## 📝 **Step-by-Step Integration**

### **Step 1: Update Token Configuration**

Edit the file `src/config/tokens.ts` and replace the placeholder values:

```typescript
'NG': {
  // 🔧 REPLACE THESE WITH YOUR ACTUAL VALUES:
  mintAddress: 'YOUR_ACTUAL_NG_TOKEN_MINT_ADDRESS', // e.g., 'NGPiX7aDNUQK1R3mFJNxFGAG9P4xD7nGz2e8Dh5W3v4K'
  decimals: 9, // Replace with your token's actual decimals
  symbol: 'NG',
  name: 'Natural Gas Token',
  oracleType: 'pyth', // or 'switchboard' or 'custom'
  pythPriceId: 'YOUR_PYTH_PRICE_FEED_ID', // Optional
},
```

### **Step 2: Find Your Token Information**

#### **Method 1: Using Solana Explorer**
1. Go to [Solana Explorer](https://explorer.solana.com/)
2. Search for your NG token by name or partial address
3. Find the **Mint Address** and **Decimals** in the token details

#### **Method 2: Using Solscan**
1. Go to [Solscan.io](https://solscan.io/)
2. Search for your token
3. Copy the mint address and decimal information

#### **Method 3: Using CLI (if you have Solana CLI)**
```bash
spl-token account-info <YOUR_TOKEN_MINT_ADDRESS>
```

### **Step 3: Configure Oracle (Optional)**

#### **For Pyth Price Feeds:**
1. Visit [Pyth Network](https://pyth.network/price-feeds)
2. Search for natural gas or your specific token
3. Copy the Price Feed ID
4. Update `pythPriceId` in the configuration

#### **For Custom Oracle:**
```typescript
'NG': {
  mintAddress: 'YOUR_NG_TOKEN_MINT',
  decimals: 9,
  symbol: 'NG',
  name: 'Natural Gas Token',
  oracleType: 'custom',
  customOracleAddress: 'YOUR_ORACLE_CONTRACT_ADDRESS',
},
```

## 🚀 **What You'll Get After Integration**

### **✅ Features Available:**

1. **Real Token Balance Display** - See your actual NG token balance in the sidebar
2. **Market Trading** - Trade NG-PERP contracts using your real token
3. **Position Tracking** - Monitor your NG positions in real-time
4. **Price Updates** - Live price feeds (if oracle configured)
5. **Transaction History** - Track all your NG-related trades

### **🔧 UI Components Added:**

- **Token Balances Panel** - Shows all your commodity token balances
- **NG-PERP Market** - Fully functional perpetual contract market
- **Integration Status** - Visual indicator showing configuration status
- **Real-time Updates** - Automatic balance and position updates

## 📋 **Example Complete Configuration**

Here's what your completed configuration might look like:

```typescript
export const COMMODITY_TOKENS: Record<string, TokenConfig> = {
  'NG': {
    mintAddress: 'NGas1234567890abcdef1234567890abcdef12345678', // Your actual mint
    decimals: 6, // Your token's decimals
    symbol: 'NG',
    name: 'Natural Gas Token',
    oracleType: 'pyth',
    pythPriceId: 'ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace', // Real Pyth ID
  },
  // ... other tokens
};
```

## 🔄 **Testing Your Integration**

### **Step 1: Restart the Development Server**
```bash
npm run dev
```

### **Step 2: Connect Your Wallet**
- Use the "Connect Wallet" button in the app
- Select your preferred wallet (Phantom, Solflare, etc.)

### **Step 3: Check Token Balance**
- Look at the "Commodity Token Balances" panel in the trade page
- Your NG token should show the correct balance
- Integration status should show "Configured" 

### **Step 4: Test Trading**
- Select "NG-PERP" from the market selector
- Place a small test order
- Verify the transaction works correctly

## 🎯 **Real vs Mock Trading**

### **Current State (Mock Mode):**
- ✅ UI works with your real token configuration
- ✅ Shows actual token balances
- ⚠️ Trades are simulated (not real blockchain transactions)
- ⚠️ Uses mock price data

### **For Real Trading (Future Enhancement):**
To enable real blockchain trading, you'll need to:
1. **Integrate Drift SDK** - Connect to actual Drift Protocol
2. **Configure Markets** - Set up real perpetual contract markets
3. **Oracle Integration** - Connect to live price feeds
4. **Liquidity** - Ensure sufficient market liquidity

## 🚨 **Important Notes**

### **Security:**
- Never commit your private keys to version control
- Always test with small amounts first
- Verify all addresses before making large transactions

### **Mainnet vs Devnet:**
- Current configuration points to Devnet by default
- For mainnet, update RPC URLs in `.env.local`
- Ensure your token exists on the target network

### **Gas Fees:**
- All transactions require SOL for gas fees
- Keep some SOL in your wallet for transactions
- Devnet SOL is free (use [Solana Faucet](https://faucet.solana.com/))

## 📞 **Support & Troubleshooting**

### **Common Issues:**

1. **"Token account not found"**
   - Make sure your wallet holds the NG token
   - Verify the mint address is correct

2. **"Invalid mint address"**
   - Double-check the token mint address format
   - Ensure it's a valid Solana public key

3. **Balance shows 0**
   - Confirm you actually hold the tokens
   - Check if you're on the right network (mainnet/devnet)

4. **Integration status shows "Needs Setup"**
   - Make sure you replaced the placeholder values
   - Restart the development server after changes

### **Need Help?**
If you encounter issues:
1. Check the browser console for error messages
2. Verify your token exists on Solana Explorer
3. Test with a known working token first
4. Make sure your wallet is connected to the correct network

---

## 🎉 **You're Ready!**

Once you've completed these steps, your NG token will be fully integrated into the Apex Commodities trading platform. You'll be able to see your real token balance and interact with the NG-PERP market using your actual tokens! 