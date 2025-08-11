'use client';

import React from 'react';
import { UIMarketData } from '../types';

interface ChartProps {
	selectedMarket: UIMarketData | null;
}

export const Chart: React.FC<ChartProps> = ({ selectedMarket }) => {
	return (
		<div className="h-full flex flex-col">
			{/* Chart Header */}
			<div className="p-4 border-b border-dark-200">
				<div className="flex items-center justify-between">
					<div>
						{selectedMarket ? (
							<div className="flex items-center gap-4">
								<h3 className="text-lg font-semibold text-dark-900">
									{selectedMarket.symbol}
								</h3>
								<div className="flex items-center gap-2">
									<span className="text-2xl font-bold text-dark-900">
										${selectedMarket.lastPrice.toFixed(2)}
									</span>
									<span
										className={`text-sm font-medium ${
											selectedMarket.priceChange24h >= 0
												? 'text-success-600'
												: 'text-danger-600'
										}`}
									>
										{selectedMarket.priceChange24h >= 0 ? '+' : ''}
										{selectedMarket.priceChange24h.toFixed(2)}%
									</span>
								</div>
							</div>
						) : (
							<h3 className="text-lg font-semibold text-dark-500">
								Select a market to view chart
							</h3>
						)}
					</div>

					{/* Chart Controls */}
					<div className="flex items-center gap-2">
						<div className="flex bg-dark-100 rounded-lg p-1">
							{['1m', '5m', '15m', '1h', '4h', '1d'].map((timeframe) => (
								<button
									key={timeframe}
									className="px-3 py-1 text-sm font-medium rounded-md transition-colors hover:bg-white hover:text-dark-900 text-dark-600"
								>
									{timeframe}
								</button>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Chart Content */}
			<div className="flex-1 flex items-center justify-center bg-dark-25">
				{selectedMarket ? (
					<div className="text-center">
						{/* Placeholder for TradingView or other charting library */}
						<div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
							<svg
								className="w-8 h-8 text-primary-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
								/>
							</svg>
						</div>
						<h4 className="text-lg font-medium text-dark-700 mb-2">
							Chart Coming Soon
						</h4>
						<p className="text-dark-500 text-sm max-w-sm">
							Integration with TradingView or custom charting solution will be
							added here. Currently showing basic market information.
						</p>

						{/* Basic Market Stats */}
						<div className="mt-6 grid grid-cols-2 gap-4 max-w-md mx-auto">
							<div className="bg-white rounded-lg p-4 text-left">
								<div className="text-xs text-dark-500 uppercase tracking-wider mb-1">
									24h Volume
								</div>
								<div className="text-lg font-semibold text-dark-900">
									${(selectedMarket.volume24h / 1000000).toFixed(1)}M
								</div>
							</div>

							<div className="bg-white rounded-lg p-4 text-left">
								<div className="text-xs text-dark-500 uppercase tracking-wider mb-1">
									Market Type
								</div>
								<div className="text-lg font-semibold text-dark-900 capitalize">
									{selectedMarket.marketType}
								</div>
							</div>

							{selectedMarket.marketType === 'perp' && (
								<>
									<div className="bg-white rounded-lg p-4 text-left">
										<div className="text-xs text-dark-500 uppercase tracking-wider mb-1">
											Open Interest
										</div>
										<div className="text-lg font-semibold text-dark-900">
											${(selectedMarket.openInterest || 0).toLocaleString()}
										</div>
									</div>

									<div className="bg-white rounded-lg p-4 text-left">
										<div className="text-xs text-dark-500 uppercase tracking-wider mb-1">
											Funding Rate
										</div>
										<div
											className={`text-lg font-semibold ${
												(selectedMarket.funding || 0) >= 0
													? 'text-success-600'
													: 'text-danger-600'
											}`}
										>
											{((selectedMarket.funding || 0) * 100).toFixed(4)}%
										</div>
									</div>
								</>
							)}
						</div>
					</div>
				) : (
					<div className="text-center">
						<div className="w-16 h-16 bg-dark-200 rounded-lg flex items-center justify-center mx-auto mb-4">
							<svg
								className="w-8 h-8 text-dark-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
								/>
							</svg>
						</div>
						<h4 className="text-lg font-medium text-dark-500 mb-2">
							No Market Selected
						</h4>
						<p className="text-dark-400 text-sm">
							Choose a market from the sidebar to view its price chart and
							trading data.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};
