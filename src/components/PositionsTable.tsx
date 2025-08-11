'use client';

import React from 'react';
import { UIPosition } from '../types';

interface PositionsTableProps {
	positions: UIPosition[];
}

export const PositionsTable: React.FC<PositionsTableProps> = ({
	positions,
}) => {
	const formatNumber = (num: number, decimals = 2) => {
		return num.toLocaleString(undefined, {
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals,
		});
	};

	const formatPnl = (pnl: number) => {
		const isPositive = pnl >= 0;
		return (
			<span
				className={`font-medium ${
					isPositive ? 'text-success-600' : 'text-danger-600'
				}`}
			>
				{isPositive ? '+' : ''}${formatNumber(Math.abs(pnl))}
			</span>
		);
	};

	return (
		<div className="flex flex-col h-full">
			{/* Header */}
			<div className="p-4 border-b border-dark-200">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold text-dark-900">Positions</h2>
					<div className="flex items-center gap-4 text-sm">
						<div className="text-dark-500">
							Total PnL:{' '}
							{formatPnl(
								positions.reduce((sum, pos) => sum + pos.unrealizedPnl, 0)
							)}
						</div>
						<div className="text-dark-500">Count: {positions.length}</div>
					</div>
				</div>
			</div>

			{/* Table */}
			<div className="flex-1 overflow-y-auto">
				{positions.length === 0 ? (
					<div className="flex items-center justify-center h-full">
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
										d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-medium text-dark-500 mb-2">
								No Positions
							</h3>
							<p className="text-dark-400 text-sm">
								Your open positions will appear here once you start trading.
							</p>
						</div>
					</div>
				) : (
					<table className="w-full">
						<thead className="bg-dark-50">
							<tr>
								<th className="table-header text-left">Market</th>
								<th className="table-header text-right">Side</th>
								<th className="table-header text-right">Size</th>
								<th className="table-header text-right">Entry Price</th>
								<th className="table-header text-right">Mark Price</th>
								<th className="table-header text-right">PnL</th>
								<th className="table-header text-right">Value</th>
								{positions.some((p) => p.liquidationPrice) && (
									<th className="table-header text-right">Liq. Price</th>
								)}
							</tr>
						</thead>
						<tbody>
							{positions.map((position, index) => (
								<tr
									key={`${position.marketType}-${position.marketIndex}`}
									className={`border-b border-dark-100 hover:bg-dark-25 ${
										index % 2 === 0 ? 'bg-white' : 'bg-dark-25'
									}`}
								>
									<td className="table-cell">
										<div className="flex items-center gap-2">
											<span className="font-medium text-dark-900">
												{position.symbol}
											</span>
											<span
												className={`text-xs px-2 py-1 rounded ${
													position.marketType === 'perp'
														? 'bg-primary-100 text-primary-700'
														: 'bg-success-100 text-success-700'
												}`}
											>
												{position.marketType.toUpperCase()}
											</span>
										</div>
									</td>

									<td className="table-cell text-right">
										{position.side !== 'none' && (
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
													position.side === 'long'
														? 'bg-success-100 text-success-800'
														: 'bg-danger-100 text-danger-800'
												}`}
											>
												{position.side.toUpperCase()}
											</span>
										)}
									</td>

									<td className="table-cell text-right font-mono">
										{formatNumber(position.size, 4)}
									</td>

									<td className="table-cell text-right font-mono">
										{position.entryPrice > 0
											? `$${formatNumber(position.entryPrice)}`
											: '-'}
									</td>

									<td className="table-cell text-right font-mono">
										${formatNumber(position.markPrice)}
									</td>

									<td className="table-cell text-right">
										<div className="flex flex-col">
											{formatPnl(position.unrealizedPnl)}
											{position.unrealizedPnlPercent !== 0 && (
												<span
													className={`text-xs ${
														position.unrealizedPnlPercent >= 0
															? 'text-success-600'
															: 'text-danger-600'
													}`}
												>
													({position.unrealizedPnlPercent >= 0 ? '+' : ''}
													{position.unrealizedPnlPercent.toFixed(2)}%)
												</span>
											)}
										</div>
									</td>

									<td className="table-cell text-right font-mono">
										${formatNumber(position.notionalValue)}
									</td>

									{positions.some((p) => p.liquidationPrice) && (
										<td className="table-cell text-right font-mono">
											{position.liquidationPrice &&
											position.liquidationPrice > 0
												? `$${formatNumber(position.liquidationPrice)}`
												: '-'}
										</td>
									)}
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
};
