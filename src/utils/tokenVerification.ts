// Token verification utilities
import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, getMint } from '@solana/spl-token';

export interface TokenVerificationResult {
	tokenExists: boolean;
	hasTokenAccount: boolean;
	tokenAccountAddress?: string;
	mintInfo?: any;
	error?: string;
}

export async function verifyTokenOnNetwork(
	connection: Connection,
	walletAddress: string,
	tokenMintAddress: string
): Promise<TokenVerificationResult> {
	try {
		console.log('🔍 Verifying token on network...');
		console.log('Wallet:', walletAddress);
		console.log('Token Mint:', tokenMintAddress);
		console.log('RPC:', connection.rpcEndpoint);

		const walletPubkey = new PublicKey(walletAddress);
		const mintPubkey = new PublicKey(tokenMintAddress);

		// 1. Check if the token mint exists
		let mintInfo;
		try {
			mintInfo = await getMint(connection, mintPubkey);
			console.log('✅ Token mint found:', mintInfo);
		} catch (err) {
			console.log('❌ Token mint not found on this network');
			return {
				tokenExists: false,
				hasTokenAccount: false,
				error: 'Token mint not found on this network',
			};
		}

		// 2. Get associated token account address
		const tokenAccountAddress = await getAssociatedTokenAddress(
			mintPubkey,
			walletPubkey
		);
		console.log('📍 Token account address:', tokenAccountAddress.toString());

		// 3. Check if token account exists and has balance
		try {
			const accountInfo = await connection.getAccountInfo(tokenAccountAddress);
			if (accountInfo) {
				console.log('✅ Token account exists');

				// Try to get the parsed account info
				try {
					const parsedInfo = await connection.getParsedAccountInfo(
						tokenAccountAddress
					);
					if (parsedInfo.value?.data && 'parsed' in parsedInfo.value.data) {
						const tokenAmount = parsedInfo.value.data.parsed.info.tokenAmount;
						console.log('💰 Token balance:', tokenAmount);
					}
				} catch (parseErr) {
					console.log('⚠️ Could not parse token account info');
				}

				return {
					tokenExists: true,
					hasTokenAccount: true,
					tokenAccountAddress: tokenAccountAddress.toString(),
					mintInfo,
				};
			} else {
				console.log('❌ Token account does not exist');
				return {
					tokenExists: true,
					hasTokenAccount: false,
					tokenAccountAddress: tokenAccountAddress.toString(),
					mintInfo,
					error: 'Token account not found (you may not hold this token)',
				};
			}
		} catch (err) {
			console.log('❌ Error checking token account:', err);
			return {
				tokenExists: true,
				hasTokenAccount: false,
				tokenAccountAddress: tokenAccountAddress.toString(),
				mintInfo,
				error: `Error checking token account: ${
					err instanceof Error ? err.message : 'Unknown error'
				}`,
			};
		}
	} catch (err) {
		console.log('❌ General verification error:', err);
		return {
			tokenExists: false,
			hasTokenAccount: false,
			error: `Verification error: ${
				err instanceof Error ? err.message : 'Unknown error'
			}`,
		};
	}
}

// Quick network test
export async function testNetworkConnection(
	connection: Connection
): Promise<boolean> {
	try {
		const slot = await connection.getSlot();
		console.log('🌐 Network connected, current slot:', slot);
		return true;
	} catch (err) {
		console.log('❌ Network connection failed:', err);
		return false;
	}
}

// Test multiple networks to find where the token exists
export async function findTokenNetwork(
	walletAddress: string,
	tokenMintAddress: string
): Promise<{
	network: string;
	rpcUrl: string;
	result: TokenVerificationResult;
} | null> {
	// Check both mainnet and devnet networks
	const networks = [
		{ name: 'mainnet-beta', rpcUrl: 'https://api.mainnet-beta.solana.com' },
		{ name: 'devnet', rpcUrl: 'https://api.devnet.solana.com' },
	];

	for (const network of networks) {
		console.log(`🔍 Testing ${network.name}...`);
		const connection = new Connection(network.rpcUrl, 'confirmed');

		const result = await verifyTokenOnNetwork(
			connection,
			walletAddress,
			tokenMintAddress
		);

		if (result.tokenExists && result.hasTokenAccount) {
			console.log(`✅ Token found on ${network.name}!`);
			return {
				network: network.name,
				rpcUrl: network.rpcUrl,
				result,
			};
		}
	}

	console.log('❌ Token not found on any tested network');
	return null;
}
