'use client';

import React, { useState, useMemo } from 'react';
import { UIMarketData, OrderFormData } from '../types';
import { usePositions } from '../hooks/usePositions';

interface OrderFormProps {
	selectedMarket: UIMarketData | null;
	onSubmit: (orderData: OrderFormData) => Promise<void>;
}

export const OrderForm: React.FC<OrderFormProps> = ({
	selectedMarket,
	onSubmit,
}) => {
	const { getPositionByMarket } = usePositions();

	const [formData, setFormData] = useState<OrderFormData>({
		marketIndex: 0,
		orderType: 'market',
		side: 'buy',
		amount: '',
		price: '',
		stopPrice: '',
		reduceOnly: false,
		postOnly: false,
		ioc: false,
		timeInForce: 'GTC',
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Update market index when selected market changes
	React.useEffect(() => {
		if (selectedMarket) {
			setFormData((prev) => ({
				...prev,
				marketIndex: selectedMarket.marketIndex,
				marketType: selectedMarket.marketType,
			}));
		}
	}, [selectedMarket]);

	// Get current position for this market
	const currentPosition = useMemo(() => {
		if (!selectedMarket) return null;
		return getPositionByMarket(selectedMarket.marketIndex);
	}, [selectedMarket, getPositionByMarket]);

	// Calculate order value
	const orderValue = useMemo(() => {
		if (!formData.amount || !selectedMarket) return 0;

		const amount = parseFloat(formData.amount) || 0;
		const price =
			formData.orderType === 'market'
				? selectedMarket.lastPrice
				: parseFloat(formData.price || '') || selectedMarket.lastPrice;

		return amount * price;
	}, [formData.amount, formData.price, formData.orderType, selectedMarket]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedMarket) {
			setError('Please select a market');
			return;
		}

		if (!formData.amount || parseFloat(formData.amount) <= 0) {
			setError('Please enter a valid amount');
			return;
		}

		if (
			formData.orderType !== 'market' &&
			(!formData.price || parseFloat(formData.price) <= 0)
		) {
			setError('Please enter a valid price');
			return;
		}

		try {
			setIsSubmitting(true);
			setError(null);

			await onSubmit({
				...formData,
				marketType: selectedMarket.marketType,
				marketIndex: selectedMarket.marketIndex,
			} as OrderFormData);

			// Reset form on success
			setFormData((prev) => ({
				...prev,
				amount: '',
				price: '',
				stopPrice: '',
			}));
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to place order');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleInputChange =
		(field: keyof OrderFormData) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
			const value =
				e.target.type === 'checkbox'
					? (e.target as HTMLInputElement).checked
					: e.target.value;

			setFormData((prev) => ({ ...prev, [field]: value }));
		};

	if (!selectedMarket) {
		return (
			<div className="p-6 h-full flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 bg-dark-100 rounded-lg flex items-center justify-center mx-auto mb-4">
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
								d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
							/>
						</svg>
					</div>
					<h3 className="text-lg font-medium text-dark-500 mb-2">
						Select Market
					</h3>
					<p className="text-dark-400 text-sm">
						Choose a market to start placing orders.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full">
			{/* Header */}
			<div className="p-4 border-b border-dark-200">
				<h2 className="text-lg font-semibold text-dark-900 mb-2">
					Trade {selectedMarket.symbol}
				</h2>

				{/* Current Position */}
				{currentPosition && (
					<div className="text-sm bg-dark-50 rounded-lg p-3">
						<div className="flex items-center justify-between mb-1">
							<span className="text-dark-600">Position:</span>
							<span
								className={`font-medium ${
									currentPosition.side === 'long'
										? 'text-success-600'
										: currentPosition.side === 'short'
										? 'text-danger-600'
										: 'text-dark-600'
								}`}
							>
								{currentPosition.side.toUpperCase()}{' '}
								{currentPosition.size.toFixed(4)}
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-dark-600">PnL:</span>
							<span
								className={`font-medium ${
									currentPosition.unrealizedPnl >= 0
										? 'text-success-600'
										: 'text-danger-600'
								}`}
							>
								{currentPosition.unrealizedPnl >= 0 ? '+' : ''}$
								{currentPosition.unrealizedPnl.toFixed(2)}
							</span>
						</div>
					</div>
				)}
			</div>

			{/* Order Form */}
			<form onSubmit={handleSubmit} className="flex-1 p-4 space-y-4">
				{/* Buy/Sell Tabs */}
				<div className="grid grid-cols-2 gap-2">
					<button
						type="button"
						onClick={() => setFormData((prev) => ({ ...prev, side: 'buy' }))}
						className={`py-2 px-4 rounded-lg font-medium transition-colors ${
							formData.side === 'buy'
								? 'bg-success-600 text-white'
								: 'bg-dark-100 text-dark-600 hover:bg-dark-200'
						}`}
					>
						Buy
					</button>
					<button
						type="button"
						onClick={() => setFormData((prev) => ({ ...prev, side: 'sell' }))}
						className={`py-2 px-4 rounded-lg font-medium transition-colors ${
							formData.side === 'sell'
								? 'bg-danger-600 text-white'
								: 'bg-dark-100 text-dark-600 hover:bg-dark-200'
						}`}
					>
						Sell
					</button>
				</div>

				{/* Order Type */}
				<div>
					<label className="block text-sm font-medium text-dark-700 mb-2">
						Order Type
					</label>
					<select
						value={formData.orderType}
						onChange={handleInputChange('orderType')}
						className="input-field"
					>
						<option value="market">Market</option>
						<option value="limit">Limit</option>
						<option value="stopMarket">Stop Market</option>
						<option value="stopLimit">Stop Limit</option>
					</select>
				</div>

				{/* Amount */}
				<div>
					<label className="block text-sm font-medium text-dark-700 mb-2">
						Amount
					</label>
					<div className="relative">
						<input
							type="number"
							step="0.0001"
							placeholder="0.0000"
							value={formData.amount}
							onChange={handleInputChange('amount')}
							className="input-field pr-12"
						/>
						<div className="absolute inset-y-0 right-0 flex items-center pr-3">
							<span className="text-sm text-dark-500">
								{selectedMarket.baseAssetSymbol}
							</span>
						</div>
					</div>
				</div>

				{/* Price (for limit orders) */}
				{formData.orderType !== 'market' &&
					formData.orderType !== 'stopMarket' && (
						<div>
							<label className="block text-sm font-medium text-dark-700 mb-2">
								Price
							</label>
							<div className="relative">
								<input
									type="number"
									step="0.01"
									placeholder={selectedMarket.lastPrice.toFixed(2)}
									value={formData.price}
									onChange={handleInputChange('price')}
									className="input-field pr-12"
								/>
								<div className="absolute inset-y-0 right-0 flex items-center pr-3">
									<span className="text-sm text-dark-500">USD</span>
								</div>
							</div>
						</div>
					)}

				{/* Stop Price (for stop orders) */}
				{(formData.orderType === 'stopMarket' ||
					formData.orderType === 'stopLimit') && (
					<div>
						<label className="block text-sm font-medium text-dark-700 mb-2">
							Stop Price
						</label>
						<div className="relative">
							<input
								type="number"
								step="0.01"
								placeholder={selectedMarket.lastPrice.toFixed(2)}
								value={formData.stopPrice}
								onChange={handleInputChange('stopPrice')}
								className="input-field pr-12"
							/>
							<div className="absolute inset-y-0 right-0 flex items-center pr-3">
								<span className="text-sm text-dark-500">USD</span>
							</div>
						</div>
					</div>
				)}

				{/* Order Options */}
				<div className="space-y-2">
					<label className="flex items-center gap-2">
						<input
							type="checkbox"
							checked={formData.reduceOnly}
							onChange={handleInputChange('reduceOnly')}
							className="rounded border-dark-300"
						/>
						<span className="text-sm text-dark-700">Reduce Only</span>
					</label>

					{formData.orderType === 'limit' && (
						<label className="flex items-center gap-2">
							<input
								type="checkbox"
								checked={formData.postOnly}
								onChange={handleInputChange('postOnly')}
								className="rounded border-dark-300"
							/>
							<span className="text-sm text-dark-700">Post Only</span>
						</label>
					)}

					<label className="flex items-center gap-2">
						<input
							type="checkbox"
							checked={formData.ioc}
							onChange={handleInputChange('ioc')}
							className="rounded border-dark-300"
						/>
						<span className="text-sm text-dark-700">Immediate or Cancel</span>
					</label>
				</div>

				{/* Order Summary */}
				{formData.amount && (
					<div className="bg-dark-50 rounded-lg p-3 text-sm">
						<div className="flex justify-between mb-1">
							<span className="text-dark-600">Order Value:</span>
							<span className="font-medium text-dark-900">
								${orderValue.toFixed(2)}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-dark-600">Est. Fees:</span>
							<span className="font-medium text-dark-900">
								${(orderValue * 0.001).toFixed(2)}
							</span>
						</div>
					</div>
				)}

				{/* Error Message */}
				{error && (
					<div className="p-3 bg-danger-50 text-danger-600 rounded-lg text-sm">
						{error}
					</div>
				)}

				{/* Submit Button */}
				<button
					type="submit"
					disabled={isSubmitting || !formData.amount}
					className={`w-full py-3 rounded-lg font-medium transition-colors ${
						formData.side === 'buy' ? 'btn-success' : 'btn-danger'
					} disabled:opacity-50 disabled:cursor-not-allowed`}
				>
					{isSubmitting
						? 'Placing Order...'
						: `${formData.side.toUpperCase()} ${selectedMarket.symbol}`}
				</button>
			</form>
		</div>
	);
};
