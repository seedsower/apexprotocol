'use client';
import React from 'react';
// Conditional import to handle SSR issues
let useWallet: any = () => ({
	connected: false,
	publicKey: null,
	wallet: null,
});
let useConnection: any = () => ({
	connection: { rpcEndpoint: 'not available' },
});

try {
	const walletAdapterReact = require('@solana/wallet-adapter-react');
	useWallet = walletAdapterReact.useWallet;
	useConnection = walletAdapterReact.useConnection;
} catch (error) {
	console.log('Wallet adapter not available in DebugPanel');
}

export const DebugPanel: React.FC = (): React.ReactElement => {
	// Try to get wallet context
	let walletData: any = null;
	let connectionData: any = null;
	let walletError: string = '';

	try {
		const walletContext = useWallet();
		const connectionContext = useConnection();
		walletData = {
			connected: walletContext.connected,
			publicKey: walletContext.publicKey?.toString(),
			wallet: walletContext.wallet?.adapter?.name || 'none',
		};
		connectionData = {
			endpoint: connectionContext.connection?.rpcEndpoint,
		};
	} catch (error: any) {
		walletError = error.message;
	}

	return (
		<div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-md">
			<h3 className="font-bold text-green-400 mb-2">🔧 Debug Panel</h3>

			<div className="space-y-2">
				<div>
					<span className="text-blue-300">Wallet Context:</span>
					{walletError ? (
						<div className="text-red-400">❌ Error: {walletError}</div>
					) : (
						<div className="text-green-400">✅ Available</div>
					)}
				</div>

				{walletData && (
					<div>
						<div>
							<span className="text-blue-300">Connected:</span>{' '}
							{walletData.connected ? '✅' : '❌'}
						</div>
						<div>
							<span className="text-blue-300">Wallet:</span> {walletData.wallet}
						</div>
						<div>
							<span className="text-blue-300">PublicKey:</span>{' '}
							{walletData.publicKey
								? `${walletData.publicKey.slice(0, 8)}...`
								: 'none'}
						</div>
					</div>
				)}

				{connectionData && (
					<div>
						<div>
							<span className="text-blue-300">RPC:</span>{' '}
							{connectionData.endpoint}
						</div>
					</div>
				)}

				<div className="pt-2 border-t border-gray-600">
					<div className="text-yellow-300">Environment Variables:</div>
					<div className="text-xs">
						<div>
							RPC_URL:{' '}
							{process.env.NEXT_PUBLIC_RPC_URL ||
								process.env.RPC_URL ||
								'not set'}
						</div>
						<div>
							PROGRAM_ID:{' '}
							{process.env.NEXT_PUBLIC_PROGRAM_ID ||
								process.env.PROGRAM_ID ||
								'not set'}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
