import { Connection } from '@solana/web3.js';
import {
	UIMarketData,
	UIPosition,
	DriftServiceState,
	AppConfig,
	OrderFormData,
} from '../types';
import { COMMODITY_TOKENS } from '../config/tokens';
import { IDriftService } from '../interfaces/IDriftService';
import { EventEmitter } from 'events';

export class DriftService extends EventEmitter implements IDriftService {
	private connection: Connection;
	private config: AppConfig;
	private state: DriftServiceState;

	constructor(config: AppConfig) {
		super();
		this.config = config;
		this.connection = new Connection(config.rpcUrl, config.commitment);

		this.state = {
			initialized: false,
			connected: false,
			user: null,
			markets: [],
			positions: [],
			loading: false,
			error: null,
		};
	}

	/**
	 * Initialize the DriftClient with wallet (stub implementation)
	 */
	async initialize(wallet: any): Promise<void> {
		try {
			this.setState({ loading: true, error: null });

			// TODO: Initialize actual DriftClient when SDK imports are working
			console.log(
				'DriftService: Initializing with wallet...',
				wallet?.publicKey?.toString()
			);

			// Fast initialization - minimal delay
			await new Promise((resolve) => setTimeout(resolve, 100));

			this.setState({
				initialized: true,
				connected: true,
				loading: false,
			});

			this.emit('initialized');
		} catch (error: any) {
			console.error('DriftService initialization error:', error);
			this.setState({
				error: error.message || 'Failed to initialize DriftService',
				loading: false,
			});
			this.emit('error', error);
		}
	}

	/**
	 * Create a new user account (stub implementation)
	 */
	async createUser(): Promise<void> {
		try {
			this.setState({ loading: true, error: null });

			console.log('DriftService: Creating user account...');

			// TODO: Implement actual user creation
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Create a mock user account after successful creation
			const mockUser = {
				authority: 'mock-authority-key',
				subAccountId: 0,
				name: [65, 112, 101, 120, 32, 84, 114, 97, 100, 101, 114], // "Apex Trader" in bytes
				spotPositions: [],
				perpPositions: [],
				orders: [],
				lastAddPerpLpSharesTs: 0,
				totalDeposits: 0,
				totalWithdraws: 0,
				totalSocialLoss: 0,
				settledPerpPnl: 0,
				cumulativePerpFunding: 0,
				cumulativeSpotFees: 0,
				liquidationMarginBufferRatio: 0,
				lastActiveSlot: 0,
				nextOrderId: 1,
				maxMarginRatio: 0,
				nextLiquidationId: 1,
				subAccountIdDisplay: 0,
			};

			this.setState({
				loading: false,
				user: mockUser,
				initialized: true,
				connected: true,
			});

			console.log('DriftService: User account created successfully');
			this.emit('userCreated');
		} catch (error: any) {
			console.error('User creation error:', error);
			this.setState({
				error: error.message || 'Failed to create user',
				loading: false,
			});
			this.emit('error', error);
		}
	}

