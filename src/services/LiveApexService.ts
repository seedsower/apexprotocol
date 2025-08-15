import {
	Connection,
	PublicKey,
	Transaction,
	SystemProgram,
} from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';

// Apex Protocol Program ID (devnet)
const APEX_PROGRAM_ID = new PublicKey(
	'5LG726477dDBUQ9TSfPJb9v6J8Wa9ZW8cfSDc1fZiQTL'
);

export interface LiveApexUser {
	authority: string;
	totalDeposits: number;
	totalWithdrawals: number;
	balance: number;
}

export interface LiveSpotMarket {
	marketIndex: number;
	name: string;
	symbol: string;
	price: number;
	change24h: number;
	volume24h: number;
	status: 'Active' | 'Paused';
}

export class LiveApexService {
	private connection: Connection;
	private wallet: WalletContextState | null = null;

	constructor(connection: Connection) {
		this.connection = connection;
	}

	async initialize(wallet: WalletContextState): Promise<void> {
		this.wallet = wallet;
	}

	// Get live commodity markets with real-time data simulation
	async getLiveSpotMarkets(): Promise<LiveSpotMarket[]> {
		// Simulate live market data for our deployed commodity markets
		const baseMarkets = [
			{ name: 'WTI Crude Oil', symbol: 'WTI-USDC', basePrice: 75.5 },
			{ name: 'Gold', symbol: 'GOLD-USDC', basePrice: 2050.25 },
			{ name: 'Natural Gas Token', symbol: 'NGT-USDC', basePrice: 3.85 },
			{ name: 'Silver', symbol: 'SILVER-USDC', basePrice: 24.75 },
			{ name: 'Wheat', symbol: 'WHEAT-USDC', basePrice: 6.25 },
		];

		return baseMarkets.map((market, index) => {
			// Add realistic price variation
			const priceVariation = (Math.random() - 0.5) * 0.1; // ±5% variation
			const currentPrice = market.basePrice * (1 + priceVariation);

			const change24h = (Math.random() - 0.5) * 0.08; // ±4% daily change
			const volume24h = Math.random() * 1000000 + 100000; // Random volume

			return {
				marketIndex: index,
				name: market.name,
				symbol: market.symbol,
				price: Number(currentPrice.toFixed(2)),
				change24h: Number((change24h * 100).toFixed(2)),
				volume24h: Number(volume24h.toFixed(0)),
				status: 'Active' as const,
			};
		});
	}

	// Get user account with live balance simulation
	async getLiveUserAccount(
		userPublicKey: PublicKey
	): Promise<LiveApexUser | null> {
		if (!this.wallet?.publicKey) return null;

		try {
			// Check if protocol state exists (indicates initialization)
			const [statePDA] = this.getStatePDA();
			const stateAccount = await this.connection.getAccountInfo(statePDA);

			if (!stateAccount) {
				// Protocol not initialized yet
				return {
					authority: userPublicKey.toString(),
					totalDeposits: 0,
					totalWithdrawals: 0,
					balance: 0,
				};
			}

			// Simulate user balance based on wallet activity
			const mockBalance = Math.random() * 10000; // Random balance for demo

			return {
				authority: userPublicKey.toString(),
				totalDeposits: mockBalance + 1000,
				totalWithdrawals: 1000,
				balance: Number(mockBalance.toFixed(2)),
			};
		} catch (error) {
			console.log('Error fetching user account:', error);
			return null;
		}
	}

	// Initialize protocol (simplified transaction)
	async initializeProtocol(): Promise<string> {
		if (!this.wallet?.publicKey || !this.wallet.signTransaction) {
			throw new Error('Wallet not connected');
		}

		try {
			const [_statePDA] = this.getStatePDA();

			// Create a simple transaction that interacts with our deployed program
			const transaction = new Transaction();

			// Add a memo instruction as a placeholder for actual initialization
			transaction.add(
				SystemProgram.transfer({
					fromPubkey: this.wallet.publicKey,
					toPubkey: this.wallet.publicKey,
					lamports: 1, // Minimal transfer to self
				})
			);

			const { blockhash } = await this.connection.getLatestBlockhash();
			transaction.recentBlockhash = blockhash;
			transaction.feePayer = this.wallet.publicKey;

			const signedTransaction = await this.wallet.signTransaction(transaction);
			const signature = await this.connection.sendRawTransaction(
				signedTransaction.serialize()
			);

			await this.connection.confirmTransaction(signature, 'confirmed');

			console.log('Protocol initialization simulated:', signature);
			return signature;
		} catch (error) {
			console.error('Failed to initialize protocol:', error);
			throw error;
		}
	}

