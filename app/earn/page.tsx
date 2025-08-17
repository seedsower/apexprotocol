'use client';

import Link from 'next/link';

export default function EarnPage() {
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
						<button className="text-white font-medium text-sm">Earn</button>
						<Link
							href="/vaults"
							className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
						>
							Vaults
						</Link>
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
						Earn with Apex Protocol
					</h1>
					<p className="text-xl text-gray-300 max-w-3xl mx-auto">
						Generate yield through liquidity provision, staking, and lending in
						commodity markets.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
					{/* USDC Lending */}
					<div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
						<div className="text-2xl mb-4">💰</div>
						<h3 className="text-xl font-bold mb-2">USDC Lending</h3>
						<div className="text-3xl font-bold text-green-400 mb-2">
							5.81% APY
						</div>
						<p className="text-gray-400 mb-4">
							Earn yield by lending USDC to commodity traders.
						</p>
						<button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium">
							Start Earning
						</button>
					</div>

					{/* Liquidity Provision */}
					<div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
						<div className="text-2xl mb-4">🌊</div>
						<h3 className="text-xl font-bold mb-2">Liquidity Provision</h3>
						<div className="text-3xl font-bold text-blue-400 mb-2">
							12.5% APY
						</div>
						<p className="text-gray-400 mb-4">
							Provide liquidity to commodity trading pairs.
						</p>
						<button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium">
							Add Liquidity
						</button>
					</div>

					{/* APEX Staking */}
					<div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
						<div className="text-2xl mb-4">🔥</div>
						<h3 className="text-xl font-bold mb-2">APEX Staking</h3>
						<div className="text-3xl font-bold text-orange-400 mb-2">
							18.2% APY
						</div>
						<p className="text-gray-400 mb-4">
							Stake APEX tokens for protocol governance rewards.
						</p>
						<button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium">
							Stake APEX
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
