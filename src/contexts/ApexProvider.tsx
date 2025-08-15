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
import ApexService, { ApexUser, SpotMarket } from '../services/ApexService';

interface ApexContextType {
	apexService: ApexService | null;
	user: ApexUser | null;
	spotMarkets: SpotMarket[];
	isInitialized: boolean;
	isLoading: boolean;
	error: string | null;

	// Actions
	initializeProtocol: (admin: PublicKey) => Promise<string>;
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
	withdraw: (
		marketIndex: number,
		amount: number,
		mint: PublicKey
	) => Promise<string>;
	placeSpotOrder: (
		marketIndex: number,
		amount: number,
		price: number,
		side: 'Buy' | 'Sell'
	) => Promise<string>;
	refreshUserData: () => Promise<void>;
	refreshSpotMarkets: () => Promise<void>;
}

const ApexContext = createContext<ApexContextType | null>(null);

interface ApexProviderProps {
	children: ReactNode;
}

export function ApexProvider({ children }: ApexProviderProps) {
	const { connection } = useConnection();
	const wallet = useWallet();

	const [apexService, setApexService] = useState<ApexService | null>(null);
	const [user, setUser] = useState<ApexUser | null>(null);
	const [spotMarkets, setSpotMarkets] = useState<SpotMarket[]>([]);
	const [isInitialized, setIsInitialized] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Initialize Apex service when wallet connects
	useEffect(() => {
		const initializeService = async () => {
			if (wallet.connected && wallet.publicKey) {
				try {
					setIsLoading(true);
					setError(null);

					const service = new ApexService(connection);
					await service.initialize(wallet);
					setApexService(service);
					setIsInitialized(true);

					// Load user data and spot markets
					await loadUserData(service);
					await loadSpotMarkets(service);
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
				setIsInitialized(false);
				setError(null);
			}
		};

		initializeService();
	}, [wallet.connected, wallet.publicKey, connection]);

	const loadUserData = async (service: ApexService) => {
		if (!wallet.publicKey) return;

		try {
			const userData = await service.getUserAccount(wallet.publicKey);
			setUser(userData);
		} catch (err) {
			console.error('Failed to load user data:', err);
		}
	};

	const loadSpotMarkets = async (service: ApexService) => {
		try {
			const markets: SpotMarket[] = [];

			// Try to load known markets (0-4 for our commodity markets)
			for (let i = 0; i < 5; i++) {
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

			setSpotMarkets(markets);
		} catch (err) {
			console.error('Failed to load spot markets:', err);
		}
	};

	const initializeProtocol = async (admin: PublicKey): Promise<string> => {
		if (!apexService) throw new Error('Apex service not initialized');

		try {
			setIsLoading(true);
			setError(null);
			const tx = await apexService.initializeProtocol(admin);
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

			// Refresh user data after deposit
			await loadUserData(apexService);
			await loadSpotMarkets(apexService);

			return tx;
		} catch (err) {
			const errorMsg = err instanceof Error ? err.message : 'Failed to deposit';
			setError(errorMsg);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const withdraw = async (
		marketIndex: number,
		amount: number,
		mint: PublicKey
	): Promise<string> => {
		if (!apexService) throw new Error('Apex service not initialized');

		try {
			setIsLoading(true);
			setError(null);
			const tx = await apexService.withdraw(marketIndex, amount, mint);

			// Refresh user data after withdrawal
			await loadUserData(apexService);
			await loadSpotMarkets(apexService);

			return tx;
		} catch (err) {
			const errorMsg =
				err instanceof Error ? err.message : 'Failed to withdraw';
			setError(errorMsg);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const placeSpotOrder = async (
		marketIndex: number,
		amount: number,
		price: number,
		side: 'Buy' | 'Sell'
	): Promise<string> => {
		if (!apexService) throw new Error('Apex service not initialized');

		try {
			setIsLoading(true);
			setError(null);
			const tx = await apexService.placeSpotOrder(
				marketIndex,
				amount,
				price,
				side
			);

			// Refresh user data after order
			await loadUserData(apexService);

			return tx;
		} catch (err) {
			const errorMsg =
				err instanceof Error ? err.message : 'Failed to place order';
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

	const contextValue: ApexContextType = {
		apexService,
		user,
		spotMarkets,
		isInitialized,
		isLoading,
		error,
		initializeProtocol,
		createSpotMarket,
		deposit,
		withdraw,
		placeSpotOrder,
		refreshUserData,
		refreshSpotMarkets,
	};

	return (
		<ApexContext.Provider value={contextValue}>{children}</ApexContext.Provider>
	);
}

export function useApex(): ApexContextType {
	const context = useContext(ApexContext);
	if (!context) {
		throw new Error('useApex must be used within an ApexProvider');
	}
	return context;
}

export default ApexProvider;