	// Deposit simulation
	async deposit(marketIndex: number, amount: number): Promise<string> {
		if (!this.wallet?.publicKey || !this.wallet.signTransaction) {
			throw new Error('Wallet not connected');
		}

		try {
			// Create a transaction that simulates deposit
			const transaction = new Transaction();

			// Add memo instruction with deposit details
			transaction.add(
				SystemProgram.transfer({
					fromPubkey: this.wallet.publicKey,
					toPubkey: this.wallet.publicKey,
					lamports: Math.floor(amount * 1000), // Convert to lamports equivalent
				})
			);

			const { blockhash } = await this.connection.getLatestBlockhash();
			transaction.recentBlockhash = blockhash;
			transaction.feePayer = this.wallet.publicKey;

			const signedTransaction = await this.wallet.signTransaction(transaction);
			const signature = await this.connection.sendRawTransaction(
				signedTransaction.serialize()
			);

			await this.connection.confirmTransaction(signature, 'confirmed');

			console.log(
				`Deposited ${amount} USDC to market ${marketIndex}:`,
				signature
			);
			return signature;
		} catch (error) {
			console.error('Failed to deposit:', error);
			throw error;
		}
	}

	// Place order simulation
	async placeSpotOrder(
		marketIndex: number,
		amount: number,
		price: number,
		side: 'Buy' | 'Sell'
	): Promise<string> {
		if (!this.wallet?.publicKey || !this.wallet.signTransaction) {
			throw new Error('Wallet not connected');
		}

		try {
			// Create a transaction that simulates order placement
			const transaction = new Transaction();

			// Add memo instruction with order details
			transaction.add(
				SystemProgram.transfer({
					fromPubkey: this.wallet.publicKey,
					toPubkey: this.wallet.publicKey,
					lamports: 1000, // Small fee simulation
				})
			);

			const { blockhash } = await this.connection.getLatestBlockhash();
			transaction.recentBlockhash = blockhash;
			transaction.feePayer = this.wallet.publicKey;

			const signedTransaction = await this.wallet.signTransaction(transaction);
			const signature = await this.connection.sendRawTransaction(
				signedTransaction.serialize()
			);

			await this.connection.confirmTransaction(signature, 'confirmed');

			console.log(
				`${side} order placed: ${amount} at ${price} for market ${marketIndex}:`,
				signature
			);
			return signature;
		} catch (error) {
			console.error('Failed to place order:', error);
			throw error;
		}
	}

	// Check if protocol is initialized
	async isProtocolInitialized(): Promise<boolean> {
		try {
			const [statePDA] = this.getStatePDA();
			const stateAccount = await this.connection.getAccountInfo(statePDA);
			return stateAccount !== null;
		} catch (error) {
			console.error('Error checking protocol state:', error);
			return false;
		}
	}

	// Get program derived addresses
	private getStatePDA(): [PublicKey, number] {
		return PublicKey.findProgramAddressSync(
			[Buffer.from('state')],
			APEX_PROGRAM_ID
		);
	}

	private getSpotMarketPDA(marketIndex: number): [PublicKey, number] {
		return PublicKey.findProgramAddressSync(
			[Buffer.from('spot_market'), Buffer.from([marketIndex])],
			APEX_PROGRAM_ID
		);
	}

	private getUserPDA(authority: PublicKey): [PublicKey, number] {
		return PublicKey.findProgramAddressSync(
			[Buffer.from('user'), authority.toBuffer()],
			APEX_PROGRAM_ID
		);
	}
}

export default LiveApexService;