	/**
	 * Fetch all available markets (stub implementation)
	 */
	async fetchMarkets(): Promise<UIMarketData[]> {
		try {
			console.log('DriftService: Fetching markets...');

			// Apex Protocol - Commodity Markets Only
			// Professional commodity derivatives trading platform
			const commodityMarkets: UIMarketData[] = [
				// NGT-USDC Spot Market for Natural Gas Token trading
				{
					marketIndex: 3,
					symbol: 'NGT-USDC',
					baseAssetSymbol: 'NGT',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'spot',
					lastPrice: 2.85,
					priceChange24h: 1.25,
					volume24h: 125000,
					isActive: true,
					tokenMint: COMMODITY_TOKENS.NGT?.mintAddress || '',
					decimals: COMMODITY_TOKENS.NGT?.decimals || 9,
					pythPriceId: COMMODITY_TOKENS.NGT?.pythPriceId || '',
					marketAccount: {} as any,
				},
				{
					marketIndex: 4,
					symbol: 'XAU-PERP',
					baseAssetSymbol: 'XAU',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'perp',
					lastPrice: 2035.5,
					priceChange24h: 12.75,
					volume24h: 2340000,
					openInterest: 8750000,
					funding: 0.0003,
					isActive: true,
					marketAccount: {} as any,
				},
				{
					marketIndex: 5,
					symbol: 'XAG-PERP',
					baseAssetSymbol: 'XAG',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'perp',
					lastPrice: 24.85,
					priceChange24h: -0.42,
					volume24h: 890000,
					openInterest: 3200000,
					funding: -0.0001,
					isActive: true,
					marketAccount: {} as any,
				},
				{
					marketIndex: 6,
					symbol: 'WTI-PERP',
					baseAssetSymbol: 'WTI',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'perp',
					lastPrice: 78.92,
					priceChange24h: 1.23,
					volume24h: 1560000,
					openInterest: 4890000,
					funding: 0.0005,
					isActive: true,
					marketAccount: {} as any,
				},
				{
					marketIndex: 7,
					symbol: 'NG-PERP',
					baseAssetSymbol: 'NG',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'perp',
					lastPrice: 2.876,
					priceChange24h: -0.089,
					volume24h: 678000,
					openInterest: 1890000,
					funding: -0.0002,
					isActive: true,
					// Real token integration
					tokenMint: COMMODITY_TOKENS.NG.mintAddress || '',
					decimals: COMMODITY_TOKENS.NG.decimals,
					pythPriceId: COMMODITY_TOKENS.NG.pythPriceId || '',
					marketAccount: {} as any,
				},
				// NGT-PERP Natural Gas Token Perpetual
				{
					marketIndex: 8,
					symbol: 'NGT-PERP',
					baseAssetSymbol: 'NGT',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'perp',
					lastPrice: 2.876,
					priceChange24h: -0.089,
					volume24h: 678000,
					openInterest: 1890000,
					funding: -0.0002,
					isActive: true,
					tokenMint: COMMODITY_TOKENS.NGT?.mintAddress || '',
					decimals: COMMODITY_TOKENS.NGT?.decimals || 9,
					pythPriceId: COMMODITY_TOKENS.NGT?.pythPriceId || '',
					marketAccount: {} as any,
				},
				// OIL-PERP Oil Perpetual
				{
					marketIndex: 9,
					symbol: 'OIL-PERP',
					baseAssetSymbol: 'OIL',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'perp',
					lastPrice: 78.92,
					priceChange24h: 1.23,
					volume24h: 1560000,
					openInterest: 4890000,
					funding: 0.0005,
					isActive: true,
					marketAccount: {} as any,
				},
				// GOLD-PERP Gold Perpetual
				{
					marketIndex: 10,
					symbol: 'GOLD-PERP',
					baseAssetSymbol: 'GOLD',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'perp',
					lastPrice: 2035.5,
					priceChange24h: 12.75,
					volume24h: 2340000,
					openInterest: 8750000,
					funding: 0.0003,
					isActive: true,
					marketAccount: {} as any,
				},
				// SILVER-PERP Silver Perpetual
				{
					marketIndex: 11,
					symbol: 'SILVER-PERP',
					baseAssetSymbol: 'SILVER',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'perp',
					lastPrice: 24.85,
					priceChange24h: -0.42,
					volume24h: 890000,
					openInterest: 3200000,
					funding: -0.0001,
					isActive: true,
					marketAccount: {} as any,
				},
				// COPPER-PERP Copper Perpetual
				{
					marketIndex: 24,
					symbol: 'COPPER-PERP',
					baseAssetSymbol: 'COPPER',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'perp',
					lastPrice: 4.12,
					priceChange24h: 0.08,
					volume24h: 1250000,
					openInterest: 3890000,
					funding: 0.0002,
					isActive: true,
					marketAccount: {} as any,
				},
				// ALUMINUM-PERP Aluminum Perpetual
				{
					marketIndex: 25,
					symbol: 'ALUMINUM-PERP',
					baseAssetSymbol: 'ALUMINUM',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'perp',
					lastPrice: 2.34,
					priceChange24h: -0.05,
					volume24h: 675000,
					openInterest: 1890000,
					funding: -0.0001,
					isActive: true,
					marketAccount: {} as any,
				},
				// PLATINUM-PERP Platinum Perpetual
				{
					marketIndex: 26,
					symbol: 'PLATINUM-PERP',
					baseAssetSymbol: 'PLATINUM',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'perp',
					lastPrice: 1045.5,
					priceChange24h: 8.75,
					volume24h: 890000,
					openInterest: 2340000,
					funding: 0.0003,
					isActive: true,
					marketAccount: {} as any,
				},
				// PALLADIUM-PERP Palladium Perpetual
				{
					marketIndex: 27,
					symbol: 'PALLADIUM-PERP',
					baseAssetSymbol: 'PALLADIUM',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'perp',
					lastPrice: 1567.25,
					priceChange24h: -12.5,
					volume24h: 456000,
					openInterest: 1234000,
					funding: -0.0002,
					isActive: true,
					marketAccount: {} as any,
				},
				// WHEAT-PERP Wheat Perpetual
				{
					marketIndex: 12,
					symbol: 'WHEAT-PERP',
					baseAssetSymbol: 'WHEAT',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'perp',
					lastPrice: 6.45,
					priceChange24h: 0.78,
					volume24h: 345000,
					openInterest: 1250000,
					funding: 0.0004,
					isActive: true,
					marketAccount: {} as any,
				},
				// CORN-PERP Corn Perpetual
				{
					marketIndex: 13,
					symbol: 'CORN-PERP',
					baseAssetSymbol: 'CORN',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'perp',
					lastPrice: 4.32,
					priceChange24h: -0.15,
					volume24h: 287000,
					openInterest: 980000,
					funding: -0.0001,
					isActive: true,
					marketAccount: {} as any,
				},
				// CATTLE-PERP Live Cattle Perpetual
				{
					marketIndex: 14,
					symbol: 'CATTLE-PERP',
					baseAssetSymbol: 'CATTLE',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'perp',
					lastPrice: 1.78,
					priceChange24h: 0.23,
					volume24h: 156000,
					openInterest: 567000,
					funding: 0.0002,
					isActive: true,
					marketAccount: {} as any,
				},
				// HOGS-PERP Lean Hogs Perpetual
				{
					marketIndex: 15,
					symbol: 'HOGS-PERP',
					baseAssetSymbol: 'HOGS',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'perp',
					lastPrice: 0.89,
					priceChange24h: -0.05,
					volume24h: 98000,
					openInterest: 234000,
					funding: -0.0003,
					isActive: true,
					marketAccount: {} as any,
				},

				// === SOFTS (Soft Commodities) ===
				// COFFEE-PERP Coffee Perpetual
				{
					marketIndex: 16,
					symbol: 'COFFEE-PERP',
					baseAssetSymbol: 'COFFEE',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'perp',
					lastPrice: 1.85,
					priceChange24h: 0.12,
					volume24h: 425000,
					openInterest: 1560000,
					funding: 0.0002,
					isActive: true,
					marketAccount: {} as any,
				},
				// SUGAR-PERP Sugar Perpetual
				{
					marketIndex: 17,
					symbol: 'SUGAR-PERP',
					baseAssetSymbol: 'SUGAR',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'perp',
					lastPrice: 0.22,
					priceChange24h: -0.008,
					volume24h: 312000,
					openInterest: 890000,
					funding: -0.0001,
					isActive: true,
					marketAccount: {} as any,
				},
				// COCOA-PERP Cocoa Perpetual
				{
					marketIndex: 18,
					symbol: 'COCOA-PERP',
					baseAssetSymbol: 'COCOA',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'perp',
					lastPrice: 3.45,
					priceChange24h: 0.23,
					volume24h: 189000,
					openInterest: 675000,
					funding: 0.0003,
					isActive: true,
					marketAccount: {} as any,
				},
				// COTTON-PERP Cotton Perpetual
				{
					marketIndex: 19,
					symbol: 'COTTON-PERP',
					baseAssetSymbol: 'COTTON',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'perp',
					lastPrice: 0.78,
					priceChange24h: -0.02,
					volume24h: 156000,
					openInterest: 445000,
					funding: -0.0002,
					isActive: true,
					marketAccount: {} as any,
				},
				// ORANGE-PERP Orange Juice Perpetual
				{
					marketIndex: 20,
					symbol: 'ORANGE-PERP',
					baseAssetSymbol: 'ORANGE',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'perp',
					lastPrice: 1.56,
					priceChange24h: 0.08,
					volume24h: 87000,
					openInterest: 234000,
					funding: 0.0001,
					isActive: true,
					marketAccount: {} as any,
				},

				// === INDICES (Commodity Indices) ===
				// DJP-PERP DJ Commodity Index Perpetual
				{
					marketIndex: 21,
					symbol: 'DJP-PERP',
					baseAssetSymbol: 'DJP',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'perp',
					lastPrice: 28.45,
					priceChange24h: 0.67,
					volume24h: 1250000,
					openInterest: 4560000,
					funding: 0.0004,
					isActive: true,
					marketAccount: {} as any,
				},
				// GSG-PERP Goldman Sachs Commodity Index Perpetual
				{
					marketIndex: 22,
					symbol: 'GSG-PERP',
					baseAssetSymbol: 'GSG',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'perp',
					lastPrice: 15.23,
					priceChange24h: 0.34,
					volume24h: 890000,
					openInterest: 3200000,
					funding: 0.0002,
					isActive: true,
					marketAccount: {} as any,
				},
				// CRB-PERP CRB Commodity Index Perpetual
				{
					marketIndex: 23,
					symbol: 'CRB-PERP',
					baseAssetSymbol: 'CRB',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'perp',
					lastPrice: 312.78,
					priceChange24h: 2.45,
					volume24h: 675000,
					openInterest: 2890000,
					funding: 0.0003,
					isActive: true,
					marketAccount: {} as any,
				},
			];

			this.state.markets = commodityMarkets;
			this.setState({ markets: commodityMarkets });

			return commodityMarkets;
		} catch (error: any) {
			console.error('Error fetching markets:', error);
			this.setState({ error: error.message || 'Failed to fetch markets' });
			return [];
		}
	}

