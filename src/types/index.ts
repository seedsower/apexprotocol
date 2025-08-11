// TODO: Import these from Drift SDK once properly configured
// import {
//   UserAccount,
//   PerpMarketAccount,
//   SpotMarketAccount,
//   OrderParams,
//   PerpPosition,
//   SpotPosition
// } from '../../sdk/src/types';
// Temporarily use any to resolve TypeScript issues
// import { PublicKey } from '@solana/web3.js';
type PublicKey = any;

// UI-specific market data with additional computed fields
export interface UIMarketData {
	marketIndex: number;
	symbol: string;
	baseAssetSymbol: string;
	quoteAssetSymbol?: string;
	oracleSource: string;
	marketType: 'perp' | 'spot';
	lastPrice: number;
	markPrice?: number; // Current mark price for trading
	oraclePrice?: number; // Oracle price feed
	priceChange24h: number;
	volume24h: number;
	openInterest?: number;
	funding?: number;
	isActive: boolean;
	// Real token integration properties
	tokenMint?: string;
	decimals?: number;
	pythPriceId?: string;
	switchboardFeedId?: string;
	customOracleAddress?: string;
	marketAccount: any; // PerpMarketAccount | SpotMarketAccount
}

// Enhanced position data for UI display
export interface UIPosition {
	marketIndex: number;
	symbol: string;
	side: 'long' | 'short' | 'none';
	size: number;
	notionalValue: number;
	entryPrice: number;
	markPrice: number;
	unrealizedPnl: number;
	unrealizedPnlPercent: number;
	marketType: 'perp' | 'spot';
	liquidationPrice?: number;
	position: any; // PerpPosition | SpotPosition
}

// Order form data
export interface OrderFormData {
	marketIndex: number;
	marketType?: 'perp' | 'spot';
	orderType: 'market' | 'limit' | 'stopMarket' | 'stopLimit';
	side: 'buy' | 'sell';
	amount: string;
	price?: string;
	stopPrice?: string;
	reduceOnly: boolean;
	postOnly: boolean;
	ioc: boolean;
	timeInForce: 'GTC' | 'IOC' | 'FOK';
}

// Market selector state
export interface MarketSelectorState {
	selectedMarket: UIMarketData | null;
	searchTerm: string;
	marketType: 'all' | 'perp' | 'spot';
	sortBy: 'symbol' | 'volume' | 'priceChange';
	sortDirection: 'asc' | 'desc';
}

// Wallet connection state
export interface WalletState {
	connected: boolean;
	connecting: boolean;
	publicKey: PublicKey | null;
	balance: number;
}

// DriftService state
export interface DriftServiceState {
	initialized: boolean;
	connected: boolean;
	user: any | null; // UserAccount
	markets: UIMarketData[];
	positions: UIPosition[];
	loading: boolean;
	error: string | null;
}

// Event types for real-time updates
export interface MarketUpdateEvent {
	marketIndex: number;
	price: number;
	volume24h: number;
	priceChange24h: number;
}

export interface PositionUpdateEvent {
	marketIndex: number;
	size: number;
	unrealizedPnl: number;
	markPrice: number;
}

// Configuration
export interface AppConfig {
	rpcUrl: string;
	wsUrl?: string;
	programId: string;
	commitment: 'confirmed' | 'finalized' | 'processed';
	environment: 'mainnet-beta' | 'devnet' | 'localnet';
	apiKey?: string; // Optional API key for RPC endpoints (e.g., Tatum)
}
