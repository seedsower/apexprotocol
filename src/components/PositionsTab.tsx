'use client';

import React from 'react';
import { useProductionApex } from '../contexts/ProductionApexProvider';
import { useWallet } from '@solana/wallet-adapter-react';

export function PositionsTab() {
	const { connected } = useWallet();
	const { user, spotMarkets, isInitialized } = useProductionApex();

	if (!connected) {
		return (
			<div className="p-4 text-center text-gray-400">
				Connect your wallet to view positions
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

	// Get active positions from user data
	const activePositions =
		user.positions?.filter((pos: any) => pos.size !== 0) || [];

	return (
		<div className="p-4">
			<h3 className="text-lg font-semibold text-white mb-4">Open Positions</h3>

			{activePositions.length > 0 ? (
				<div className="space-y-2">
					{activePositions.map((position: any, index: number) => {
						const market = spotMarkets.find(
							(m) => m.marketIndex === position.marketIndex
						);
						const isLong = position.size > 0;
						const pnl = position.unrealizedPnl || 0;
						const pnlColor = pnl >= 0 ? 'text-green-400' : 'text-red-400';

						return (
							<div key={index} className="bg-gray-800 rounded-lg p-4">
								<div className="flex justify-between items-start mb-2">
									<div>
										<div className="text-white font-medium">
											{market?.name || `Market ${position.marketIndex}`}
										</div>
										<div className="text-xs text-gray-400">
											{isLong ? 'LONG' : 'SHORT'} • Spot Position
										</div>
									</div>
									<div
										className={`px-2 py-1 rounded text-xs font-medium ${
											isLong
												? 'bg-green-900 text-green-300'
												: 'bg-red-900 text-red-300'
										}`}
									>
										{isLong ? 'LONG' : 'SHORT'}
									</div>
								</div>

								<div className="grid grid-cols-3 gap-4 text-sm">
									<div>
										<div className="text-gray-400">Size</div>
										<div className="text-white font-medium">
											{Math.abs(position.size).toFixed(6)}
										</div>
									</div>
									<div>
										<div className="text-gray-400">Entry Price</div>
										<div className="text-white font-medium">
											${position.entryPrice?.toFixed(4) || '0.0000'}
										</div>
									</div>
									<div>
										<div className="text-gray-400">PnL</div>
										<div className={`font-medium ${pnlColor}`}>
											${pnl.toFixed(2)}
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			) : (
				<div className="text-center text-gray-400 py-8">
					<div className="text-4xl mb-2">📊</div>
					<div className="text-lg mb-1">No Open Positions</div>
					<div className="text-sm">
						Place your first trade to see positions here
					</div>
				</div>
			)}
		</div>
	);
}
