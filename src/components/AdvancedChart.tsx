'use client';

import React, { useEffect, useState } from 'react';
import { UIMarketData } from '../types';

interface AdvancedChartProps {
	selectedMarket: UIMarketData | null;
}

interface CandleData {
	time: number;
	open: number;
	high: number;
	low: number;
	close: number;
}

export function AdvancedChart({ selectedMarket }: AdvancedChartProps) {
	const [timeframe, setTimeframe] = useState('1D');
	const [chartType, setChartType] = useState('candlesticks');
	const [chartData, setChartData] = useState<CandleData[]>([]);

	// Chart timeframe options
	const timeframes = [
		{ label: '1m', value: '1' },
		{ label: '5m', value: '5' },
		{ label: '15m', value: '15' },
		{ label: '1H', value: '60' },
		{ label: '4H', value: '240' },
		{ label: '1D', value: '1D' },
		{ label: '1W', value: '1W' },
	];

	// Generate mock chart data when market changes
	useEffect(() => {
		if (!selectedMarket) {
			setChartData([]);
			return;
		}

		const generateMockData = () => {
			const data: CandleData[] = [];
			const basePrice = selectedMarket.lastPrice;
			let currentPrice = basePrice;

			for (let i = 50; i >= 0; i--) {
				const time = Date.now() - i * 3600000; // hourly data
				const variation = (Math.random() - 0.5) * (basePrice * 0.02); // 2% variation
				currentPrice += variation;

				const open = currentPrice;
				const high = open + Math.random() * (basePrice * 0.01);
				const low = open - Math.random() * (basePrice * 0.01);
				const close = low + Math.random() * (high - low);

				data.push({
					time,
					open: Number(open.toFixed(2)),
					high: Number(high.toFixed(2)),
					low: Number(low.toFixed(2)),
					close: Number(close.toFixed(2)),
				});

				currentPrice = close;
			}

			return data;
		};

		setChartData(generateMockData());
	}, [selectedMarket]);

	const handleTimeframeChange = (newTimeframe: string) => {
		setTimeframe(newTimeframe);
	};

	const handleChartTypeChange = (type: string) => {
		setChartType(type);
	};

	// Custom SVG Candlestick Chart Component
	const renderCandlestickChart = () => {
		if (chartData.length === 0) return null;

		const chartWidth = 800;
		const chartHeight = 400;
		const padding = { top: 20, right: 60, bottom: 40, left: 60 };
		const innerWidth = chartWidth - padding.left - padding.right;
		const innerHeight = chartHeight - padding.top - padding.bottom;

		// Calculate price range
		const allPrices = chartData.flatMap((d) => [d.high, d.low]);
		const minPrice = Math.min(...allPrices);
		const maxPrice = Math.max(...allPrices);
		const priceRange = maxPrice - minPrice;
		const priceMargin = priceRange * 0.1;
		const adjustedMin = minPrice - priceMargin;
		const adjustedMax = maxPrice + priceMargin;
		const adjustedRange = adjustedMax - adjustedMin;

		// Scale functions
		const xScale = (index: number) =>
			(index / (chartData.length - 1)) * innerWidth;
		const yScale = (price: number) =>
			innerHeight - ((price - adjustedMin) / adjustedRange) * innerHeight;
		const candleWidth = Math.max(2, (innerWidth / chartData.length) * 0.6);

		return (
			<svg width={chartWidth} height={chartHeight} className="w-full h-full">
				{/* Background */}
				<rect width={chartWidth} height={chartHeight} fill="#1f2937" />

				{/* Grid lines */}
				<g transform={`translate(${padding.left}, ${padding.top})`}>
					{/* Horizontal grid lines */}
					{[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
						const y = ratio * innerHeight;
						const price = adjustedMax - ratio * adjustedRange;
						return (
							<g key={ratio}>
								<line
									x1={0}
									y1={y}
									x2={innerWidth}
									y2={y}
									stroke="#374151"
									strokeWidth={1}
								/>
								<text
									x={innerWidth + 10}
									y={y + 4}
									fill="#9ca3af"
									fontSize="12"
									textAnchor="start"
								>
									{price.toFixed(2)}
								</text>
							</g>
						);
					})}

					{/* Vertical grid lines */}
					{chartData
						.filter((_, i) => i % Math.ceil(chartData.length / 6) === 0)
						.map((candle, i) => {
							const actualIndex = i * Math.ceil(chartData.length / 6);
							const x = xScale(actualIndex);
							const time = new Date(candle.time).toLocaleDateString();
							return (
								<g key={actualIndex}>
									<line
										x1={x}
										y1={0}
										x2={x}
										y2={innerHeight}
										stroke="#374151"
										strokeWidth={1}
									/>
									<text
										x={x}
										y={innerHeight + 20}
										fill="#9ca3af"
										fontSize="10"
										textAnchor="middle"
									>
										{time}
									</text>
								</g>
							);
						})}

					{/* Candlesticks */}
					{chartData.map((candle, index) => {
						const x = xScale(index);
						const openY = yScale(candle.open);
						const closeY = yScale(candle.close);
						const highY = yScale(candle.high);
						const lowY = yScale(candle.low);
						const isGreen = candle.close > candle.open;
						const bodyTop = Math.min(openY, closeY);
						const bodyHeight = Math.abs(closeY - openY);
						const color = isGreen ? '#10b981' : '#ef4444';

						return (
							<g key={index}>
								{/* High-Low line (wick) */}
								<line
									x1={x}
									y1={highY}
									x2={x}
									y2={lowY}
									stroke={color}
									strokeWidth={1}
								/>
								{/* Open-Close body */}
								<rect
									x={x - candleWidth / 2}
									y={bodyTop}
									width={candleWidth}
									height={Math.max(1, bodyHeight)}
									fill={isGreen ? color : 'none'}
									stroke={color}
									strokeWidth={1}
								/>
							</g>
						);
					})}
				</g>
			</svg>
		);
	};

	if (!selectedMarket) {
		return (
			<div className="h-full flex items-center justify-center bg-gray-900 rounded">
				<div className="text-center">
					<div className="text-gray-400 text-lg mb-2">📈</div>
					<div className="text-gray-300 font-medium">
						Select a market to view chart
					</div>
					<div className="text-gray-500 text-sm">
						Choose from the markets list to start trading
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="h-full flex flex-col bg-gray-900 rounded">
			{/* Chart Controls */}
			<div className="flex items-center justify-between p-4 border-b border-gray-800">
				<div className="flex items-center space-x-4">
					{/* Timeframe Selector */}
					<div className="flex items-center space-x-1">
						{timeframes.map((tf) => (
							<button
								key={tf.value}
								onClick={() => handleTimeframeChange(tf.value)}
								className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
									timeframe === tf.value
										? 'bg-purple-600 text-white'
										: 'text-gray-400 hover:text-white hover:bg-gray-800'
								}`}
							>
								{tf.label}
							</button>
						))}
					</div>

					{/* Chart Type Selector */}
					<div className="flex items-center space-x-1 ml-4">
						<button
							onClick={() => handleChartTypeChange('candlesticks')}
							className={`p-2 rounded transition-colors ${
								chartType === 'candlesticks'
									? 'bg-purple-600 text-white'
									: 'text-gray-400 hover:text-white hover:bg-gray-800'
							}`}
							title="Candlesticks"
						>
							<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
								<path d="M3 4h2v12H3V4zm4-2h2v16H7V2zm4 6h2v8h-2V8zm4-4h2v12h-2V4z" />
							</svg>
						</button>
						<button
							onClick={() => handleChartTypeChange('line')}
							className={`p-2 rounded transition-colors ${
								chartType === 'line'
									? 'bg-purple-600 text-white'
									: 'text-gray-400 hover:text-white hover:bg-gray-800'
							}`}
							title="Line Chart"
						>
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
									d="M7 12l3-3 3 3 4-4"
								/>
							</svg>
						</button>
					</div>
				</div>

				{/* Chart Tools */}
				<div className="flex items-center space-x-2">
					<button
						className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
						title="Indicators"
					>
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
								d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
							/>
						</svg>
					</button>
					<button
						className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
						title="Drawing Tools"
					>
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
								d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
							/>
						</svg>
					</button>
					<button
						className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
						title="Fullscreen"
					>
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
								d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
							/>
						</svg>
					</button>
				</div>
			</div>

			{/* Chart Container */}
			<div className="flex-1 relative overflow-hidden">
				<div className="w-full h-full flex items-center justify-center">
					{chartData.length > 0 ? (
						renderCandlestickChart()
					) : (
						<div className="text-center">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
							<div className="text-gray-400 text-sm">Loading chart data...</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