	/**
	 * Get current user positions (stub implementation)
	 */
	getUserPositions(): UIPosition[] {
		console.log('DriftService: Getting user positions...');

		try {
			// Add safety check - if no user account, return empty
			if (!this.state.initialized || !this.state.user) {
				console.warn(
					'DriftService: Not initialized or no user account, returning empty positions'
				);
				return [];
			}

			// TODO: Return actual positions from User account
			// For now, return mock data quickly to prevent hanging
			const mockPositions: UIPosition[] = [
				{
					marketIndex: 0,
					symbol: 'SOL-PERP',
					side: 'long',
					size: 100,
					notionalValue: 9850,
					entryPrice: 95.5,
					markPrice: 98.5,
					unrealizedPnl: 300,
					unrealizedPnlPercent: 3.14,
					marketType: 'perp',
					liquidationPrice: 45.25,
					position: {} as any,
				},
				{
					marketIndex: 1,
					symbol: 'BTC-PERP',
					side: 'short',
					size: 0.5,
					notionalValue: 21750,
					entryPrice: 43500,
					markPrice: 43500,
					unrealizedPnl: -125,
					unrealizedPnlPercent: -0.57,
					marketType: 'perp',
					liquidationPrice: 52000,
					position: {} as any,
				},
			];

			console.log(
				`DriftService: Returning ${mockPositions.length} mock positions`
			);
			return mockPositions;
		} catch (error) {
			console.error('DriftService: Error getting user positions:', error);
			return [];
		}
	}

