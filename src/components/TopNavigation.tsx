'use client';

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Logo } from './Logo';
import { useDrift } from '../providers/DriftProvider';

interface TopNavigationProps {
	onCreateAccount?: () => void;
	isCreatingAccount?: boolean;
}

export function TopNavigation({
	onCreateAccount,
	isCreatingAccount,
}: TopNavigationProps) {
	const { connected, publicKey } = useWallet();
	const { isReady } = useDrift();

	return (
		<nav className="bg-gray-900 border-b border-gray-800">
			{/* Top Banner */}
			<div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-2 text-sm">
				Trade <span className="font-semibold">NGT</span> and{' '}
				<span className="font-semibold">Commodities</span> with{' '}
				<span className="font-semibold">0% fees</span>
				<button className="ml-2 text-white hover:text-gray-200">
					<svg
						className="w-4 h-4 inline"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			{/* Main Navigation */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Left Side - Logo & Navigation */}
					<div className="flex items-center space-x-8">
						<div className="flex items-center">
							<Logo className="text-white text-xl font-bold" />
						</div>

						{/* Navigation Links */}
						<div className="hidden md:flex items-center space-x-6">
							<a
								href="/"
								className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
							>
								Overview
							</a>
							<a
								href="/trade"
								className="text-white bg-gray-800 px-3 py-2 rounded-md text-sm font-medium"
							>
								Trade
							</a>
							<a
								href="/earn"
								className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
							>
								Earn
							</a>
							<a
								href="/vaults"
								className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
							>
								Vaults
								<span className="ml-1 text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded">
									Hot
								</span>
							</a>
							<a
								href="/stake"
								className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
							>
								Stake APEX
							</a>
							<div className="relative group">
								<button className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors flex items-center">
									More
									<svg
										className="ml-1 w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</button>
								{/* Dropdown menu would go here */}
							</div>
						</div>
					</div>

					{/* Right Side - Account Actions & Wallet */}
					<div className="flex items-center space-x-4">
						{/* Account Status */}
						{connected && (
							<div className="hidden md:flex items-center space-x-3">
								<div className="text-right">
									<div className="text-xs text-gray-400">Connected</div>
									<div className="text-sm text-white font-medium">
										{publicKey?.toString().slice(0, 8)}...
									</div>
								</div>
								<div
									className={`w-2 h-2 rounded-full ${
										isReady ? 'bg-green-500' : 'bg-yellow-500'
									}`}
								></div>
							</div>
						)}

						{/* Create Account Button */}
						{connected && onCreateAccount && (
							<button
								onClick={onCreateAccount}
								disabled={isCreatingAccount}
								className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
									isCreatingAccount
										? 'bg-gray-600 text-gray-300 cursor-not-allowed'
										: 'bg-purple-600 hover:bg-purple-700 text-white'
								}`}
							>
								{isCreatingAccount ? 'Creating...' : 'Create Account'}
							</button>
						)}

						{/* Notifications */}
						<button className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors">
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 17h5l-5 5v-5zM4 19h6v-7a9 9 0 0118 0v7h6"
								/>
							</svg>
						</button>

						{/* Settings */}
						<button className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors">
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
						</button>

						{/* Wallet Connect Button */}
						<div className="wallet-adapter-button-trigger">
							<WalletMultiButton />
						</div>
					</div>
				</div>
			</div>

			{/* Mobile Navigation Menu (hidden by default) */}
			<div className="md:hidden border-t border-gray-800">
				<div className="px-2 pt-2 pb-3 space-y-1">
					<a
						href="/"
						className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
					>
						Overview
					</a>
					<a
						href="/trade"
						className="text-white bg-gray-800 block px-3 py-2 rounded-md text-base font-medium"
					>
						Trade
					</a>
					<a
						href="/earn"
						className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
					>
						Earn
					</a>
					<a
						href="/vaults"
						className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
					>
						Vaults
					</a>
					<a
						href="/stake"
						className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
					>
						Stake APEX
					</a>
				</div>
			</div>
		</nav>
	);
}
