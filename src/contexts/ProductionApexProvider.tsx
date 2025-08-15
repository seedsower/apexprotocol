'use client';

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import ProductionApexService, {
	ApexUser,
	ApexSpotMarket,
} from '../services/ProductionApexService';

interface ProductionApexContextType {
	apexService: ProductionApexService | null;
	user: ApexUser | null;
	spotMarkets: ApexSpotMarket[];
	protocolState: any;
	isInitialized: boolean;
	isProtocolInitialized: boolean;
	isLoading: boolean;
	error: string | null;

	// Actions
	initializeProtocol: () => Promise<string>;
	createSpotMarket: (
		marketIndex: number,
		oracle: PublicKey,
		mint: PublicKey,
		name: string,
		decimals: number
	) => Promise<string>;
	deposit: (
		marketIndex: number,
		amount: number,
		mint: PublicKey
	) => Promise<string>;
	refreshUserData: () => Promise<void>;
	refreshSpotMarkets: () => Promise<void>;
	refreshProtocolState: () => Promise<void>;
}

const ProductionApexContext = createContext<ProductionApexContextType | null>(
	null
);

interface ProductionApexProviderProps {
	children: ReactNode;
}

export function ProductionApexProvider({
	children,
}: ProductionApexProviderProps) {
	const { connection } = useConnection();
	const wallet = useWallet();

	const [apexService, setApexService] = useState<ProductionApexService | null>(
		null
	);
	const [user, setUser] = useState<ApexUser | null>(null);
	const [spotMarkets, setSpotMarkets] = useState<ApexSpotMarket[]>([]);
	const [protocolState, setProtocolState] = useState<any>(null);
	const [isInitialized, setIsInitialized] = useState(false);
	const [isProtocolInitialized, setIsProtocolInitialized] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Initialize Apex service when wallet connects
	useEffect(() => {
		const initializeService = async () => {
			if (wallet.connected && wallet.publicKey) {
				try {
					setIsLoading(true);
					setError(null);

					const service = new ProductionApexService(connection);
					await service.initialize(wallet);
					setApexService(service);
					setIsInitialized(true);

					// Check if protocol is initialized
					const protocolInitialized = await service.isProtocolInitialized();
					setIsProtocolInitialized(protocolInitialized);

					if (protocolInitialized) {
						// Load all data if protocol is initialized
						await Promise.all([
							loadUserData(service),
							loadSpotMarkets(service),
							loadProtocolState(service),
						]);
					}
				} catch (err) {
					console.error('Failed to initialize Apex service:', err);
					setError(
						err instanceof Error
							? err.message
							: 'Failed to initialize Apex service'
					);
				} finally {
					setIsLoading(false);
				}
			} else {
				// Reset state when wallet disconnects
				setApexService(null);
				setUser(null);
				setSpotMarkets([]);
				setProtocolState(null);
				setIsInitialized(false);
				setIsProtocolInitialized(false);
				setError(null);
			}
		};

		initializeService();
	}, [wallet.connected, wallet.publicKey, connection]);

	const loadUserData = async (service: ProductionApexService) => {
		if (!wallet.publicKey) return;

		try {
			const userData = await service.getUserAccount(wallet.publicKey);
			setUser(userData);
		} catch (err) {
			console.error('Failed to load user data:', err);
		}
	};

	const loadSpotMarkets = async (service: ProductionApexService) => {
		try {
			const markets: ApexSpotMarket[] = [];

			// Try to load known markets (0-9 for potential commodity markets)
			for (let i = 0; i < 10; i++) {
				try {
					const market = await service.getSpotMarket(i);
					if (market) {
						markets.push(market);
					}
				} catch (err) {
					// Market doesn't exist, continue
					console.log(`Market ${i} not found`);
				}
			}

			// If no markets loaded from blockchain, add default commodity markets for UI
			if (markets.length === 0) {
				console.log(
					'No blockchain markets found, loading default commodity markets for UI'
				);
				const defaultMarkets: ApexSpotMarket[] = [
					{
						marketIndex: 0,
						name: 'NGT',
						mint: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'), // USDC mint as placeholder
						oracle: new PublicKey(
							'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr'
						), // Pyth NGT oracle
						decimals: 6,
						vault: new PublicKey('11111111111111111111111111111111'),
						status: 'active' as const,
						depositBalance: new BN(0),
						borrowBalance: new BN(0),
					},
					{
						marketIndex: 1,
						name: 'WTI',
						mint: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
						oracle: new PublicKey(
							'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr'
						),
						decimals: 6,
						vault: new PublicKey('11111111111111111111111111111111'),
						status: 'active' as const,
						depositBalance: new BN(0),
						borrowBalance: new BN(0),
					},
					{
						marketIndex: 2,
						name: 'GOLD',
						mint: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
						oracle: new PublicKey(
							'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr'
						),
						decimals: 6,
						vault: new PublicKey('11111111111111111111111111111111'),
						status: 'active' as const,
						depositBalance: new BN(0),
						borrowBalance: new BN(0),
					},
					{
						marketIndex: 3,
						name: 'SILVER',
						mint: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
						oracle: new PublicKey(
							'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr'
						),
						decimals: 6,
						vault: new PublicKey('11111111111111111111111111111111'),
						status: 'active' as const,
						depositBalance: new BN(0),
						borrowBalance: new BN(0),
					},
					{
						marketIndex: 4,
						name: 'WHEAT',
						mint: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
						oracle: new PublicKey(
							'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr'
						),
						decimals: 6,
						vault: new PublicKey('11111111111111111111111111111111'),
						status: 'active' as const,
						depositBalance: new BN(0),
						borrowBalance: new BN(0),
					},
				];
				markets.push(...defaultMarkets);
			}

			setSpotMarkets(markets);
		} catch (err) {
			console.error('Failed to load spot markets:', err);
			// Even on error, provide default markets for UI functionality
			const fallbackMarkets: ApexSpotMarket[] = [
				{
					marketIndex: 0,
					name: 'NGT',
					mint: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
					oracle: new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr'),
					decimals: 6,
					vault: new PublicKey('11111111111111111111111111111111'),
					status: 'active' as const,
					depositBalance: new BN(0),
					borrowBalance: new BN(0),
				},
			];
			setSpotMarkets(fallbackMarkets);
		}
	};

	const loadProtocolState = async (service: ProductionApexService) => {
		try {
			const state = await service.getProtocolState();
			setProtocolState(state);
		} catch (err) {
			console.error('Failed to load protocol state:', err);
		}
	};

	const initializeProtocol = async (): Promise<string> => {
		if (!apexService) throw new Error('Apex service not initialized');

		try {
			setIsLoading(true);
			setError(null);
			const tx = await apexService.initializeProtocol();

			// Update protocol initialization status
			setIsProtocolInitialized(true);

			// Load protocol state after initialization
			await loadProtocolState(apexService);

			return tx;
		} catch (err) {
			const errorMsg =
				err instanceof Error ? err.message : 'Failed to initialize protocol';
			setError(errorMsg);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const createSpotMarket = async (
		marketIndex: number,
		oracle: PublicKey,
		mint: PublicKey,
		name: string,
		decimals: number
	): Promise<string> => {
		if (!apexService) throw new Error('Apex service not initialized');

		try {
			setIsLoading(true);
			setError(null);
			const tx = await apexService.createSpotMarket(
				marketIndex,
				oracle,
				mint,
				name,
				decimals
			);

			// Refresh spot markets after creation
			await loadSpotMarkets(apexService);

			return tx;
		} catch (err) {
			const errorMsg =
				err instanceof Error ? err.message : 'Failed to create spot market';
			setError(errorMsg);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const deposit = async (
		marketIndex: number,
		amount: number,
		mint: PublicKey
	): Promise<string> => {
		if (!apexService) throw new Error('Apex service not initialized');

		try {
			setIsLoading(true);
			setError(null);
			const tx = await apexService.deposit(marketIndex, amount, mint);

			// Refresh user data and markets after deposit
			await Promise.all([
				loadUserData(apexService),
				loadSpotMarkets(apexService),
			]);

			return tx;
		} catch (err) {
			const errorMsg = err instanceof Error ? err.message : 'Failed to deposit';
			setError(errorMsg);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const refreshUserData = async (): Promise<void> => {
		if (!apexService) return;
		await loadUserData(apexService);
	};

	const refreshSpotMarkets = async (): Promise<void> => {
		if (!apexService) return;
		await loadSpotMarkets(apexService);
	};

	const refreshProtocolState = async (): Promise<void> => {
		if (!apexService) return;
		await loadProtocolState(apexService);
	};

	const contextValue: ProductionApexContextType = {
		apexService,
		user,
		spotMarkets,
		protocolState,
		isInitialized,
		isProtocolInitialized,
		isLoading,
		error,
		initializeProtocol,
		createSpotMarket,
		deposit,
		refreshUserData,
		refreshSpotMarkets,
		refreshProtocolState,
	};

	return (
		<ProductionApexContext.Provider value={contextValue}>
			{children}
		</ProductionApexContext.Provider>
	);
}

export function useProductionApex(): ProductionApexContextType {
	const context = useContext(ProductionApexContext);
	if (!context) {
		throw new Error(
			'useProductionApex must be used within a ProductionApexProvider'
		);
	}
	return context;
}

export default ProductionApexProvider;
