'use client';

import React from 'react';
import { useProductionApex } from '../contexts/ProductionApexProvider';
import { useWallet } from '@solana/wallet-adapter-react';

export function OrdersTab() {
	const { connected } = useWallet();
	const { user, spotMarkets, isInitialized } = useProductionApex();

	if (!connected) {
		return (
			<div className="p-4 text-center text-gray-400">
				Connect your wallet to view orders
			</div>
		);
	}

	if (!isInitialized) {
		return (
			<div className="p-4 text-center text-gray-400">
				Initializing Apex Protocol...
			</div>
		);
	}

	if (!user) {
		return (
			<div className="p-4 text-center text-gray-400">
				No user account found. Make a deposit to create your account.
			</div>
		);
	}

	// Get open orders from user data
	const openOrders =
		user.orders?.filter((order: any) => order.status === 'open') || [];

	return (
		<div className="p-4">
			<h3 className="text-lg font-semibold text-white mb-4">Open Orders</h3>

			{openOrders.length > 0 ? (
				<div className="space-y-2">
					{openOrders.map((order: any, index: number) => {
						const market = spotMarkets.find(
							(m) => m.marketIndex === order.marketIndex
						);
						const isBuy = order.side === 'buy';

						return (
							<div key={index} className="bg-gray-800 rounded-lg p-4">
								<div className="flex justify-between items-start mb-2">
									<div>
										<div className="text-white font-medium">
											{market?.name || `Market ${order.marketIndex}`}
										</div>
										<div className="text-xs text-gray-400">
											{order.orderType || 'Limit'} Order
										</div>
									</div>
									<div
										className={`px-2 py-1 rounded text-xs font-medium ${
											isBuy
												? 'bg-green-900 text-green-300'
												: 'bg-red-900 text-red-300'
										}`}
									>
										{isBuy ? 'BUY' : 'SELL'}
									</div>
								</div>

								<div className="grid grid-cols-3 gap-4 text-sm">
									<div>
										<div className="text-gray-400">Amount</div>
										<div className="text-white font-medium">
											{order.amount?.toFixed(6) || '0.000000'}
										</div>
									</div>
									<div>
										<div className="text-gray-400">Price</div>
										<div className="text-white font-medium">
											${order.price?.toFixed(4) || '0.0000'}
										</div>
									</div>
									<div>
										<div className="text-gray-400">Total</div>
										<div className="text-white font-medium">
											${((order.amount || 0) * (order.price || 0)).toFixed(2)}
										</div>
									</div>
								</div>

								<div className="mt-3 flex justify-between items-center">
									<div className="text-xs text-gray-400">
										Created:{' '}
										{order.timestamp
											? new Date(order.timestamp).toLocaleString()
											: 'Unknown'}
									</div>
									<button className="text-red-400 hover:text-red-300 text-xs font-medium">
										Cancel
									</button>
								</div>
							</div>
						);
					})}
				</div>
			) : (
				<div className="text-center text-gray-400 py-8">
					<div className="text-4xl mb-2">📋</div>
					<div className="text-lg mb-1">No Open Orders</div>
					<div className="text-sm">Place a limit order to see it here</div>
				</div>
			)}
		</div>
	);
}