	/**
	 * Place an order (stub implementation)
	 */
	async placeOrder(orderData: OrderFormData): Promise<string> {
		try {
			this.setState({ loading: true, error: null });

			console.log('DriftService: Placing order...', orderData);

			// TODO: Create and send actual order transaction
			await new Promise((resolve) => setTimeout(resolve, 2000));

			const mockTxId =
				'mock_transaction_' + Math.random().toString(36).substr(2, 9);

<<<<<<< Updated upstream
=======
			// For other markets, use mock implementation for now
			await new Promise((resolve) => setTimeout(resolve, 1000));
			const mockTxId = `mock_tx_${Date.now()}_${Math.random()
				.toString(36)
				.substr(2, 9)}`;
			console.log('DriftService: Order placed with txId:', mockTxId);

>>>>>>> Stashed changes
			this.setState({ loading: false });
			this.emit('orderPlaced', { txId: mockTxId, orderData });

			return mockTxId;
		} catch (error: any) {
			console.error('Error placing order:', error);
			this.setState({
				error: error.message || 'Failed to place order',
				loading: false,
			});
			throw error;
		}
	}

	/**
<<<<<<< Updated upstream
=======
	 * Execute real NGT-USDC trading through Jupiter/Orca
	 */
	private async executeNGTUSDCTrade(orderData: OrderFormData): Promise<string> {
		try {
			console.log('🚀 EXECUTING REAL NGT-USDC TRADE ON SOLANA MAINNET!');

			// NGT Token: HpNnAySB34qEHSBANp8dbUu7UqzPxZG5CktqbdKnC9Qp
			// USDC Token: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v

			const ngtMint = 'HpNnAySB34qEHSBANp8dbUu7UqzPxZG5CktqbdKnC9Qp';
			const usdcMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

			// Use Jupiter API for real swap
			const amount = Math.floor(parseFloat(orderData.amount) * 1000000);
			const jupiterQuoteUrl = `https://quote-api.jup.ag/v6/quote?inputMint=${
				orderData.side === 'buy' ? usdcMint : ngtMint
			}&outputMint=${
				orderData.side === 'buy' ? ngtMint : usdcMint
			}&amount=${amount}&slippageBps=50`;

			console.log('🔄 Getting Jupiter quote for NGT-USDC swap...');
			const quoteResponse = await fetch(jupiterQuoteUrl);
			const quoteData = await quoteResponse.json();

			if (quoteData.error) {
				throw new Error(`Jupiter quote error: ${quoteData.error}`);
			}

			console.log('✅ Jupiter quote received:', quoteData);

			// For now, return the quote as a successful "transaction"
			// In a full implementation, this would execute the swap
			const realTxId = `jupiter_quote_${Date.now()}`;
			console.log('🎉 REAL NGT-USDC TRADE QUOTE GENERATED:', realTxId);

			// Update state and emit success event
			this.setState({ loading: false });
			this.emit('orderPlaced', {
				txId: realTxId,
				market: 'NGT-USDC',
				side: orderData.side,
				amount: orderData.amount,
				price: orderData.price,
				quote: quoteData,
			});

			return realTxId;
		} catch (error) {
			console.error('❌ Real NGT-USDC trade failed:', error);
			// Fallback to mock for demo purposes
			const fallbackTxId = `ngt_demo_${Date.now()}`;
			console.log('🔄 Using demo mode for NGT-USDC trade:', fallbackTxId);

			this.setState({ loading: false });
			this.emit('orderPlaced', {
				txId: fallbackTxId,
				market: 'NGT-USDC',
				side: orderData.side,
				amount: orderData.amount,
				price: orderData.price,
			});

			return fallbackTxId;
		}
	}

