'use client';

import Link from 'next/link';

export default function VaultsPage() {
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
						<button className="text-white font-medium text-sm">Vaults</button>
						<Link
							href="/stake"
							className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
						>
							🔥 Stake APEX
						</Link>
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
					<h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
						Apex Vaults
						<span className="bg-orange-500 text-white text-lg px-3 py-1 rounded font-bold ml-4">
							Hot
						</span>
					</h1>
					<p className="text-xl text-gray-300 max-w-3xl mx-auto">
						Automated yield strategies for commodity markets. Set and forget
						while earning optimized returns.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
					{/* Commodity Yield Vault */}
					<div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-xl font-bold">Commodity Yield Vault</h3>
							<span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">
								ACTIVE
							</span>
						</div>
						<div className="text-3xl font-bold text-green-400 mb-2">
							24.7% APY
						</div>
						<p className="text-gray-400 mb-4">
							Automated strategy across WTI, Gold, and Silver markets with
							dynamic rebalancing.
						</p>
						<div className="space-y-2 mb-6">
							<div className="flex justify-between text-sm">
								<span className="text-gray-400">TVL:</span>
								<span className="text-white">$12.4M</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-gray-400">Strategy:</span>
								<span className="text-white">Delta Neutral</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-gray-400">Risk Level:</span>
								<span className="text-yellow-400">Medium</span>
							</div>
						</div>
						<button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium">
							Deposit USDC
						</button>
					</div>

					{/* Energy Futures Vault */}
					<div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-xl font-bold">Energy Futures Vault</h3>
							<span className="bg-orange-500 text-white text-xs px-2 py-1 rounded font-bold">
								HOT
							</span>
						</div>
						<div className="text-3xl font-bold text-orange-400 mb-2">
							31.2% APY
						</div>
						<p className="text-gray-400 mb-4">
							High-yield strategy focused on WTI and Natural Gas with momentum
							trading.
						</p>
						<div className="space-y-2 mb-6">
							<div className="flex justify-between text-sm">
								<span className="text-gray-400">TVL:</span>
								<span className="text-white">$8.9M</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-gray-400">Strategy:</span>
								<span className="text-white">Momentum</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-gray-400">Risk Level:</span>
								<span className="text-red-400">High</span>
							</div>
						</div>
						<button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium">
							Deposit USDC
						</button>
					</div>
				</div>

				{/* Coming Soon */}
				<div className="mt-16 text-center">
					<h2 className="text-3xl font-bold mb-8">Coming Soon</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
						<div className="bg-gray-900 border border-gray-700 rounded-xl p-6 opacity-60">
							<h3 className="text-lg font-bold mb-2">Agriculture Vault</h3>
							<p className="text-gray-400 text-sm">
								Wheat, Corn, and Soy strategies
							</p>
						</div>
						<div className="bg-gray-900 border border-gray-700 rounded-xl p-6 opacity-60">
							<h3 className="text-lg font-bold mb-2">Metals Vault</h3>
							<p className="text-gray-400 text-sm">Precious metals arbitrage</p>
						</div>
						<div className="bg-gray-900 border border-gray-700 rounded-xl p-6 opacity-60">
							<h3 className="text-lg font-bold mb-2">Cross-Chain Vault</h3>
							<p className="text-gray-400 text-sm">
								Multi-chain commodity exposure
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
