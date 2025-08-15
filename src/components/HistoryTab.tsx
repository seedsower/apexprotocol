'use client';

import React from 'react';
import { useProductionApex } from '../contexts/ProductionApexProvider';
import { useWallet } from '@solana/wallet-adapter-react';

export function HistoryTab() {
	const { connected } = useWallet();
	const { user, spotMarkets, isInitialized } = useProductionApex();

	if (!connected) {
		return (
			<div className="p-4 text-center text-gray-400">
				Connect your wallet to view history
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

	// Get transaction history from user data
	const transactions = user.transactionHistory || [];

	return (
		<div className="p-4">
			<h3 className="text-lg font-semibold text-white mb-4">
				Transaction History
			</h3>

			{transactions.length > 0 ? (
				<div className="space-y-2">
					{transactions.map((tx: any, index: number) => {
						const market = spotMarkets.find(
							(m) => m.marketIndex === tx.marketIndex
						);
						const getTypeColor = (type: string) => {
							switch (type) {
								case 'deposit':
									return 'text-green-400';
								case 'withdraw':
									return 'text-yellow-400';
								case 'trade':
									return 'text-blue-400';
								default:
									return 'text-gray-400';
							}
						};

						return (
							<div key={index} className="bg-gray-800 rounded-lg p-4">
								<div className="flex justify-between items-start mb-2">
									<div>
										<div className="text-white font-medium">
											{tx.type?.toUpperCase() || 'TRANSACTION'}
										</div>
										<div className="text-xs text-gray-400">
											{market?.name || `Market ${tx.marketIndex}`}
										</div>
									</div>
									<div
										className={`text-sm font-medium ${getTypeColor(
											tx.type || ''
										)}`}
									>
										{tx.type === 'deposit' && '+'}
										{tx.type === 'withdraw' && '-'}
										{tx.amount?.toFixed(6) || '0.000000'}
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4 text-sm">
									<div>
										<div className="text-gray-400">Price</div>
										<div className="text-white">
											${tx.price?.toFixed(4) || '0.0000'}
										</div>
									</div>
									<div>
										<div className="text-gray-400">Total</div>
										<div className="text-white">
											${((tx.amount || 0) * (tx.price || 0)).toFixed(2)}
										</div>
									</div>
								</div>

								<div className="mt-3 flex justify-between items-center">
									<div className="text-xs text-gray-400">
										{tx.timestamp
											? new Date(tx.timestamp).toLocaleString()
											: 'Unknown time'}
									</div>
									{tx.signature && (
										<a
											href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-400 hover:text-blue-300 text-xs"
										>
											View on Explorer
										</a>
									)}
								</div>
							</div>
						);
					})}
				</div>
			) : (
				<div className="text-center text-gray-400 py-8">
					<div className="text-4xl mb-2">📜</div>
					<div className="text-lg mb-1">No Transaction History</div>
					<div className="text-sm">
						Your deposits and trades will appear here
					</div>
				</div>
			)}
		</div>
	);
}
