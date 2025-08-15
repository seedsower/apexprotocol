'use client';

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { DriftService } from '../services/DriftService';
import { IDriftService } from '../interfaces/IDriftService';
import { AppConfig, DriftServiceState } from '../types';

interface DriftContextType {
	driftService: IDriftService | null;
	state: DriftServiceState;
	isReady: boolean;
	createUser: () => Promise<void>;
	reconnect: () => Promise<void>;
	disconnect: () => Promise<void>;
}

const DriftContext = createContext<DriftContextType | null>(null);

interface DriftProviderProps {
	children: ReactNode;
}

const DriftProviderContent: React.FC<DriftProviderProps> = ({ children }) => {
	const { wallet, connected, publicKey } = useWallet();

	const [driftService, setDriftService] = useState<IDriftService | null>(null);
	const [state, setState] = useState<DriftServiceState>({
		initialized: false,
		connected: false,
		user: null,
		markets: [],
		positions: [],
		loading: false,
		error: null,
	});

	// Simple configuration
	const config: AppConfig = {
		rpcUrl:
			process.env.NEXT_PUBLIC_RPC_URL ||
			process.env.RPC_URL ||
			'https://api.mainnet-beta.solana.com', // Direct Solana mainnet RPC
		wsUrl:
			process.env.NEXT_PUBLIC_WS_URL ||
			process.env.WS_URL ||
			'wss://api.mainnet-beta.solana.com',
		programId:
			process.env.NEXT_PUBLIC_PROGRAM_ID ||
			process.env.PROGRAM_ID ||
			'dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH',
		commitment: 'confirmed',
		environment: 'mainnet-beta',
	};

	// Initialize DriftService when wallet connects
	useEffect(() => {
<<<<<<< Updated upstream
		if (connected && publicKey && wallet) {
			const initService = async () => {
				try {
=======
		let isMounted = true;

		if (connected && publicKey && wallet) {
			const initService = async () => {
				try {
					if (!isMounted) return;

>>>>>>> Stashed changes
					setState((prev) => ({ ...prev, loading: true, error: null }));

					const newService = new DriftService(config);
					const walletInterface = {
						publicKey,
						adapter: wallet.adapter,
					};

<<<<<<< Updated upstream
					await newService.initialize(walletInterface);
					const markets = await newService.fetchMarkets();
=======
					// Add wallet error handling
					if (wallet.adapter) {
						const handleWalletError = (error: any) => {
							console.warn(
								'DriftProvider: Wallet error handled gracefully:',
								error.message || error
							);
							// Don't crash the app on wallet errors - just log them
						};

						const handleWalletDisconnect = () => {
							console.log('DriftProvider: Wallet disconnected gracefully');
							if (isMounted) {
								setDriftService(null);
								setState({
									initialized: false,
									connected: false,
									user: null,
									markets: [],
									positions: [],
									loading: false,
									error: null,
								});
							}
						};

						// Add error listeners with try-catch to prevent crashes
						try {
							wallet.adapter.on('error', handleWalletError);
							wallet.adapter.on('disconnect', handleWalletDisconnect);
						} catch (listenerError) {
							console.warn(
								'DriftProvider: Could not add wallet listeners:',
								listenerError
							);
						}
					}

					await newService.initialize(walletInterface);
					const markets = await newService.fetchMarkets();

					if (!isMounted) return;

>>>>>>> Stashed changes
					console.log(
						`DriftProvider: Drift service initialized successfully with ${markets.length} markets`
					);

					setDriftService(newService);
					setState((prev) => ({
						...prev,
						loading: false,
						initialized: true,
						connected: true,
					}));

<<<<<<< Updated upstream
					console.log('DriftProvider: Using Drift service');
=======
					console.log(
						'DriftProvider: Using Drift service with robust error handling'
					);
>>>>>>> Stashed changes
				} catch (error: any) {
					console.error('DriftProvider: Service initialization failed:', error);
					setState((prev) => ({
						...prev,
						loading: false,
						error: `Service initialization failed: ${error.message}`,
					}));
				}
			};

			initService();
		} else {
<<<<<<< Updated upstream
			// Clean up when wallet disconnects
			if (driftService) {
				driftService.disconnect();
				setDriftService(null);
=======
			// Clean up when wallet disconnects with error handling
			try {
				if (driftService) {
					driftService.disconnect();
					setDriftService(null);
				}
			} catch (cleanupError) {
				console.warn('DriftProvider: Cleanup error handled:', cleanupError);
			}

			if (isMounted) {
				setState({
					initialized: false,
					connected: false,
					user: null,
					markets: [],
					positions: [],
					loading: false,
					error: null,
				});
>>>>>>> Stashed changes
			}
			setState({
				initialized: false,
				connected: false,
				user: null,
				markets: [],
				positions: [],
				loading: false,
				error: null,
			});
		}
<<<<<<< Updated upstream
=======

		return () => {
			isMounted = false;
			// Clean up wallet listeners on unmount
			if (wallet?.adapter) {
				try {
					wallet.adapter.removeAllListeners('error');
					wallet.adapter.removeAllListeners('disconnect');
				} catch (cleanupError) {
					console.warn('DriftProvider: Listener cleanup error:', cleanupError);
				}
			}
		};
>>>>>>> Stashed changes
	}, [connected, publicKey, wallet]);

	// Listen for state changes from DriftService
	useEffect(() => {
		if (driftService) {
			const handleStateChange = (newState: any) => {
				setState((prev) => ({
					...prev,
					...newState,
				}));
			};

			const handleError = (error: any) => {
				setState((prev) => ({
					...prev,
					error: error.message || 'DriftService error',
				}));
			};

			driftService.on('stateChanged', handleStateChange);
			driftService.on('error', handleError);

			return () => {
				driftService.off('stateChanged', handleStateChange);
				driftService.off('error', handleError);
			};
		}
	}, [driftService]);

	const contextValue: DriftContextType = {
		driftService,
		state,
		isReady: state.initialized && state.connected,
		createUser: async () => {
			if (driftService) {
				try {
					setState((prev) => ({ ...prev, loading: true, error: null }));
					await driftService.createUser();
					setState((prev) => ({ ...prev, loading: false }));
				} catch (error: any) {
					setState((prev) => ({
						...prev,
						error: error.message,
						loading: false,
					}));
				}
			}
		},
		reconnect: async () => {
			// Simple reconnect - just trigger re-initialization
			if (connected && publicKey) {
				window.location.reload();
			}
		},
		disconnect: async () => {
			if (driftService) {
				driftService.disconnect();
				setDriftService(null);
			}
			setState({
				initialized: false,
				connected: false,
				user: null,
				markets: [],
				positions: [],
				loading: false,
				error: null,
			});
		},
	};

	return (
		<DriftContext.Provider value={contextValue}>
			{children}
		</DriftContext.Provider>
	);
};

export const DriftProvider: React.FC<DriftProviderProps> = ({ children }) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	// During SSR, provide a default context
	if (!mounted) {
		const defaultValue: DriftContextType = {
			driftService: null,
			state: {
				initialized: false,
				connected: false,
				user: null,
				markets: [],
				positions: [],
				loading: false,
				error: null,
			},
			isReady: false,
			createUser: async () => {},
			reconnect: async () => {},
			disconnect: async () => {},
		};

		return (
			<DriftContext.Provider value={defaultValue}>
				{children}
			</DriftContext.Provider>
		);
	}

	// After hydration, render the full provider
	return <DriftProviderContent>{children}</DriftProviderContent>;
};

export const useDrift = () => {
	const context = useContext(DriftContext);
	if (!context) {
		throw new Error('useDrift must be used within a DriftProvider');
	}
	return context;
};
