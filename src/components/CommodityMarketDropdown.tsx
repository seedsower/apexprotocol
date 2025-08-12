'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UIMarketData } from '../types';

interface CommodityMarketDropdownProps {
	selectedMarket: UIMarketData | null;
	markets: UIMarketData[];
	onSelectMarket: (market: UIMarketData) => void;
}

interface MarketCategory {
	name: string;
	icon: string;
	markets: UIMarketData[];
}

export function CommodityMarketDropdown({
	selectedMarket,
	markets,
	onSelectMarket,
}: CommodityMarketDropdownProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState<string>('all');
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	// Categorize commodity markets
	const categorizeMarkets = (): MarketCategory[] => {
		const categories: MarketCategory[] = [
			{ name: 'Energy', icon: '⚡', markets: [] },
			{ name: 'Metals', icon: '🥇', markets: [] },
			{ name: 'Agriculture', icon: '🌾', markets: [] },
			{ name: 'Livestock', icon: '🐄', markets: [] },
			{ name: 'Softs', icon: '☕', markets: [] },
			{ name: 'Indices', icon: '📊', markets: [] },
		];

		markets.forEach((market) => {
			const symbol = market.baseAssetSymbol.toLowerCase();

			if (['ngt', 'ng', 'wti', 'oil'].includes(symbol)) {
				categories[0].markets.push(market);
			} else if (
				[
					'xau',
					'gold',
					'xag',
					'silver',
					'copper',
					'aluminum',
					'platinum',
					'palladium',
				].includes(symbol)
			) {
				categories[1].markets.push(market);
			} else if (['wheat', 'corn'].includes(symbol)) {
				categories[2].markets.push(market);
			} else if (['cattle', 'hogs'].includes(symbol)) {
				categories[3].markets.push(market);
			} else if (
				['coffee', 'sugar', 'cocoa', 'cotton', 'orange'].includes(symbol)
			) {
				categories[4].markets.push(market);
			} else if (['djp', 'gsg', 'crb'].includes(symbol)) {
				categories[5].markets.push(market);
			}
		});

		return categories.filter((category) => category.markets.length > 0);
	};

	// Filter markets based on search and category
	const getFilteredMarkets = () => {
		let filtered = markets;

		// Filter by category
		if (selectedCategory !== 'all') {
			const categories = categorizeMarkets();
			const category = categories.find(
				(cat) => cat.name.toLowerCase() === selectedCategory
			);
			filtered = category ? category.markets : [];
		}

		// Filter by search term
		if (searchTerm) {
			filtered = filtered.filter(
				(market) =>
					market.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
					market.baseAssetSymbol
						.toLowerCase()
						.includes(searchTerm.toLowerCase())
			);
		}

		return filtered;
	};

	const formatPrice = (price: number) => {
		if (price < 1) {
			return price.toFixed(4);
		}
		return price.toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	};

	const getMarketIcon = (symbol: string) => {
		const s = symbol.toLowerCase();
		// Energy
		if (['ngt', 'ng'].includes(s)) return '⛽';
		if (['wti', 'oil'].includes(s)) return '🛢️';
		// Metals (Precious & Industrial)
		if (['xau', 'gold'].includes(s)) return '🥇';
		if (['xag', 'silver'].includes(s)) return '🥈';
		if (s === 'copper') return '🔩';
		if (s === 'aluminum') return '⚙️';
		if (s === 'platinum') return '🔘';
		if (s === 'palladium') return '🔗';
		// Agriculture
		if (s === 'wheat') return '🌾';
		if (s === 'corn') return '🌽';
		// Livestock
		if (s === 'cattle') return '🐄';
		if (s === 'hogs') return '🐷';
		// Softs (Soft Commodities)
		if (s === 'coffee') return '☕';
		if (s === 'sugar') return '🍯';
		if (s === 'cocoa') return '🍫';
		if (s === 'cotton') return '🧵';
		if (s === 'orange') return '🍊';
		// Indices
		if (['djp', 'gsg', 'crb'].includes(s)) return '📈';
		return '📊';
	};

	const categories = categorizeMarkets();
	const filteredMarkets = getFilteredMarkets();

	return (
		<div className="relative" ref={dropdownRef}>
			{/* Market Selector Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 transition-colors"
			>
				{selectedMarket ? (
					<>
						<span className="text-lg">
							{getMarketIcon(selectedMarket.baseAssetSymbol)}
						</span>
						<div className="flex items-center space-x-1">
							<span className="text-white font-semibold">
								{selectedMarket.symbol}
							</span>
							<span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
								{selectedMarket.marketType.toUpperCase()}
							</span>
						</div>
					</>
				) : (
					<span className="text-gray-400">Select Market</span>
				)}
				<svg
					className={`w-4 h-4 text-gray-400 transition-transform ${
						isOpen ? 'rotate-180' : ''
					}`}
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

			{/* Dropdown Menu */}
			{isOpen && (
				<div className="absolute top-full left-0 mt-1 w-96 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50">
					{/* Header */}
					<div className="p-4 border-b border-gray-600">
						<h3 className="text-white font-semibold mb-3">Commodity Markets</h3>

						{/* Search */}
						<input
							type="text"
							placeholder="Search commodities..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>

						{/* Category Filters */}
						<div className="flex flex-wrap gap-2 mt-3">
							<button
								onClick={() => setSelectedCategory('all')}
								className={`px-3 py-1 text-xs rounded-full transition-colors ${
									selectedCategory === 'all'
										? 'bg-blue-600 text-white'
										: 'bg-gray-700 text-gray-300 hover:bg-gray-600'
								}`}
							>
								All
							</button>
							{categories.map((category) => (
								<button
									key={category.name}
									onClick={() =>
										setSelectedCategory(category.name.toLowerCase())
									}
									className={`px-3 py-1 text-xs rounded-full transition-colors flex items-center space-x-1 ${
										selectedCategory === category.name.toLowerCase()
											? 'bg-blue-600 text-white'
											: 'bg-gray-700 text-gray-300 hover:bg-gray-600'
									}`}
								>
									<span>{category.icon}</span>
									<span>{category.name}</span>
								</button>
							))}
						</div>
					</div>

					{/* Markets List */}
					<div className="max-h-80 overflow-y-auto">
						{filteredMarkets.length === 0 ? (
							<div className="p-4 text-center text-gray-400">
								No markets found
							</div>
						) : (
							<div className="p-2">
								{filteredMarkets.map((market) => (
									<button
										key={`${market.marketType}-${market.marketIndex}`}
										onClick={() => {
											onSelectMarket(market);
											setIsOpen(false);
											setSearchTerm('');
										}}
										className={`w-full p-3 rounded-lg hover:bg-gray-700 transition-colors text-left ${
											selectedMarket?.marketIndex === market.marketIndex &&
											selectedMarket?.marketType === market.marketType
												? 'bg-gray-700 border border-blue-500'
												: ''
										}`}
									>
										<div className="flex items-center justify-between mb-1">
											<div className="flex items-center space-x-3">
												<span className="text-lg">
													{getMarketIcon(market.baseAssetSymbol)}
												</span>
												<div>
													<div className="flex items-center space-x-2">
														<span className="text-white font-medium">
															{market.symbol}
														</span>
														<span className="text-xs bg-gray-600 text-gray-300 px-2 py-0.5 rounded">
															{market.marketType.toUpperCase()}
														</span>
													</div>
													<div className="text-xs text-gray-400">
														{market.baseAssetSymbol} / {market.quoteAssetSymbol}
													</div>
												</div>
											</div>
											<div className="text-right">
												<div className="text-white font-medium">
													${formatPrice(market.lastPrice)}
												</div>
												<div
													className={`text-xs ${
														market.priceChange24h >= 0
															? 'text-green-400'
															: 'text-red-400'
													}`}
												>
													{market.priceChange24h >= 0 ? '+' : ''}
													{market.priceChange24h.toFixed(2)}%
												</div>
											</div>
										</div>

										{/* Additional Info */}
										<div className="flex items-center justify-between text-xs text-gray-400">
											<span>
												Vol: ${(market.volume24h / 1000000).toFixed(1)}M
											</span>
											{market.marketType === 'perp' &&
												market.funding !== undefined && (
													<span
														className={
															market.funding >= 0
																? 'text-green-400'
																: 'text-red-400'
														}
													>
														Funding: {(market.funding * 100).toFixed(4)}%
													</span>
												)}
										</div>
									</button>
								))}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
