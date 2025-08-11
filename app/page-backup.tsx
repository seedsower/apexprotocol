'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
			<div className="container mx-auto px-4 py-16">
				{/* Header */}
				<div className="text-center mb-16">
					{/* Logo with Mountain Icon */}
					<div className="flex items-center justify-center mb-6">
						<div className="mr-4">
							<svg
								className="w-16 h-16 text-blue-500"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M14,6L10.25,11L13.1,14.8L11.5,16C9.81,13.75 7,10 7,10L1,18H23L14,6Z" />
							</svg>
						</div>
						<h1 className="text-6xl font-bold text-white">
							Apex <span className="text-blue-500">Commodities</span>
						</h1>
					</div>
					<p className="text-xl text-gray-300 max-w-3xl mx-auto">
						High-performance commodities trading platform powered by Drift
						Protocol v2. Trade perpetuals and spot markets with
						institutional-grade infrastructure on Solana.
					</p>
				</div>

				{/* Wallet Connection - Temporarily disabled for build fix */}
				<div className="flex justify-center mb-12">
					{mounted && (
						<div className="btn-primary px-6 py-3 rounded-lg">
							Connect Wallet
						</div>
					)}
				</div>

				{/* Navigation */}
				<div className="text-center">
					<Link
						href="/trade"
						className="inline-block btn-primary text-lg px-8 py-4 rounded-xl font-semibold"
					>
						Start Trading
					</Link>
				</div>

				{/* Features Grid */}
				<div className="grid md:grid-cols-3 gap-8 mt-20">
					<div className="card p-8 text-center">
						<div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
							<svg
								className="w-8 h-8 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
								/>
							</svg>
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-3">
							High Performance
						</h3>
						<p className="text-gray-600">
							Low-latency trading with real-time market data and instant order
							execution.
						</p>
					</div>

					<div className="card p-8 text-center">
						<div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
							<svg
								className="w-8 h-8 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-3">
							Secure & Audited
						</h3>
						<p className="text-gray-600">
							Built on Drift Protocol with multiple security audits and proven
							track record.
						</p>
					</div>

					<div className="card p-8 text-center">
						<div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
							<svg
								className="w-8 h-8 text-yellow-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
								/>
							</svg>
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-3">
							Commodities Focus
						</h3>
						<p className="text-gray-600">
							Specialized for commodity trading with deep liquidity and
							competitive spreads.
						</p>
					</div>
				</div>
			</div>
		</main>
	);
}
