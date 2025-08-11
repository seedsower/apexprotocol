'use client';

import React, { useState, useEffect } from 'react';
import { UIMarketData, OrderFormData } from '../types';

interface EnhancedOrderFormProps {
	selectedMarket: UIMarketData | null;
	onSubmit: (orderData: OrderFormData) => void;
	onPriceFromOrderBook?: number;
}

export function EnhancedOrderForm({
	selectedMarket,
	onSubmit,
	onPriceFromOrderBook,
}: EnhancedOrderFormProps) {
	const [orderType, setOrderType] = useState<
		'market' | 'limit' | 'stopMarket' | 'stopLimit'
	>('market');
	const [side, setSide] = useState<'buy' | 'sell'>('buy');
	const [amount, setAmount] = useState('');
	const [price, setPrice] = useState('');
	const [stopPrice, setStopPrice] = useState('');
	const [leverage, setLeverage] = useState(1);
	const [reduceOnly, setReduceOnly] = useState(false);
	const [postOnly, setPostOnly] = useState(false);
	const [timeInForce, setTimeInForce] = useState<'GTC' | 'IOC' | 'FOK'>('GTC');
	const [slippage, setSlippage] = useState(0.5);
	const [showAdvanced, setShowAdvanced] = useState(false);

	// Position sizing helpers
	const [sizePercent, setSizePercent] = useState(0);
	const [estimatedCost, setEstimatedCost] = useState(0);
	const [estimatedFees, setEstimatedFees] = useState(0);

	// Mock account balance for calculations
	const accountBalance = 10000; // USDC
	const maxLeverage = selectedMarket?.marketType === 'perp' ? 10 : 1;

	// Update price from order book clicks
	useEffect(() => {
		if (onPriceFromOrderBook && orderType !== 'market') {
			setPrice(onPriceFromOrderBook.toString());
		}
	}, [onPriceFromOrderBook, orderType]);

	// Calculate position size based on percentage
	useEffect(() => {
		if (sizePercent > 0 && selectedMarket) {
			const availableBalance = accountBalance * leverage;
			const targetCost = (availableBalance * sizePercent) / 100;
			const currentPrice = price ? parseFloat(price) : selectedMarket.lastPrice;
			const calculatedAmount = targetCost / currentPrice;
			setAmount(calculatedAmount.toFixed(6));
		}
	}, [sizePercent, leverage, price, selectedMarket, accountBalance]);

	// Calculate estimated cost and fees
	useEffect(() => {
		if (amount && selectedMarket) {
			const amountNum = parseFloat(amount);
			const currentPrice = price ? parseFloat(price) : selectedMarket.lastPrice;
			const cost = amountNum * currentPrice;
			const fees = cost * 0.001; // 0.1% fee

			setEstimatedCost(cost);
			setEstimatedFees(fees);
		} else {
			setEstimatedCost(0);
			setEstimatedFees(0);
		}
	}, [amount, price, selectedMarket]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedMarket) return;

		const orderData: OrderFormData = {
			marketIndex: selectedMarket.marketIndex,
			marketType: selectedMarket.marketType,
			orderType,
			side,
			amount,
			price: orderType !== 'market' ? price : undefined,
			stopPrice:
				orderType === 'stopMarket' || orderType === 'stopLimit'
					? stopPrice
					: undefined,
			reduceOnly,
			postOnly,
			ioc: timeInForce === 'IOC',
			timeInForce,
		};

		onSubmit(orderData);
	};

	const handlePercentageClick = (percent: number) => {
		setSizePercent(percent);
	};

	// const leverageOptions = Array.from({ length: maxLeverage }, (_, i) => i + 1);
	const slippageOptions = [0.1, 0.5, 1.0, 2.0];

	if (!selectedMarket) {
		return (
			<div className="h-full flex items-center justify-center bg-gray-900 rounded">
				<div className="text-center">
					<div className="text-gray-400 text-lg mb-2">💰</div>
					<div className="text-gray-300 font-medium">Place Order</div>
					<div className="text-gray-500 text-sm">
						Select a market to start trading
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="h-full flex flex-col bg-gray-900 rounded">
			{/* Header */}
			<div className="p-4 border-b border-gray-800">
				<h3 className="text-white font-medium mb-3">Place Order</h3>

				{/* Buy/Sell Toggle */}
				<div className="flex bg-gray-800 rounded p-1 mb-4">
					<button
						onClick={() => setSide('buy')}
						className={`flex-1 py-2 px-4 text-sm font-medium rounded transition-colors ${
							side === 'buy'
								? 'bg-green-600 text-white'
								: 'text-gray-400 hover:text-white'
						}`}
					>
						Buy / Long
					</button>
					<button
						onClick={() => setSide('sell')}
						className={`flex-1 py-2 px-4 text-sm font-medium rounded transition-colors ${
							side === 'sell'
								? 'bg-red-600 text-white'
								: 'text-gray-400 hover:text-white'
						}`}
					>
						Sell / Short
					</button>
				</div>

				{/* Order Type Selector */}
				<div className="flex bg-gray-800 rounded p-1 mb-4">
					{['market', 'limit', 'stopMarket', 'stopLimit'].map((type) => (
						<button
							key={type}
							onClick={() => setOrderType(type as any)}
							className={`flex-1 py-1 px-2 text-xs font-medium rounded transition-colors ${
								orderType === type
									? 'bg-purple-600 text-white'
									: 'text-gray-400 hover:text-white'
							}`}
						>
							{type === 'stopLimit'
								? 'Stop Limit'
								: type === 'stopMarket'
								? 'Stop Market'
								: type.charAt(0).toUpperCase() + type.slice(1)}
						</button>
					))}
				</div>
			</div>

			{/* Order Form */}
			<div className="flex-1 overflow-y-auto p-4">
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Leverage Slider (for perp markets) */}
					{selectedMarket.marketType === 'perp' && (
						<div>
							<div className="flex justify-between items-center mb-2">
								<label className="text-gray-400 text-sm">Leverage</label>
								<span className="text-white text-sm">{leverage}x</span>
							</div>
							<div className="flex items-center space-x-2">
								<input
									type="range"
									min="1"
									max={maxLeverage}
									value={leverage}
									onChange={(e) => setLeverage(parseInt(e.target.value))}
									className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
								/>
								<div className="flex space-x-1">
									{[1, 5, 10].map((lev) => (
										<button
											key={lev}
											type="button"
											onClick={() => setLeverage(lev)}
											className={`px-2 py-1 text-xs rounded ${
												leverage === lev
													? 'bg-purple-600 text-white'
													: 'bg-gray-700 text-gray-400 hover:text-white'
											}`}
										>
											{lev}x
										</button>
									))}
								</div>
							</div>
						</div>
					)}

					{/* Price Input (for limit orders) */}
					{orderType !== 'market' && (
						<div>
							<label className="block text-gray-400 text-sm mb-2">
								{orderType === 'stopMarket' ? 'Stop Price' : 'Limit Price'}
							</label>
							<div className="relative">
								<input
									type="number"
									value={price}
									onChange={(e) => setPrice(e.target.value)}
									placeholder={selectedMarket.lastPrice.toString()}
									className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
									step="0.01"
								/>
								<div className="absolute right-3 top-2 text-gray-400 text-sm">
									{selectedMarket.quoteAssetSymbol || 'USDC'}
								</div>
							</div>
						</div>
					)}

					{/* Stop Price (for stop limit orders) */}
					{orderType === 'stopLimit' && (
						<div>
							<label className="block text-gray-400 text-sm mb-2">
								Stop Price
							</label>
							<div className="relative">
								<input
									type="number"
									value={stopPrice}
									onChange={(e) => setStopPrice(e.target.value)}
									placeholder={selectedMarket.lastPrice.toString()}
									className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
									step="0.01"
								/>
								<div className="absolute right-3 top-2 text-gray-400 text-sm">
									{selectedMarket.quoteAssetSymbol || 'USDC'}
								</div>
							</div>
						</div>
					)}

					{/* Amount Input */}
					<div>
						<label className="block text-gray-400 text-sm mb-2">Size</label>
						<div className="relative">
							<input
								type="number"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								placeholder="0.00"
								className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
								step="0.000001"
								required
							/>
							<div className="absolute right-3 top-2 text-gray-400 text-sm">
								{selectedMarket.baseAssetSymbol}
							</div>
						</div>
					</div>

					{/* Position Size Buttons */}
					<div>
						<div className="text-gray-400 text-sm mb-2">Position Size</div>
						<div className="grid grid-cols-4 gap-2">
							{[25, 50, 75, 100].map((percent) => (
								<button
									key={percent}
									type="button"
									onClick={() => handlePercentageClick(percent)}
									className={`py-2 text-xs font-medium rounded transition-colors ${
										sizePercent === percent
											? 'bg-purple-600 text-white'
											: 'bg-gray-700 text-gray-400 hover:text-white hover:bg-gray-600'
									}`}
								>
									{percent}%
								</button>
							))}
						</div>
					</div>

					{/* Advanced Options Toggle */}
					<button
						type="button"
						onClick={() => setShowAdvanced(!showAdvanced)}
						className="flex items-center justify-between w-full py-2 text-gray-400 hover:text-white transition-colors"
					>
						<span className="text-sm">Advanced Options</span>
						<svg
							className={`w-4 h-4 transition-transform ${
								showAdvanced ? 'rotate-180' : ''
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

					{/* Advanced Options */}
					{showAdvanced && (
						<div className="space-y-4 pt-2 border-t border-gray-800">
							{/* Slippage */}
							<div>
								<div className="flex justify-between items-center mb-2">
									<label className="text-gray-400 text-sm">
										Slippage Tolerance
									</label>
									<span className="text-white text-sm">{slippage}%</span>
								</div>
								<div className="flex space-x-2">
									{slippageOptions.map((slip) => (
										<button
											key={slip}
											type="button"
											onClick={() => setSlippage(slip)}
											className={`flex-1 py-1 text-xs rounded ${
												slippage === slip
													? 'bg-purple-600 text-white'
													: 'bg-gray-700 text-gray-400 hover:text-white'
											}`}
										>
											{slip}%
										</button>
									))}
								</div>
							</div>

							{/* Time in Force */}
							<div>
								<label className="block text-gray-400 text-sm mb-2">
									Time in Force
								</label>
								<select
									value={timeInForce}
									onChange={(e) => setTimeInForce(e.target.value as any)}
									className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
								>
									<option value="GTC">Good Till Cancelled</option>
									<option value="IOC">Immediate or Cancel</option>
									<option value="FOK">Fill or Kill</option>
								</select>
							</div>

							{/* Order Options */}
							<div className="space-y-2">
								<label className="flex items-center">
									<input
										type="checkbox"
										checked={reduceOnly}
										onChange={(e) => setReduceOnly(e.target.checked)}
										className="mr-2 rounded"
									/>
									<span className="text-gray-400 text-sm">Reduce Only</span>
								</label>
								<label className="flex items-center">
									<input
										type="checkbox"
										checked={postOnly}
										onChange={(e) => setPostOnly(e.target.checked)}
										className="mr-2 rounded"
									/>
									<span className="text-gray-400 text-sm">Post Only</span>
								</label>
							</div>
						</div>
					)}

					{/* Order Summary */}
					{estimatedCost > 0 && (
						<div className="bg-gray-800 rounded p-3 space-y-2">
							<div className="text-gray-400 text-sm">Order Summary</div>
							<div className="flex justify-between text-sm">
								<span className="text-gray-400">Est. Cost:</span>
								<span className="text-white">${estimatedCost.toFixed(2)}</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-gray-400">Est. Fees:</span>
								<span className="text-white">${estimatedFees.toFixed(2)}</span>
							</div>
							<div className="flex justify-between text-sm border-t border-gray-700 pt-2">
								<span className="text-gray-400">Total:</span>
								<span className="text-white font-medium">
									${(estimatedCost + estimatedFees).toFixed(2)}
								</span>
							</div>
						</div>
					)}

					{/* Submit Button */}
					<button
						type="submit"
						className={`w-full py-3 rounded font-medium transition-colors ${
							side === 'buy'
								? 'bg-green-600 hover:bg-green-700 text-white'
								: 'bg-red-600 hover:bg-red-700 text-white'
						}`}
					>
						{side === 'buy' ? 'Buy' : 'Sell'} {selectedMarket.baseAssetSymbol}
					</button>
				</form>
			</div>
		</div>
	);
}
