'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDrift } from '../../src/providers/DriftProvider';
import { TopNavigation } from '../../src/components/TopNavigation';
import { MarketHeader } from '../../src/components/MarketHeader';
import { MarketSelector } from '../../src/components/MarketSelector';
import { AdvancedChart } from '../../src/components/AdvancedChart';
import { OrderBook } from '../../src/components/OrderBook';
import { EnhancedOrderForm } from '../../src/components/EnhancedOrderForm';
import { TokenBalances } from '../../src/components/TokenBalances';
import { PositionsTable } from '../../src/components/PositionsTable';

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
	const { driftService, isReady, createUser } = useDrift();

	const [userExists, setUserExists] = useState<boolean>(false);
	const [isCreatingUser, setIsCreatingUser] = useState<boolean>(false);
	const [selectedMarket, setSelectedMarket] = useState<UIMarketData | null>(
		null
	);
	const [positions] = useState<any[]>([]);
	const [orderBookPrice, setOrderBookPrice] = useState<number | undefined>(
		undefined
	);
	const [activeBottomTab, setActiveBottomTab] = useState<string>('positions');

	// Check if user account exists
	useEffect(() => {
		if (isReady && driftService && connected) {
			// For demo purposes, assume user needs to be created
			setUserExists(false);
		}
	}, [isReady, driftService, connected]);

	const handleCreateUser = async () => {
		if (!driftService || !publicKey) return;

		setIsCreatingUser(true);
		try {
			await createUser();
			setUserExists(true);
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

		console.log('Placing order:', orderData);
		// TODO: Implement order placement
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
				_onMarketSelect={handleMarketSelect}
			/>

			{/* Main Trading Interface - Drift-style Grid Layout */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* Trading Grid */}
				<div className="flex-1 grid grid-cols-12 gap-1 p-1 bg-gray-800">
					{/* Left Sidebar - Market Selection (hidden on mobile) */}
					<div className="hidden lg:block lg:col-span-2 bg-gray-900 rounded">
						<div className="p-4">
							<h3 className="text-white text-sm font-medium mb-3">Markets</h3>
							<MarketSelector onSelectMarket={handleMarketSelect} />
						</div>
					</div>

					{/* Main Chart Area */}
					<div className="col-span-12 lg:col-span-7 bg-gray-900 rounded">
						<div className="h-full">
							<AdvancedChart selectedMarket={selectedMarket} />
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
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
