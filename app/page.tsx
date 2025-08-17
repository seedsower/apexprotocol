import Link from 'next/link';

export default function Home() {
	return (
		<div className="min-h-screen bg-black text-white relative overflow-hidden">
			{/* Background Image */}
			<div
				className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
				style={{
					backgroundImage:
						'url("https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
				}}
			/>

			{/* Overlay */}
			<div className="absolute inset-0 bg-black bg-opacity-70" />

			{/* Header */}
			<header className="relative z-20 flex items-center justify-between px-6 py-4 bg-gray-900 bg-opacity-90 backdrop-blur-sm border-b border-gray-800">
				<div className="flex items-center space-x-3">
					<div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
						<span className="text-white font-bold text-lg">A</span>
					</div>
					<span className="text-white text-xl font-bold">Apex Protocol</span>
				</div>

				{/* Apex Logo in Upper Right */}
				<div className="flex items-center space-x-2">
					<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
						<span className="text-white font-bold text-xl">A</span>
					</div>
					<span className="text-white font-bold text-xl">APEX</span>
				</div>
			</header>

			{/* Content */}
			<div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 text-center">
				{/* Logo */}
				<div className="mb-8">
					<div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-2xl">
						<span className="text-white font-bold text-4xl">A</span>
					</div>
					<h1 className="text-7xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
						Apex Protocol
					</h1>
				</div>

				{/* Tagline */}
				<p className="text-2xl text-gray-300 mb-12 max-w-4xl leading-relaxed">
					High-performance commodities trading platform powered by Apex Protocol
					v2. Trade perpetuals and spot markets with institutional-grade
					infrastructure on Solana.
				</p>

				{/* Live Markets Display */}
				<div className="mb-12 bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 max-w-4xl w-full">
					<h3 className="text-xl font-bold mb-4 text-center">
						Live Commodity Markets
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
						<div className="text-center p-3 bg-gray-800 rounded-lg">
							<div className="font-bold text-orange-400">WTI</div>
							<div className="text-lg font-semibold">$73.45</div>
							<div className="text-green-400 text-sm">+2.34%</div>
						</div>
						<div className="text-center p-3 bg-gray-800 rounded-lg">
							<div className="font-bold text-yellow-400">GOLD</div>
							<div className="text-lg font-semibold">$2,034</div>
							<div className="text-green-400 text-sm">+12.34%</div>
						</div>
						<div className="text-center p-3 bg-gray-800 rounded-lg">
							<div className="font-bold text-blue-400">NGT</div>
							<div className="text-lg font-semibold">$2.89</div>
							<div className="text-red-400 text-sm">-0.45%</div>
						</div>
						<div className="text-center p-3 bg-gray-800 rounded-lg">
							<div className="font-bold text-gray-300">SILVER</div>
							<div className="text-lg font-semibold">$24.78</div>
							<div className="text-green-400 text-sm">+0.89%</div>
						</div>
						<div className="text-center p-3 bg-gray-800 rounded-lg">
							<div className="font-bold text-amber-600">WHEAT</div>
							<div className="text-lg font-semibold">$6.45</div>
							<div className="text-red-400 text-sm">-0.23%</div>
						</div>
					</div>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl w-full">
					<div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
						<div className="text-3xl font-bold text-green-400 mb-2">$2.4B+</div>
						<div className="text-gray-300">Total Volume Traded</div>
					</div>
					<div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
						<div className="text-3xl font-bold text-purple-400 mb-2">5</div>
						<div className="text-gray-300">Commodity Markets</div>
					</div>
					<div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
						<div className="text-3xl font-bold text-blue-400 mb-2">0%</div>
						<div className="text-gray-300">Trading Fees</div>
					</div>
				</div>

				{/* CTA Button */}
				<Link
					href="/trade"
					className="group relative inline-flex items-center justify-center px-16 py-6 text-xl font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-purple-500/50"
				>
					<span className="relative z-10">Launch Apex Protocol</span>
					<div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
				</Link>

				{/* Features */}
				<div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
					<div className="text-center p-6 bg-gray-900 bg-opacity-50 rounded-xl border border-gray-700">
						<div className="text-4xl mb-3">⚡</div>
						<h3 className="font-semibold mb-2 text-white">Lightning Fast</h3>
						<p className="text-sm text-gray-400">
							Sub-second execution on Solana
						</p>
					</div>
					<div className="text-center p-6 bg-gray-900 bg-opacity-50 rounded-xl border border-gray-700">
						<div className="text-4xl mb-3">🛡️</div>
						<h3 className="font-semibold mb-2 text-white">Secure & Audited</h3>
						<p className="text-sm text-gray-400">
							Battle-tested smart contracts
						</p>
					</div>
					<div className="text-center p-6 bg-gray-900 bg-opacity-50 rounded-xl border border-gray-700">
						<div className="text-4xl mb-3">📊</div>
						<h3 className="font-semibold mb-2 text-white">
							Professional Tools
						</h3>
						<p className="text-sm text-gray-400">Advanced trading interface</p>
					</div>
					<div className="text-center p-6 bg-gray-900 bg-opacity-50 rounded-xl border border-gray-700">
						<div className="text-4xl mb-3">🌍</div>
						<h3 className="font-semibold mb-2 text-white">Global Markets</h3>
						<p className="text-sm text-gray-400">Trade commodities 24/7</p>
					</div>
				</div>
			</div>
		</div>
	);
}
