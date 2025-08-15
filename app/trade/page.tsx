'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDrift } from '../../src/providers/DriftProvider';
import { TopNavigation } from '../../src/components/TopNavigation';
import { MarketHeader } from '../../src/components/MarketHeader';

import { AdvancedChart } from '../../src/components/AdvancedChart';
import { OrderBook } from '../../src/components/OrderBook';
import { EnhancedOrderForm } from '../../src/components/EnhancedOrderForm';
// import TokenBalances from '@/components/TokenBalances';
// import PositionsTable from '@/components/PositionsTable';

import { OrderFormData, UIMarketData } from '../../src/types';

export default function TradePage() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Don't render until mounted (SSR safety)
	if (!mounted) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="text-gray-600 mt-4">Loading...</p>
				</div>
			</div>
		);
	}

	return <TradePageContent />;
}

function TradePageContent() {
	// Safely use wallet hooks only after mounting
	const { connected, publicKey } = useWallet();
<<<<<<< Updated upstream
	const { driftService, isReady, createUser } = useDrift();
=======
	const {
		apexService,
		user,
		spotMarkets,
		isInitialized,
		isProtocolInitialized: _isProtocolInitialized,
		deposit: apexDeposit,
		refreshUserData,
	} = useProductionApex();
>>>>>>> Stashed changes

	const [userExists, setUserExists] = useState<boolean>(false);
	const [isCreatingUser, setIsCreatingUser] = useState<boolean>(false);
	const [selectedMarket, setSelectedMarket] = useState<UIMarketData | null>(
		null
	);
	const [markets, setMarkets] = useState<UIMarketData[]>([]);
	const [_positions] = useState<any[]>([]);
	const [orderBookPrice, setOrderBookPrice] = useState<number | undefined>(
		undefined
	);
	const [activeBottomTab, setActiveBottomTab] = useState<string>('positions');

	// Fetch commodity markets
	useEffect(() => {
<<<<<<< Updated upstream
		if (isReady && driftService) {
			driftService
				.fetchMarkets()
				.then((fetchedMarkets) => {
					setMarkets(fetchedMarkets);
					// Auto-select NGT-USDC as default market
					if (!selectedMarket && fetchedMarkets.length > 0) {
						const ngtMarket = fetchedMarkets.find(
							(m) => m.symbol === 'NGT-USDC'
						);
						setSelectedMarket(ngtMarket || fetchedMarkets[0]);
					}
				})
				.catch(console.error);
		}
	}, [isReady, driftService, selectedMarket]);
=======
		const _fetchMarkets = async () => {
			try {
				// Convert Apex spot markets to UI format
				const fetchedMarkets: UIMarketData[] = spotMarkets.map(
					(market, _index) => ({
						marketIndex: market.marketIndex,
						symbol: `${market.name}-USDC`,
						baseAssetSymbol: market.name,
						quoteAssetSymbol: 'USDC',
						oracleSource: 'Pyth',
						marketType: 'spot' as const,
						lastPrice: 0,
						priceChange24h: 0,
						volume24h: 0,
						isActive: true,
						marketAccount: market,
					})
				);

				setMarkets(fetchedMarkets);

				// Auto-select NGT-USDC as default market
				if (!selectedMarket && fetchedMarkets.length > 0) {
					const ngtMarket = fetchedMarkets.find(
						(m: UIMarketData) => m.symbol === 'NGT-USDC'
					);
					setSelectedMarket(ngtMarket || fetchedMarkets[0]);
					console.log(
						'Trade Page: Auto-selected market:',
						ngtMarket?.symbol || fetchedMarkets[0]?.symbol
					);
				}
			} catch (error) {
				console.error('Trade Page: Error fetching markets:', error);
			}
		};

		_fetchMarkets();
	}, [spotMarkets, selectedMarket]);
>>>>>>> Stashed changes

	// Check if user account exists
	useEffect(() => {
		if (isReady && driftService && connected) {
			// For demo purposes, assume user needs to be created
			setUserExists(false);
		}
	}, [isReady, driftService, connected]);