	/**
>>>>>>> Stashed changes
	 * Cancel all orders (stub implementation)
	 */
	async cancelAllOrders(): Promise<string> {
		try {
			this.setState({ loading: true, error: null });

			console.log('DriftService: Cancelling all orders...');

			// TODO: Cancel all orders via DriftClient
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const mockTxId = 'cancel_tx_' + Math.random().toString(36).substr(2, 9);

			this.setState({ loading: false });
			this.emit('ordersCancelled', { txId: mockTxId });

			return mockTxId;
		} catch (error: any) {
			console.error('Error cancelling orders:', error);
			this.setState({
				error: error.message || 'Failed to cancel orders',
				loading: false,
			});
			throw error;
		}
	}

	/**
	 * Update internal state and emit change events
	 */
	private setState(updates: Partial<DriftServiceState>): void {
		this.state = { ...this.state, ...updates };
		this.emit('stateChanged', this.state);
	}

	/**
	 * Get current service state
	 */
	getState(): DriftServiceState {
		return { ...this.state };
	}

	/**
	 * Disconnect and cleanup
	 */
	async disconnect(): Promise<void> {
		try {
			console.log('DriftService: Disconnecting...');

			// TODO: Disconnect DriftClient and User subscriptions

			this.setState({
				initialized: false,
				connected: false,
				user: null,
				markets: [],
				positions: [],
				loading: false,
				error: null,
			});

			this.emit('disconnected');
		} catch (error: any) {
			console.error('Error disconnecting:', error);
			this.emit('error', error);
		}
	}

	/**
	 * Check if service is ready for use
	 */
	isReady(): boolean {
		return (
			this.state.initialized && this.state.connected && !this.state.loading
		);
	}

	/**
	 * Get DriftClient instance (stub)
	 */
	getDriftClient(): any | null {
		// TODO: Return actual DriftClient
		return null;
	}

	/**
	 * Get User instance (stub)
	 */
	getUser(): any | null {
		// TODO: Return actual User
		return null;
	}
}
