'use client';

import React, { useState, useEffect } from 'react';
import { UIMarketData } from '../types';

interface OrderBookProps {
	selectedMarket: UIMarketData | null;
	onPriceClick?: (price: number) => void;
}

interface OrderBookEntry {
	price: number;
	size: number;
	total: number;
}

interface RecentTrade {
	price: number;
	size: number;
	side: 'buy' | 'sell';
	time: string;
}

export function OrderBook({ selectedMarket, onPriceClick }: OrderBookProps) {
	const [bids, setBids] = useState<OrderBookEntry[]>([]);
	const [asks, setAsks] = useState<OrderBookEntry[]>([]);
	const [recentTrades, setRecentTrades] = useState<RecentTrade[]>([]);
	const [spread, setSpread] = useState<number>(0);
	const [spreadPercent, setSpreadPercent] = useState<number>(0);
	const [view, setView] = useState<'book' | 'trades'>('book');

	// Generate mock order book data
	useEffect(() => {
		if (!selectedMarket) {
			setBids([]);
			setAsks([]);
			setRecentTrades([]);
			return;
		}

		const generateOrderBook = () => {
			const basePrice = selectedMarket.lastPrice;
			const mockBids: OrderBookEntry[] = [];
			const mockAsks: OrderBookEntry[] = [];

			// Generate bids (below current price)
			let totalBidSize = 0;
			for (let i = 0; i < 15; i++) {
				const priceOffset = (i + 1) * (basePrice * 0.001); // 0.1% steps
				const price = basePrice - priceOffset;
				const size = Math.random() * 1000 + 100;
				totalBidSize += size;

				mockBids.push({
					price: Number(price.toFixed(2)),
					size: Number(size.toFixed(2)),
					total: Number(totalBidSize.toFixed(2)),
				});
			}

			// Generate asks (above current price)
			let totalAskSize = 0;
			for (let i = 0; i < 15; i++) {
				const priceOffset = (i + 1) * (basePrice * 0.001); // 0.1% steps
				const price = basePrice + priceOffset;
				const size = Math.random() * 1000 + 100;
				totalAskSize += size;

				mockAsks.unshift({
					price: Number(price.toFixed(2)),
					size: Number(size.toFixed(2)),
					total: Number(totalAskSize.toFixed(2)),
				});
			}

			setBids(mockBids);
			setAsks(mockAsks);

			// Calculate spread
			const bestBid = mockBids[0]?.price || 0;
			const bestAsk = mockAsks[mockAsks.length - 1]?.price || 0;
			const currentSpread = bestAsk - bestBid;
			const currentSpreadPercent = (currentSpread / basePrice) * 100;

			setSpread(currentSpread);
			setSpreadPercent(currentSpreadPercent);
		};

		const generateRecentTrades = () => {
			const trades: RecentTrade[] = [];
			const basePrice = selectedMarket.lastPrice;

			for (let i = 0; i < 20; i++) {
				const priceVariation = (Math.random() - 0.5) * (basePrice * 0.002);
				const price = basePrice + priceVariation;
				const size = Math.random() * 500 + 50;
				const side = Math.random() > 0.5 ? 'buy' : 'sell';
				const time = new Date(Date.now() - i * 30000).toLocaleTimeString(
					'en-US',
					{
						hour12: false,
						hour: '2-digit',
						minute: '2-digit',
						second: '2-digit',
					}
				);

				trades.push({
					price: Number(price.toFixed(2)),
					size: Number(size.toFixed(2)),
					side,
					time,
				});
			}

			setRecentTrades(trades);
		};

		generateOrderBook();
		generateRecentTrades();

		// Update every 2 seconds to simulate real-time data
		const interval = setInterval(() => {
			generateOrderBook();
			generateRecentTrades();
		}, 2000);

		return () => clearInterval(interval);
	}, [selectedMarket]);

	const handlePriceClick = (price: number) => {
		if (onPriceClick) {
			onPriceClick(price);
		}
	};

	const formatNumber = (num: number, decimals: number = 2) => {
		return num.toLocaleString('en-US', {
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals,
		});
	};

	const getBarWidth = (size: number, maxSize: number) => {
		return Math.min((size / maxSize) * 100, 100);
	};

	if (!selectedMarket) {
		return (
			<div className="h-full flex items-center justify-center bg-gray-900 rounded">
				<div className="text-center">
					<div className="text-gray-400 text-lg mb-2">📊</div>
					<div className="text-gray-300 font-medium">Order Book</div>
					<div className="text-gray-500 text-sm">
						Select a market to view order book
					</div>
				</div>
			</div>
		);
	}

	const maxBidSize = Math.max(...bids.map((b) => b.size));
	const maxAskSize = Math.max(...asks.map((a) => a.size));
	const maxSize = Math.max(maxBidSize, maxAskSize);

	return (
		<div className="h-full flex flex-col bg-gray-900 rounded">
			{/* Header */}
			<div className="p-4 border-b border-gray-800">
				<div className="flex items-center justify-between mb-3">
					<h3 className="text-white font-medium">Order Book</h3>
					<div className="flex bg-gray-800 rounded p-1">
						<button
							onClick={() => setView('book')}
							className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
								view === 'book'
									? 'bg-purple-600 text-white'
									: 'text-gray-400 hover:text-white'
							}`}
						>
							Book
						</button>
						<button
							onClick={() => setView('trades')}
							className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
								view === 'trades'
									? 'bg-purple-600 text-white'
									: 'text-gray-400 hover:text-white'
							}`}
						>
							Trades
						</button>
					</div>
				</div>

				{/* Spread Info */}
				<div className="flex items-center justify-between text-xs">
					<span className="text-gray-400">Spread</span>
					<div className="text-right">
						<div className="text-white">{formatNumber(spread, 2)}</div>
						<div className="text-gray-400">
							({formatNumber(spreadPercent, 3)}%)
						</div>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="flex-1 overflow-hidden">
				{view === 'book' ? (
					<div className="h-full flex flex-col">
						{/* Column Headers */}
						<div className="px-4 py-2 border-b border-gray-800">
							<div className="grid grid-cols-3 gap-2 text-xs text-gray-400">
								<div className="text-left">Size</div>
								<div className="text-center">Price</div>
								<div className="text-right">Total</div>
							</div>
						</div>

						{/* Asks (Sells) */}
						<div className="flex-1 overflow-y-auto">
							<div className="px-4 py-2">
								{asks.slice(0, 8).map((ask, index) => (
									<div
										key={`ask-${index}`}
										className="relative grid grid-cols-3 gap-2 py-1 text-xs hover:bg-gray-800 cursor-pointer transition-colors"
										onClick={() => handlePriceClick(ask.price)}
									>
										{/* Background bar */}
										<div
											className="absolute right-0 top-0 h-full bg-red-900 opacity-20"
											style={{ width: `${getBarWidth(ask.size, maxSize)}%` }}
										/>
										<div className="text-white z-10">
											{formatNumber(ask.size)}
										</div>
										<div className="text-red-400 text-center z-10">
											{formatNumber(ask.price)}
										</div>
										<div className="text-gray-400 text-right z-10">
											{formatNumber(ask.total)}
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Current Price */}
						<div className="px-4 py-3 border-y border-gray-800 bg-gray-800">
							<div className="flex items-center justify-between">
								<span className="text-gray-400 text-xs">Mark Price</span>
								<div className="text-right">
									<div className="text-white font-medium">
										{formatNumber(selectedMarket.lastPrice)}
									</div>
									<div
										className={`text-xs ${
											selectedMarket.priceChange24h >= 0
												? 'text-green-400'
												: 'text-red-400'
										}`}
									>
										{selectedMarket.priceChange24h >= 0 ? '+' : ''}
										{formatNumber(selectedMarket.priceChange24h, 2)}%
									</div>
								</div>
							</div>
						</div>

						{/* Bids (Buys) */}
						<div className="flex-1 overflow-y-auto">
							<div className="px-4 py-2">
								{bids.slice(0, 8).map((bid, index) => (
									<div
										key={`bid-${index}`}
										className="relative grid grid-cols-3 gap-2 py-1 text-xs hover:bg-gray-800 cursor-pointer transition-colors"
										onClick={() => handlePriceClick(bid.price)}
									>
										{/* Background bar */}
										<div
											className="absolute right-0 top-0 h-full bg-green-900 opacity-20"
											style={{ width: `${getBarWidth(bid.size, maxSize)}%` }}
										/>
										<div className="text-white z-10">
											{formatNumber(bid.size)}
										</div>
										<div className="text-green-400 text-center z-10">
											{formatNumber(bid.price)}
										</div>
										<div className="text-gray-400 text-right z-10">
											{formatNumber(bid.total)}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				) : (
					/* Recent Trades */
					<div className="h-full flex flex-col">
						{/* Column Headers */}
						<div className="px-4 py-2 border-b border-gray-800">
							<div className="grid grid-cols-3 gap-2 text-xs text-gray-400">
								<div className="text-left">Price</div>
								<div className="text-center">Size</div>
								<div className="text-right">Time</div>
							</div>
						</div>

						{/* Trades List */}
						<div className="flex-1 overflow-y-auto">
							<div className="px-4 py-2">
								{recentTrades.map((trade, index) => (
									<div
										key={`trade-${index}`}
										className="grid grid-cols-3 gap-2 py-1 text-xs hover:bg-gray-800 transition-colors"
									>
										<div
											className={`${
												trade.side === 'buy' ? 'text-green-400' : 'text-red-400'
											}`}
										>
											{formatNumber(trade.price)}
										</div>
										<div className="text-white text-center">
											{formatNumber(trade.size)}
										</div>
										<div className="text-gray-400 text-right">{trade.time}</div>
									</div>
								))}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
