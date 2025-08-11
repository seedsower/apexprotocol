'use client';

import React, { useState, useEffect } from 'react';
import { UIMarketData } from '../types';

interface MarketHeaderProps {
	selectedMarket: UIMarketData | null;
	_onMarketSelect?: (market: UIMarketData) => void;
}

export function MarketHeader({
	selectedMarket,
	_onMarketSelect,
}: MarketHeaderProps) {
	const [currentPrice, setCurrentPrice] = useState<number>(0);
	const [priceChange24h, setPriceChange24h] = useState<number>(0);
	const [isPositive, setIsPositive] = useState<boolean>(true);

	// Mock real-time price updates
	useEffect(() => {
		if (!selectedMarket) return;

		// Set initial price from market data
		setCurrentPrice(selectedMarket.markPrice || 0);

		// Simulate price changes for demo
		const interval = setInterval(() => {
			const change = (Math.random() - 0.5) * 0.01; // ±0.5% change
			setCurrentPrice((prev) => {
				const newPrice = prev * (1 + change);
				return Math.max(newPrice, 0.01); // Prevent negative prices
			});

			// Simulate 24h change
			const change24h = (Math.random() - 0.5) * 0.1; // ±5% daily change
			setPriceChange24h(change24h);
			setIsPositive(change24h >= 0);
		}, 2000); // Update every 2 seconds

		return () => clearInterval(interval);
	}, [selectedMarket]);

	// Update browser title with live price
	useEffect(() => {
		if (selectedMarket && currentPrice > 0) {
			document.title = `${currentPrice.toFixed(
				selectedMarket.symbol === 'NGT' ? 4 : 2
			)} | ${selectedMarket.symbol} | APEX Commodities`;
		}
	}, [currentPrice, selectedMarket]);

	if (!selectedMarket) {
		return (
			<div className="bg-gray-900 border-b border-gray-800">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between py-4">
						<div className="flex items-center space-x-4">
							<div className="text-white text-lg font-medium">
								Select a market to start trading
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	const formatPrice = (price: number) => {
		if (selectedMarket.symbol === 'NGT') {
			return price.toFixed(4);
		}
		return price.toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	};

	const formatPercentage = (percent: number) => {
		return `${percent >= 0 ? '+' : ''}${(percent * 100).toFixed(2)}%`;
	};

	return (
		<div className="bg-gray-900 border-b border-gray-800">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between py-4">
					{/* Left Side - Market Info & Price */}
					<div className="flex items-center space-x-6">
						{/* Market Selector */}
						<div className="flex items-center space-x-2">
							<div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
								<span className="text-white text-sm font-bold">
									{selectedMarket.symbol === 'NGT'
										? '⛽'
										: selectedMarket.symbol.charAt(0)}
								</span>
							</div>
							<div className="flex items-center space-x-1">
								<span className="text-white text-lg font-semibold">
									{selectedMarket.symbol}
								</span>
								<span className="text-gray-400 text-sm">
									{selectedMarket.marketType === 'perp' ? '101x' : ''}
								</span>
								<span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
									{selectedMarket.marketType === 'perp' ? '0% fees' : 'Spot'}
								</span>
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
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</button>
							</div>
						</div>

						{/* Live Price */}
						<div className="flex items-center space-x-4">
							<div>
								<div className="text-white text-2xl font-bold">
									${formatPrice(currentPrice)}
								</div>
								<div
									className={`text-sm font-medium ${
										isPositive ? 'text-green-400' : 'text-red-400'
									}`}
								>
									{formatPercentage(priceChange24h)}
								</div>
							</div>
						</div>
					</div>

					{/* Right Side - Market Stats */}
					<div className="hidden lg:flex items-center space-x-8">
						{/* Oracle Price */}
						<div className="text-center">
							<div className="text-xs text-gray-400 uppercase tracking-wide">
								Oracle Price
							</div>
							<div className="text-white font-medium">
								${formatPrice(selectedMarket.oraclePrice || currentPrice)}
							</div>
						</div>

						{/* Funding Rate (for perps) */}
						{selectedMarket.marketType === 'perp' && (
							<div className="text-center">
								<div className="text-xs text-gray-400 uppercase tracking-wide">
									Predicted / 24h Funding Rate
								</div>
								<div className="text-white font-medium">
									0.0010% / 0.0065%
									<svg
										className="w-3 h-3 inline ml-1"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
							</div>
						)}

						{/* Open Interest */}
						<div className="text-center">
							<div className="text-xs text-gray-400 uppercase tracking-wide">
								Open Interest
							</div>
							<div className="text-white font-medium">
								{selectedMarket.symbol === 'NGT' ? '8606 NGT' : '1.2M USD'}
							</div>
						</div>

						{/* 24h Volume */}
						<div className="text-center">
							<div className="text-xs text-gray-400 uppercase tracking-wide">
								24h Volume
							</div>
							<div className="text-white font-medium">
								{selectedMarket.symbol === 'NGT' ? '$2.1M' : '$45.2M'}
							</div>
						</div>

						{/* About Market */}
						<button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
							View Details
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