<<<<<<< Updated upstream
	const handleCreateUser = async () => {
		if (!driftService || !publicKey) return;
=======
	const handleDeposit = async () => {
		if (!connected || !publicKey) {
			alert('Please connect your wallet first');
			return;
		}

		setShowDepositModal(true);
	};
>>>>>>> Stashed changes

		setIsCreatingUser(true);
		try {
<<<<<<< Updated upstream
			await createUser();
			setUserExists(true);
=======
			// Use Apex Protocol deposit function
			console.log('Depositing to Apex Protocol:', {
				amount,
				tokenSymbol,
				user: publicKey.toString(),
			});

			// Map token symbols to mint addresses
			const TOKEN_MINTS: { [key: string]: string } = {
				USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC mainnet
				USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT mainnet
				// Add more tokens as needed
			};

			// Get the mint address for the token symbol
			const mintAddress = TOKEN_MINTS[tokenSymbol];
			if (!mintAddress) {
				throw new Error(`Unsupported token: ${tokenSymbol}`);
			}

			// Find the market index for the token
			const marketIndex = 0; // Default to USDC market for now
			const mintPubkey = new PublicKey(mintAddress);

			const txId = await apexDeposit(marketIndex, amount, mintPubkey);
			console.log('Deposit successful:', txId);

			// Refresh user data to show updated balances
			await refreshUserData();

			alert(`Deposit successful! Transaction: ${txId}`);
			setShowDepositModal(false);
>>>>>>> Stashed changes
		} catch (error: any) {
			console.error('Failed to create user:', error);
		} finally {
			setIsCreatingUser(false);
		}
	};

	const handleMarketSelect = (market: UIMarketData) => {
		setSelectedMarket(market);
	};

	const handlePlaceOrder = async (orderData: OrderFormData) => {
		if (!driftService || !publicKey) return;

<<<<<<< Updated upstream
		console.log('Placing order:', orderData);
		// TODO: Implement order placement
=======
		try {
			console.log('Trade Page: Placing order on Apex Protocol...', orderData);

			// For now, show demo message until order placement is implemented
			console.log('Trade Page: Demo mode - Order would be placed:', orderData);
			alert(
				`Demo: ${orderData.side} order for ${orderData.amount} ${selectedMarket?.symbol} would be placed on Apex Protocol`
			);
		} catch (error: any) {
			console.error('Trade Page: Order placement failed:', error);

			// Show error message to user
			alert(`Order failed: ${error.message || 'Unknown error'}`);
		}
>>>>>>> Stashed changes
	};

	// ✅ PROFESSIONAL TRADING INTERFACE - Drift-style layout
	return (
		<div className="min-h-screen bg-gray-900">
			{/* Top Navigation */}
			<TopNavigation
				onCreateAccount={
					connected && !userExists ? handleCreateUser : undefined
				}
				isCreatingAccount={isCreatingUser}
			/>

			{/* Market Header */}
			<MarketHeader
				selectedMarket={selectedMarket}
				markets={markets}
				onMarketSelect={handleMarketSelect}
			/>

			{/* Main Trading Interface - Drift-style Grid Layout */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* Trading Grid */}
				<div className="grid grid-cols-12 gap-4 flex-1">
					{/* Main Chart Area */}
					<div className="col-span-12 lg:col-span-9 bg-gray-900 rounded">
						<div className="h-full">
<<<<<<< Updated upstream
							<AdvancedChart selectedMarket={selectedMarket} />
=======
							<TradingViewWidget
								selectedMarket={selectedMarket}
								height={500}
								theme="dark"
							/>
>>>>>>> Stashed changes
						</div>
					</div>

					{/* Right Sidebar - Order Book & Order Form */}
					<div className="col-span-12 lg:col-span-3 flex flex-col gap-1">
						{/* Order Book */}
						<div className="bg-gray-900 rounded flex-1">
							<OrderBook
								selectedMarket={selectedMarket}
								onPriceClick={setOrderBookPrice}
							/>
						</div>

						{/* Order Form */}
						<div className="bg-gray-900 rounded flex-1">
							<EnhancedOrderForm
								selectedMarket={selectedMarket}
								onSubmit={handlePlaceOrder}
								onPriceFromOrderBook={orderBookPrice}
							/>
						</div>
					</div>
				</div>

				{/* Bottom Tabs - Positions, Orders, etc. */}
				<div className="bg-gray-900 border-t border-gray-800">
					<div className="max-w-7xl mx-auto">
						{/* Tab Navigation */}
						<div className="flex border-b border-gray-800">
							<button
								onClick={() => setActiveBottomTab('positions')}
								className={`px-6 py-3 text-sm font-medium ${
									activeBottomTab === 'positions'
										? 'text-white bg-gray-800 border-b-2 border-purple-500'
										: 'text-gray-400 hover:text-white'
								}`}
							>
								Positions
							</button>
							<button
								onClick={() => setActiveBottomTab('orders')}
								className={`px-6 py-3 text-sm font-medium ${
									activeBottomTab === 'orders'
										? 'text-white bg-gray-800 border-b-2 border-purple-500'
										: 'text-gray-400 hover:text-white'
								}`}
							>
								Orders
							</button>
							<button
								onClick={() => setActiveBottomTab('trades')}
								className={`px-6 py-3 text-sm font-medium ${
									activeBottomTab === 'trades'
										? 'text-white bg-gray-800 border-b-2 border-purple-500'
										: 'text-gray-400 hover:text-white'
								}`}
							>
								Trades
							</button>
							<button
								onClick={() => setActiveBottomTab('balances')}
								className={`px-6 py-3 text-sm font-medium ${
									activeBottomTab === 'balances'
										? 'text-white bg-gray-800 border-b-2 border-purple-500'
										: 'text-gray-400 hover:text-white'
								}`}
							>
								Balances
							</button>
							<button
								onClick={() => setActiveBottomTab('orderHistory')}
								className={`px-6 py-3 text-sm font-medium ${
									activeBottomTab === 'orderHistory'
										? 'text-white bg-gray-800 border-b-2 border-purple-500'
										: 'text-gray-400 hover:text-white'
								}`}
							>
								Order History
							</button>
							<button
								onClick={() => setActiveBottomTab('positionHistory')}
								className={`px-6 py-3 text-sm font-medium ${
									activeBottomTab === 'positionHistory'
										? 'text-white bg-gray-800 border-b-2 border-purple-500'
										: 'text-gray-400 hover:text-white'
								}`}
							>
								Position History
							</button>
							<button
								onClick={() => setActiveBottomTab('account')}
								className={`px-6 py-3 text-sm font-medium ${
									activeBottomTab === 'account'
										? 'text-white bg-gray-800 border-b-2 border-purple-500'
										: 'text-gray-400 hover:text-white'
								}`}
							>
								Account
							</button>
							<div className="ml-auto flex items-center px-6">
								<button className="text-gray-400 hover:text-white">
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v18"
										/>
									</svg>
								</button>
								<span className="text-gray-400 text-sm ml-2">1</span>
							</div>
						</div>

						{/* Tab Content */}
<<<<<<< Updated upstream
						<div className="p-6">
							{activeBottomTab === 'positions' && (
								<PositionsTable positions={positions} />
							)}
							{activeBottomTab === 'orders' && (
								<div className="text-gray-400 text-center py-8">
									<p>No open orders</p>
								</div>
							)}
							{activeBottomTab === 'trades' && (
								<div className="text-gray-400 text-center py-8">
									<p>No recent trades</p>
								</div>
							)}
							{activeBottomTab === 'balances' && (
								<div className="max-w-4xl">
									<TokenBalances />
								</div>
							)}
							{activeBottomTab === 'orderHistory' && (
								<div className="text-gray-400 text-center py-8">
									<p>No order history</p>
								</div>
							)}
							{activeBottomTab === 'positionHistory' && (
								<div className="text-gray-400 text-center py-8">
									<p>No position history</p>
								</div>
							)}
							{activeBottomTab === 'account' && (
								<div className="text-gray-400 text-center py-8">
									<p>Account information</p>
								</div>
							)}
=======
						<div className="">
							{activeBottomTab === 'positions' && <PositionsTab />}
							{activeBottomTab === 'orders' && <OrdersTab />}
							{activeBottomTab === 'trades' && <HistoryTab />}
							{activeBottomTab === 'balances' && <BalanceTab />}
							{activeBottomTab === 'orderHistory' && <HistoryTab />}
							{activeBottomTab === 'positionHistory' && <PositionsTab />}
							{activeBottomTab === 'account' && <BalanceTab />}
>>>>>>> Stashed changes
						</div>
					</div>
				</div>
			</div>
<<<<<<< Updated upstream
=======

			{/* Deposit Modal */}
			{showDepositModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-gray-800 rounded-lg p-6 w-96 max-w-md">
						<h3 className="text-xl font-semibold text-white mb-4">
							Deposit Funds
						</h3>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Amount (USDC)
								</label>
								<input
									type="number"
									placeholder="Enter amount"
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
									id="deposit-amount"
								/>
							</div>
							<div className="flex space-x-3">
								<button
									onClick={() => {
										const amountInput = document.getElementById(
											'deposit-amount'
										) as HTMLInputElement;
										const amount = parseFloat(amountInput?.value || '0');
										if (amount > 0) {
											handleDepositSubmit(amount, 'USDC');
										} else {
											alert('Please enter a valid amount');
										}
									}}
									disabled={isDepositing}
									className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
										isDepositing
											? 'bg-gray-600 text-gray-300 cursor-not-allowed'
											: 'bg-green-600 hover:bg-green-700 text-white'
									}`}
								>
									{isDepositing ? 'Depositing...' : 'Deposit'}
								</button>
								<button
									onClick={() => setShowDepositModal(false)}
									className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
>>>>>>> Stashed changes
		</div>
	);
}
