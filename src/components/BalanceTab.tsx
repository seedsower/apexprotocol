'use client';

import React from 'react';
import { useProductionApex } from '../contexts/ProductionApexProvider';
import { useWallet } from '@solana/wallet-adapter-react';

export function BalanceTab() {
	const { connected } = useWallet();
	const { user, spotMarkets, isInitialized } = useProductionApex();

	if (!connected) {
		return (
			<div className="p-4 text-center text-gray-400">
				Connect your wallet to view balances
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

	return (
		<div className="p-4">
			<h3 className="text-lg font-semibold text-white mb-4">
				Account Balances
			</h3>

			{/* User Account Info */}
			<div className="bg-gray-800 rounded-lg p-4 mb-4">
				<div className="grid grid-cols-2 gap-4">
					<div>
						<div className="text-sm text-gray-400">Total Collateral</div>
						<div className="text-xl font-bold text-green-400">
							${user.totalCollateral?.toFixed(2) || '0.00'}
						</div>
					</div>
					<div>
						<div className="text-sm text-gray-400">Available Balance</div>
						<div className="text-xl font-bold text-blue-400">
							${user.availableBalance?.toFixed(2) || '0.00'}
						</div>
					</div>
				</div>
			</div>

			{/* Spot Market Balances */}
			<div className="space-y-2">
				<h4 className="text-md font-medium text-gray-300 mb-2">
					Spot Balances
				</h4>
				{spotMarkets.length > 0 ? (
					spotMarkets.map((market, _index) => {
						const balance = user.spotBalances?.[market.marketIndex] || 0;
						return (
							<div
								key={market.marketIndex}
								className="bg-gray-800 rounded-lg p-3 flex justify-between items-center"
							>
								<div className="flex items-center space-x-3">
									<div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
										<span className="text-xs font-bold text-white">
											{market.name.substring(0, 2)}
										</span>
									</div>
									<div>
										<div className="text-white font-medium">{market.name}</div>
										<div className="text-xs text-gray-400">Spot Market</div>
									</div>
								</div>
								<div className="text-right">
									<div className="text-white font-medium">
										{balance.toFixed(6)}
									</div>
									<div className="text-xs text-gray-400">
										${(balance * 1).toFixed(2)}{' '}
										{/* Price will be updated with real data */}
									</div>
								</div>
							</div>
						);
					})
				) : (
					<div className="text-center text-gray-400 py-4">
						No spot markets available
					</div>
				)}
			</div>

			{/* USDC Balance */}
			<div className="mt-4">
				<div className="bg-gray-800 rounded-lg p-3 flex justify-between items-center">
					<div className="flex items-center space-x-3">
						<div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
							<span className="text-xs font-bold text-white">USDC</span>
						</div>
						<div>
							<div className="text-white font-medium">USD Coin</div>
							<div className="text-xs text-gray-400">Quote Currency</div>
						</div>
					</div>
					<div className="text-right">
						<div className="text-white font-medium">
							{user.usdcBalance?.toFixed(2) || '0.00'}
						</div>
						<div className="text-xs text-gray-400">
							${user.usdcBalance?.toFixed(2) || '0.00'}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
