'use client';

import Link from 'next/link';

export default function StakePage() {
	return (
		<div className="min-h-screen bg-black text-white">
			{/* Header */}
			<header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
							<span className="text-white font-bold text-lg">A</span>
						</div>
						<span className="text-white text-xl font-bold">Apex Protocol</span>
					</div>

					<div className="flex items-center space-x-6">
						<Link
							href="/"
							className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
						>
							Overview
						</Link>
						<Link
							href="/trade"
							className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
						>
							Trade
						</Link>
						<Link
							href="/earn"
							className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
						>
							Earn
						</Link>
						<Link
							href="/vaults"
							className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
						>
							Vaults
						</Link>
						<button className="text-white font-medium text-sm">
							🔥 Stake APEX
						</button>
					</div>

					{/* Apex Logo in Upper Right */}
					<div className="flex items-center space-x-2">
						<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
							<span className="text-white font-bold text-xl">A</span>
						</div>
						<span className="text-white font-bold text-xl">APEX</span>
					</div>
				</div>
			</header>

			{/* Content */}
			<div className="container mx-auto px-6 py-12">
				<div className="text-center mb-12">
					<h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-4">
						🔥 Stake APEX Tokens
					</h1>
					<p className="text-xl text-gray-300 max-w-3xl mx-auto">
						Stake APEX tokens to earn protocol fees, governance rights, and
						exclusive rewards.
					</p>
				</div>

				<div className="max-w-2xl mx-auto">
					{/* Staking Stats */}
					<div className="bg-gray-900 border border-gray-700 rounded-xl p-8 mb-8">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
							<div>
								<div className="text-3xl font-bold text-orange-400 mb-2">
									18.2%
								</div>
								<div className="text-gray-400">Current APY</div>
							</div>
							<div>
								<div className="text-3xl font-bold text-purple-400 mb-2">
									$45.2M
								</div>
								<div className="text-gray-400">Total Staked</div>
							</div>
							<div>
								<div className="text-3xl font-bold text-blue-400 mb-2">67%</div>
								<div className="text-gray-400">Staking Ratio</div>
							</div>
						</div>
					</div>

					{/* Staking Interface */}
					<div className="bg-gray-900 border border-gray-700 rounded-xl p-8">
						<h2 className="text-2xl font-bold mb-6 text-center">
							Stake Your APEX
						</h2>

						<div className="space-y-6">
							<div>
								<label className="block text-gray-400 text-sm mb-2">
									Amount to Stake
								</label>
								<div className="relative">
									<input
										type="number"
										placeholder="0.00"
										className="w-full bg-gray-800 text-white px-4 py-4 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none text-lg"
									/>
									<div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
										<span className="text-gray-400">APEX</span>
										<button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm">
											MAX
										</button>
									</div>
								</div>
								<div className="text-right mt-1">
									<span className="text-gray-400 text-sm">
										Balance: 0.00 APEX
									</span>
								</div>
							</div>

							<div className="bg-gray-800 rounded-lg p-4">
								<div className="flex justify-between items-center mb-2">
									<span className="text-gray-400">
										Estimated Rewards (Annual)
									</span>
									<span className="text-green-400 font-bold">0.00 APEX</span>
								</div>
								<div className="flex justify-between items-center mb-2">
									<span className="text-gray-400">Voting Power</span>
									<span className="text-blue-400 font-bold">0.00%</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-gray-400">Unstaking Period</span>
									<span className="text-yellow-400 font-bold">7 days</span>
								</div>
							</div>

							<button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-lg font-bold text-lg">
								Stake APEX Tokens
							</button>
						</div>
					</div>

					{/* Benefits */}
					<div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
							<div className="text-2xl mb-3">💰</div>
							<h3 className="text-lg font-bold mb-2">Protocol Fees</h3>
							<p className="text-gray-400 text-sm">
								Earn a share of all trading fees generated by the protocol.
							</p>
						</div>
						<div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
							<div className="text-2xl mb-3">🗳️</div>
							<h3 className="text-lg font-bold mb-2">Governance Rights</h3>
							<p className="text-gray-400 text-sm">
								Vote on protocol upgrades and parameter changes.
							</p>
						</div>
						<div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
							<div className="text-2xl mb-3">🎁</div>
							<h3 className="text-lg font-bold mb-2">Exclusive Rewards</h3>
							<p className="text-gray-400 text-sm">
								Access to airdrops and special staking bonuses.
							</p>
						</div>
						<div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
							<div className="text-2xl mb-3">⚡</div>
							<h3 className="text-lg font-bold mb-2">Fee Discounts</h3>
							<p className="text-gray-400 text-sm">
								Reduced trading fees based on staking tier.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
