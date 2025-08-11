import { Logo } from '@/components/Logo';
import Link from 'next/link';

export default function Home() {
	return (
		<main className="min-h-screen relative overflow-hidden">
			{/* Background Image */}
			<div
				className="absolute inset-0 bg-cover bg-center bg-no-repeat"
				style={{
					backgroundImage:
						"url('https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
					filter: 'brightness(0.3) contrast(1.2)',
				}}
			></div>
			{/* Gradient Overlay */}
			<div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-gray-900/90"></div>

			{/* Content */}
			<div className="relative z-10 container mx-auto px-4 py-16">
				<div className="text-center mb-16">
					<div className="flex justify-center mb-6">
						<Logo />
					</div>
					<p className="text-xl text-gray-300 max-w-3xl mx-auto">
						High-performance commodities trading platform powered by Apex
						Protocol v2. Trade perpetuals and spot markets with
						institutional-grade infrastructure on Solana.
					</p>
				</div>

				<div className="text-center">
					<Link
						href="/trade"
						className="inline-block bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-4 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
					>
						Launch Apex Protocol
					</Link>
				</div>
			</div>
		</main>
	);
}
