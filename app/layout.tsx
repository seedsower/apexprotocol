import './globals.css';
import type { Metadata } from 'next';
import { WalletProviders } from '../src/providers/WalletProviders';
import { DriftProvider } from '../src/providers/DriftProvider';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Apex Commodities - Trading Platform',
	description:
		'High-performance commodities trading platform powered by Drift Protocol v2. Trade perpetuals and spot markets with institutional-grade infrastructure on Solana.',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning={true}>
			<body
				className="font-sans bg-gray-50 min-h-screen"
				suppressHydrationWarning={true}
			>
				<Suspense
					fallback={
						<div className="flex items-center justify-center min-h-screen">
							<div className="text-lg">Loading Apex Protocol...</div>
						</div>
					}
				>
					<WalletProviders>
<<<<<<< Updated upstream
						<DriftProvider>{children}</DriftProvider>
=======
						<ProductionApexProvider>{children}</ProductionApexProvider>
>>>>>>> Stashed changes
					</WalletProviders>
				</Suspense>
			</body>
		</html>
	);
}
