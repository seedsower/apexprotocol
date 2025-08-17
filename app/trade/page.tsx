'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import WalletButton from '../../components/WalletButton';

interface Market {
	symbol: string;
	name: string;
	price: number;
	change24h: number;
	volume24h: number;
	marketCap: number;
	high24h: number;
	low24h: number;
	fundingRate: number;
	openInterest: number;
	indexPrice: number;
	markPrice: number;
}

interface UserData {
	wallet: string;
	totalCollateral: number;
	availableBalance: number;
	positions: any[];
	orders: any[];
	balances: Record<string, number>;
}

export default function ApexTradePage() {
	const { publicKey, connected } = useWallet();
	const [markets, setMarkets] = useState<Market[]>([]);
	const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
	const [userData, setUserData] = useState<UserData | null>(null);
	const [activeTab, setActiveTab] = useState('Positions');
	const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
	const [orderAmount, setOrderAmount] = useState('');
	const [orderPrice, setOrderPrice] = useState('');
	const [leverage, setLeverage] = useState(1);
	const [loading, setLoading] = useState(false);

	// Fetch markets data
	useEffect(() => {
		const fetchMarkets = async () => {
			try {
				const response = await fetch('http://localhost:8080/api/markets');
				const data = await response.json();
				setMarkets(data.markets || []);
				if (data.markets && data.markets.length > 0) {
					setSelectedMarket(data.markets[0]);
				}
			} catch (error) {
				console.error('Failed to fetch markets:', error);
			}
		};
		fetchMarkets();
	}, []);

	// Fetch user data when wallet connected
	useEffect(() => {
		if (connected && publicKey) {
			const fetchUserData = async () => {
				try {
					const response = await fetch(
						`http://localhost:8080/api/user/${publicKey.toString()}`
					);
					const data = await response.json();
					setUserData(data);
				} catch (error) {
					console.error('Failed to fetch user data:', error);
				}
			};
			fetchUserData();
		}
	}, [connected, publicKey]);

	// WebSocket for real-time updates
	useEffect(() => {
		const ws = new WebSocket('ws://localhost:8081');

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.type === 'price_update') {
				setMarkets(Object.values(data.data));
				if (selectedMarket) {
					const updatedMarket = data.data[selectedMarket.symbol];
					if (updatedMarket) {
						setSelectedMarket(updatedMarket);
					}
				}
			}
		};

		return () => ws.close();
	}, [selectedMarket]);

	const handleDeposit = async () => {
		if (!connected || !publicKey) {
			alert('Please connect your wallet first');
			return;
		}

		setLoading(true);
		try {
			const response = await fetch('http://localhost:8080/api/deposit', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					wallet: publicKey.toString(),
					amount: 1000,
					market: 'USDC',
				}),
			});
			const result = await response.json();
			if (result.success) {
				alert('Deposit successful!');
				// Refresh user data
				const userResponse = await fetch(
					`http://localhost:8080/api/user/${publicKey.toString()}`
				);
				const userData = await userResponse.json();
				setUserData(userData);
			}
		} catch (error) {
			console.error('Deposit failed:', error);
			alert('Deposit failed');
		}
		setLoading(false);
	};

	const handlePlaceOrder = async () => {
		if (!connected || !publicKey || !selectedMarket) {
			alert('Please connect wallet and select a market');
			return;
		}

		setLoading(true);
		try {
			const response = await fetch('http://localhost:8080/api/order', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					wallet: publicKey.toString(),
					market: selectedMarket.symbol,
					side: orderSide,
					size: parseFloat(orderAmount),
					price: parseFloat(orderPrice) || selectedMarket.price,
					type: orderPrice ? 'limit' : 'market',
				}),
			});
			const result = await response.json();
			if (result.success) {
				alert('Order placed successfully!');
				setOrderAmount('');
				setOrderPrice('');
			}
		} catch (error) {
			console.error('Order failed:', error);
			alert('Order failed');
		}
		setLoading(false);
	};

	return (
		<div className="min-h-screen bg-black text-white">
			{/* Top Banner */}
			<div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-2 text-sm relative">
				Trade <span className="font-bold">NGT</span> and{' '}
				<span className="font-bold">Commodities</span> with{' '}
				<span className="font-bold">0% fees</span>
				<button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200">
					<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
						<path
							fillRule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clipRule="evenodd"
						/>
					</svg>
				</button>
			</div>

			{/* Main Header */}
			<header className="bg-gray-900 border-b border-gray-800 px-6 py-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-8">
						{/* Logo */}
						<div className="flex items-center space-x-3">
							<div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
								<span className="text-white font-bold text-sm">A</span>
							</div>
							<span className="text-white text-xl font-bold">
								Apex Protocol
							</span>
						</div>

						{/* Navigation */}
						<nav className="flex items-center space-x-6">
							<a
								href="/"
								className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
							>
								Overview
							</a>
							<button className="text-white font-medium text-sm">Trade</button>
							<a
								href="/earn"
								className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
							>
								Earn
							</a>
							<a
								href="/vaults"
								className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
							>
								Vaults
							</a>
							<a
								href="/stake"
								className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
							>
								🔥 Stake APEX
							</a>
						</nav>
					</div>

					{/* Apex Logo in Upper Right */}
					<div className="flex items-center space-x-4">
						<div className="flex items-center space-x-2">
							<div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
								<span className="text-white font-bold text-lg">A</span>
							</div>
							<span className="text-white font-bold text-lg">APEX</span>
						</div>
						<WalletButton />
					</div>
				</div>
			</header>

			{/* Market Header */}
			{selectedMarket && (
				<div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-6">
							{/* Market Selector */}
							<div className="relative">
								<select
									value={selectedMarket.symbol}
									onChange={(e) => {
										const market = markets.find(
											(m) => m.symbol === e.target.value
										);
										if (market) setSelectedMarket(market);
									}}
									className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none appearance-none pr-8"
								>
									{markets.map((market) => (
										<option key={market.symbol} value={market.symbol}>
											{market.name} ({market.symbol})
										</option>
									))}
								</select>
								<svg
									className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</div>

							{/* Price Info */}
							<div className="flex items-center space-x-4">
								<div>
									<div className="text-2xl font-bold text-white">
										${selectedMarket.price.toFixed(2)}
									</div>
									<div
										className={`text-sm ${
											selectedMarket.change24h >= 0
												? 'text-green-400'
												: 'text-red-400'
										}`}
									>
										{selectedMarket.change24h >= 0 ? '+' : ''}
										{selectedMarket.change24h.toFixed(2)}%
									</div>
								</div>
								<div className="text-sm text-gray-400">
									<div>24h High: ${selectedMarket.high24h.toFixed(2)}</div>
									<div>24h Low: ${selectedMarket.low24h.toFixed(2)}</div>
								</div>
								<div className="text-sm text-gray-400">
									<div>
										Volume: ${(selectedMarket.volume24h / 1000000).toFixed(1)}M
									</div>
									<div>
										Funding: {(selectedMarket.fundingRate * 100).toFixed(4)}%
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Main Trading Interface */}
			<div className="flex h-[calc(100vh-200px)]">
				{/* Chart Area */}
				<div className="flex-1 bg-black border-r border-gray-800">
					<div className="h-full flex items-center justify-center">
						<div className="text-center">
							<div className="text-6xl mb-4">📈</div>
							<div className="text-xl font-bold mb-2">TradingView Chart</div>
							<div className="text-gray-400">
								Live {selectedMarket?.name || 'Commodity'} Price Chart
							</div>
							{selectedMarket && (
								<div className="mt-4 text-3xl font-bold text-green-400">
									${selectedMarket.price.toFixed(2)}
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Trading Panel */}
				<div className="w-80 bg-gray-900 p-6">
					<div className="space-y-6">
						{/* Order Type Tabs */}
						<div className="flex bg-gray-800 rounded-lg p-1">
							<button
								onClick={() => setOrderSide('buy')}
								className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
									orderSide === 'buy'
										? 'bg-green-600 text-white'
										: 'text-gray-400 hover:text-white'
								}`}
							>
								Buy
							</button>
							<button
								onClick={() => setOrderSide('sell')}
								className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
									orderSide === 'sell'
										? 'bg-red-600 text-white'
										: 'text-gray-400 hover:text-white'
								}`}
							>
								Sell
							</button>
						</div>

						{/* Order Form */}
						<div className="space-y-4">
							<div>
								<label className="block text-gray-400 text-sm mb-2">
									Amount
								</label>
								<input
									type="number"
									value={orderAmount}
									onChange={(e) => setOrderAmount(e.target.value)}
									placeholder="0.00"
									className="w-full bg-gray-800 text-white px-3 py-3 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
								/>
							</div>

							<div>
								<label className="block text-gray-400 text-sm mb-2">
									Price (Leave empty for market order)
								</label>
								<input
									type="number"
									value={orderPrice}
									onChange={(e) => setOrderPrice(e.target.value)}
									placeholder={
										selectedMarket ? selectedMarket.price.toFixed(2) : '0.00'
									}
									className="w-full bg-gray-800 text-white px-3 py-3 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
								/>
							</div>

							<div>
								<label className="block text-gray-400 text-sm mb-2">
									Leverage: {leverage}x
								</label>
								<input
									type="range"
									min="1"
									max="100"
									value={leverage}
									onChange={(e) => setLeverage(parseInt(e.target.value))}
									className="w-full accent-purple-500"
								/>
							</div>

							<button
								onClick={handlePlaceOrder}
								disabled={loading || !connected}
								className={`w-full py-3 rounded-lg font-medium transition-colors ${
									orderSide === 'buy'
										? 'bg-green-600 hover:bg-green-700 text-white'
										: 'bg-red-600 hover:bg-red-700 text-white'
								} disabled:opacity-50 disabled:cursor-not-allowed`}
							>
								{loading
									? 'Processing...'
									: `${orderSide.toUpperCase()} ${
											selectedMarket?.symbol || ''
									  }`}
							</button>
						</div>

						{/* Quick Deposit */}
						{connected && (
							<div className="border-t border-gray-800 pt-4">
								<button
									onClick={handleDeposit}
									disabled={loading}
									className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium disabled:opacity-50"
								>
									{loading ? 'Processing...' : 'Quick Deposit $1000 USDC'}
								</button>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Bottom Panel */}
			<div className="bg-gray-900 border-t border-gray-800">
				<div className="flex border-b border-gray-800">
					{['Positions', 'Orders', 'Balances', 'History'].map((tab) => (
						<button
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={`px-6 py-3 text-sm font-medium transition-colors ${
								activeTab === tab
									? 'text-white border-b-2 border-purple-500 bg-gray-800'
									: 'text-gray-400 hover:text-white'
							}`}
						>
							{tab}
							{tab === 'Positions' && userData?.positions && (
								<span className="ml-2 bg-gray-600 text-white text-xs px-1.5 py-0.5 rounded">
									{userData.positions.length}
								</span>
							)}
						</button>
					))}
				</div>

				<div className="h-48 p-4 overflow-auto">
					{!connected ? (
						<div className="text-center py-8">
							<div className="text-gray-400 mb-4">
								Connect your wallet to view {activeTab.toLowerCase()}
							</div>
							<WalletButton />
						</div>
					) : (
						<div>
							{activeTab === 'Positions' && (
								<div>
									{userData?.positions?.length ? (
										<div className="space-y-2">
											{userData.positions.map((position, index) => (
												<div
													key={index}
													className="flex justify-between items-center bg-gray-800 p-3 rounded"
												>
													<div>
														<div className="font-medium">{position.market}</div>
														<div className="text-sm text-gray-400">
															{position.side} {position.size}
														</div>
													</div>
													<div className="text-right">
														<div
															className={
																position.pnl >= 0
																	? 'text-green-400'
																	: 'text-red-400'
															}
														>
															${position.pnl.toFixed(2)}
														</div>
														<div className="text-sm text-gray-400">
															Entry: ${position.entryPrice.toFixed(2)}
														</div>
													</div>
												</div>
											))}
										</div>
									) : (
										<div className="text-gray-400 text-center py-8">
											No open positions
										</div>
									)}
								</div>
							)}

							{activeTab === 'Balances' && userData && (
								<div className="space-y-2">
									<div className="flex justify-between items-center bg-gray-800 p-3 rounded">
										<span>Total Collateral</span>
										<span className="font-bold">
											${userData.totalCollateral.toFixed(2)}
										</span>
									</div>
									<div className="flex justify-between items-center bg-gray-800 p-3 rounded">
										<span>Available Balance</span>
										<span className="font-bold text-green-400">
											${userData.availableBalance.toFixed(2)}
										</span>
									</div>
									{Object.entries(userData.balances).map(([token, balance]) => (
										<div
											key={token}
											className="flex justify-between items-center bg-gray-800 p-3 rounded"
										>
											<span>{token}</span>
											<span>{balance.toFixed(2)}</span>
										</div>
									))}
								</div>
							)}

							{activeTab === 'Orders' && (
								<div>
									{userData?.orders?.length ? (
										<div className="space-y-2">
											{userData.orders.map((order, index) => (
												<div
													key={index}
													className="flex justify-between items-center bg-gray-800 p-3 rounded"
												>
													<div>
														<div className="font-medium">{order.market}</div>
														<div className="text-sm text-gray-400">
															{order.side} {order.size} @ ${order.price}
														</div>
													</div>
													<div className="text-right">
														<div className="text-yellow-400">
															{order.status}
														</div>
														<button className="text-red-400 hover:text-red-300 text-sm">
															Cancel
														</button>
													</div>
												</div>
											))}
										</div>
									) : (
										<div className="text-gray-400 text-center py-8">
											No open orders
										</div>
									)}
								</div>
							)}

							{activeTab === 'History' && (
								<div className="text-gray-400 text-center py-8">
									Trade history will appear here
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			{/* USDC APY Panel */}
			<div className="fixed bottom-4 right-4 bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
				<div className="flex items-center justify-between">
					<div>
						<div className="font-bold text-lg">USDC 5.81% APY</div>
						<div className="text-sm opacity-90">
							Earn APY while trading commodities.
						</div>
						<button
							onClick={handleDeposit}
							className="bg-white text-green-600 px-3 py-1 rounded font-medium text-sm mt-2 hover:bg-gray-100 transition-colors"
						>
							Deposit now!
						</button>
					</div>
					<div className="text-3xl">💰</div>
				</div>
			</div>
		</div>
	);
}
