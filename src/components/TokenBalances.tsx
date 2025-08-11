'use client';
import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import {
	TokenIntegrationService,
	TokenBalance,
	formatTokenAmount,
} from '../utils/tokenIntegration';
import { COMMODITY_TOKENS } from '../config/tokens';

export const TokenBalances: React.FC = () => {
	const { publicKey, connected } = useWallet();
	const [balances, setBalances] = useState<TokenBalance[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (connected && publicKey) {
			fetchBalances();
		} else {
			setBalances([]);
		}
	}, [connected, publicKey]);

	const fetchBalances = async () => {
		if (!publicKey) return;

		setLoading(true);
		setError(null);

		try {
			console.log('🔍 Fetching balances for wallet:', publicKey.toString());
			console.log('🎆 Using demo mode to bypass RPC issues');

			// Use demo mode - return mock balances
			// const tokenService = new TokenIntegrationService(connection);

			// Use demo mode directly - no RPC calls needed
			const tokenService = new TokenIntegrationService(null as any);
			const userBalances = await tokenService.getAllCommodityBalances(
				publicKey
			);
			console.log('📊 Demo balances result:', userBalances);

			setBalances(userBalances);
		} catch (err) {
			console.error('❌ Error fetching token balances:', err);
			setError(
				`Failed to fetch token balances: ${
					err instanceof Error ? err.message : 'Unknown error'
				}`
			);
		} finally {
			setLoading(false);
		}
	};

	if (!connected) {
		return (
			<div className="card p-4">
				<h3 className="text-lg font-semibold text-gray-900 mb-2">
					Token Balances
				</h3>
				<p className="text-gray-500">
					Connect your wallet to view token balances
				</p>
			</div>
		);
	}

	return (
		<div className="card p-4">
			<div className="flex justify-between items-center mb-4">
				<h3 className="text-lg font-semibold text-gray-900">
					Commodity Token Balances
				</h3>
				<button
					onClick={fetchBalances}
					disabled={loading}
					className="btn-secondary text-sm px-3 py-1"
				>
					{loading ? 'Refreshing...' : 'Refresh'}
				</button>
			</div>

			{error && (
				<div
					className={`mb-4 p-3 rounded-lg text-sm ${
						error.includes('found')
							? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
							: 'bg-red-50 text-red-600 border border-red-200'
					}`}
				>
					<div className="font-medium mb-1">
						{error.includes('found') ? '⚠️ Network Mismatch' : '❌ Error'}
					</div>
					{error}
				</div>
			)}

			{loading ? (
				<div className="space-y-3">
					{[...Array(5)].map((_, i) => (
						<div
							key={i}
							className="animate-pulse flex justify-between items-center p-3 bg-gray-100 rounded-lg"
						>
							<div className="flex items-center space-x-3">
								<div className="w-8 h-8 bg-gray-300 rounded-full"></div>
								<div className="w-12 h-4 bg-gray-300 rounded"></div>
							</div>
							<div className="w-20 h-4 bg-gray-300 rounded"></div>
						</div>
					))}
				</div>
			) : (
				<div className="space-y-2">
					{Object.values(COMMODITY_TOKENS).map((tokenConfig) => {
						// Debug: Log balance matching for NGT
						if (tokenConfig.symbol === 'NGT') {
							console.log(`🔍 [UI] NGT token config:`, tokenConfig);
							console.log(`🔍 [UI] All balances:`, balances);
							console.log(
								`🔍 [UI] Looking for mint: ${tokenConfig.mintAddress}`
							);
						}
						const balance = balances.find(
							(b) => b.mint === tokenConfig.mintAddress
						);
						if (tokenConfig.symbol === 'NGT') {
							console.log(`🔍 [UI] NGT balance found:`, balance);
						}
						const hasBalance =
							balance && balance.uiBalance && balance.uiBalance > 0;

						return (
							<div
								key={tokenConfig.symbol}
								className={`flex justify-between items-center p-3 rounded-lg border ${
									hasBalance
										? 'border-green-200 bg-green-50'
										: 'border-gray-200 bg-gray-50'
								}`}
							>
								<div className="flex items-center space-x-3">
									<div
										className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
											hasBalance
												? 'bg-green-500 text-white'
												: 'bg-gray-400 text-white'
										}`}
									>
										{tokenConfig.symbol}
									</div>
									<div>
										<p className="font-medium text-gray-900">
											{tokenConfig.name}
										</p>
										<p className="text-xs text-gray-500">
											{tokenConfig.symbol}
										</p>
									</div>
								</div>

								<div className="text-right">
									<p
										className={`font-medium ${
											hasBalance ? 'text-green-600' : 'text-gray-500'
										}`}
									>
										{balance
											? formatTokenAmount(balance.balance, balance.decimals)
											: '0'}
									</p>
									<p className="text-xs text-gray-500">{tokenConfig.symbol}</p>
								</div>
							</div>
						);
					})}

					{balances.length === 0 && !loading && (
						<div className="text-center py-6 text-gray-500">
							<p>No token balances found</p>
							<p className="text-sm mt-1">
								Make sure you have configured your token mint addresses
							</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
};
