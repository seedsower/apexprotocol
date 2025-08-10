'use client';

import React from 'react';
import { useMarkets } from '../hooks/useMarkets';
import { UIMarketData } from '../types';

interface MarketSelectorProps {
	onSelectMarket: (market: UIMarketData) => void;
}

export const MarketSelector: React.FC<MarketSelectorProps> = ({
	onSelectMarket,
}) => {
	const {
		filteredMarkets,
		loading,
		error,
		selectorState,
		updateSelectorState,
	} = useMarkets();

	return (
		<div className="flex flex-col h-full">
			{/* Header */}
			<div className="p-4 border-b border-gray-200">
				<h2 className="text-lg font-semibold text-gray-900 mb-3">Markets</h2>

				{/* Search */}
				<input
					type="text"
					placeholder="Search markets..."
					value={selectorState.searchTerm}
					onChange={(e) => updateSelectorState({ searchTerm: e.target.value })}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
				/>

				{/* Filters */}
				<div className="flex gap-2 mb-3">
					<select
						value={selectorState.marketType}
						onChange={(e) =>
							updateSelectorState({ marketType: e.target.value as any })
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
					>
						<option value="all">All Markets</option>
						<option value="perp">Perpetuals</option>
						<option value="spot">Spot</option>
					</select>
				</div>

				{/* Sort Options */}
				<div className="flex gap-2">
					<select
						value={selectorState.sortBy}
						onChange={(e) =>
							updateSelectorState({ sortBy: e.target.value as any })
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm flex-1"
					>
						<option value="symbol">Symbol</option>
						<option value="volume">Volume</option>
						<option value="priceChange">Change %</option>
					</select>
					<button
						onClick={() =>
							updateSelectorState({
								sortDirection:
									selectorState.sortDirection === 'asc' ? 'desc' : 'asc',
							})
						}
						className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 text-sm rounded transition-colors"
					>
						{selectorState.sortDirection === 'asc' ? '↑' : '↓'}
					</button>
				</div>
			</div>

			{/* Markets List */}
			<div className="flex-1 overflow-y-auto">
				{loading && (
					<div className="p-4 text-center text-gray-500">
						<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
						Loading markets...
					</div>
				)}

				{error && (
					<div className="p-4 text-red-600 text-sm">Error: {error}</div>
				)}

				{!loading && !error && filteredMarkets.length === 0 && (
					<div className="p-4 text-center text-gray-500">No markets found</div>
				)}

				{!loading &&
					!error &&
					filteredMarkets.map((market) => (
						<div
							key={`${market.marketType}-${market.marketIndex}`}
							onClick={() => onSelectMarket(market)}
							className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors bg-white rounded-lg mb-2 mx-2 shadow-sm ${
								selectorState.selectedMarket?.marketIndex ===
									market.marketIndex &&
								selectorState.selectedMarket?.marketType === market.marketType
									? 'bg-blue-50 border-l-4 border-l-blue-600'
									: ''
							}`}
						>
							<div className="flex items-center justify-between mb-1">
								<div className="flex items-center gap-2">
									<span className="font-medium text-gray-900">
										{market.symbol}
									</span>
									<span
										className={`text-xs px-2 py-1 rounded ${
											market.marketType === 'perp'
												? 'bg-blue-100 text-blue-700'
												: 'bg-green-100 text-green-700'
										}`}
									>
										{market.marketType.toUpperCase()}
									</span>
								</div>
								<span className="text-sm font-medium text-gray-900">
									${market.lastPrice.toFixed(2)}
								</span>
							</div>

							<div className="flex items-center justify-between text-xs">
								<span className="text-gray-500">
									Vol: ${(market.volume24h / 1000000).toFixed(1)}M
								</span>
								<span
									className={`font-medium ${
										market.priceChange24h >= 0
											? 'text-green-600'
											: 'text-red-600'
									}`}
								>
									{market.priceChange24h >= 0 ? '+' : ''}
									{market.priceChange24h.toFixed(2)}%
								</span>
							</div>

							{market.marketType === 'perp' && market.funding !== undefined && (
								<div className="flex items-center justify-between text-xs mt-1">
									<span className="text-gray-500">Funding:</span>
									<span
										className={`font-medium ${
											market.funding >= 0 ? 'text-green-600' : 'text-red-600'
										}`}
									>
										{(market.funding * 100).toFixed(4)}%
									</span>
								</div>
							)}
						</div>
					))}
			</div>
		</div>
	);
};
