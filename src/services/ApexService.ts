import {
	Connection,
	PublicKey,
	SystemProgram,
	SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';
import { AnchorProvider, Program, BN, Idl } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { WalletContextState } from '@solana/wallet-adapter-react';

// Apex Protocol Program ID (devnet)
const APEX_PROGRAM_ID = new PublicKey(
	'5LG726477dDBUQ9TSfPJb9v6J8Wa9ZW8cfSDc1fZiQTL'
);

// TypeScript interface for Apex Program
export interface ApexSimple extends Idl {
	version: '0.1.0';
	name: 'apex_simple';
	instructions: [
		{
			name: 'initialize';
			accounts: [
				{ name: 'state'; isMut: true; isSigner: false },
				{ name: 'payer'; isMut: true; isSigner: true },
				{ name: 'systemProgram'; isMut: false; isSigner: false },
			];
			args: [{ name: 'admin'; type: 'publicKey' }];
		},
		{
			name: 'initializeSpotMarket';
			accounts: [
				{ name: 'state'; isMut: true; isSigner: false },
				{ name: 'spotMarket'; isMut: true; isSigner: false },
				{ name: 'vault'; isMut: true; isSigner: false },
				{ name: 'mint'; isMut: false; isSigner: false },
				{ name: 'payer'; isMut: true; isSigner: true },
				{ name: 'tokenProgram'; isMut: false; isSigner: false },
				{ name: 'systemProgram'; isMut: false; isSigner: false },
				{ name: 'rent'; isMut: false; isSigner: false },
			];
			args: [
				{ name: 'marketIndex'; type: 'u16' },
				{ name: 'oracle'; type: 'publicKey' },
				{ name: 'mint'; type: 'publicKey' },
				{ name: 'name'; type: { array: ['u8', 32] } },
				{ name: 'decimals'; type: 'u32' },
			];
		},
		{
			name: 'deposit';
			accounts: [
				{ name: 'state'; isMut: true; isSigner: false },
				{ name: 'spotMarket'; isMut: true; isSigner: false },
				{ name: 'user'; isMut: true; isSigner: false },
				{ name: 'userTokenAccount'; isMut: true; isSigner: false },
				{ name: 'vault'; isMut: true; isSigner: false },
				{ name: 'authority'; isMut: true; isSigner: true },
				{ name: 'tokenProgram'; isMut: false; isSigner: false },
				{ name: 'systemProgram'; isMut: false; isSigner: false },
				{ name: 'rent'; isMut: false; isSigner: false },
			];
			args: [
				{ name: 'marketIndex'; type: 'u16' },
				{ name: 'amount'; type: 'u64' },
			];
		},
		{
			name: 'withdraw';
			accounts: [
				{ name: 'state'; isMut: true; isSigner: false },
				{ name: 'spotMarket'; isMut: true; isSigner: false },
				{ name: 'user'; isMut: true; isSigner: false },
				{ name: 'userTokenAccount'; isMut: true; isSigner: false },
				{ name: 'vault'; isMut: true; isSigner: false },
				{ name: 'authority'; isMut: true; isSigner: true },
				{ name: 'tokenProgram'; isMut: false; isSigner: false },
			];
			args: [
				{ name: 'marketIndex'; type: 'u16' },
				{ name: 'amount'; type: 'u64' },
			];
		},
		{
			name: 'placeSpotOrder';
			accounts: [
				{ name: 'user'; isMut: true; isSigner: false },
				{ name: 'authority'; isMut: true; isSigner: true },
			];
			args: [
				{ name: 'marketIndex'; type: 'u16' },
				{ name: 'amount'; type: 'u64' },
				{ name: 'price'; type: 'u64' },
				{ name: 'side'; type: { defined: 'OrderSide' } },
			];
		},
	];
	accounts: [
		{
			name: 'ApexState';
			type: {
				kind: 'struct';
				fields: [
					{ name: 'admin'; type: 'publicKey' },
					{ name: 'exchangeStatus'; type: 'u8' },
					{ name: 'fundingPaused'; type: 'bool' },
					{ name: 'fillPaused'; type: 'bool' },
					{ name: 'ammPaused'; type: 'bool' },
					{ name: 'padding'; type: { array: ['u8', 32] } },
				];
			};
		},
		{
			name: 'SpotMarket';
			type: {
				kind: 'struct';
				fields: [
					{ name: 'marketIndex'; type: 'u16' },
					{ name: 'oracle'; type: 'publicKey' },
					{ name: 'mint'; type: 'publicKey' },
					{ name: 'vault'; type: 'publicKey' },
					{ name: 'name'; type: { array: ['u8', 32] } },
					{ name: 'decimals'; type: 'u32' },
					{ name: 'depositBalance'; type: 'u128' },
					{ name: 'borrowBalance'; type: 'u128' },
					{ name: 'status'; type: { defined: 'MarketStatus' } },
					{ name: 'padding'; type: { array: ['u8', 256] } },
				];
			};
		},
		{
			name: 'User';
			type: {
				kind: 'struct';
				fields: [
					{ name: 'authority'; type: 'publicKey' },
					{ name: 'totalDeposits'; type: 'u64' },
					{ name: 'totalWithdrawals'; type: 'u64' },
					{ name: 'padding'; type: { array: ['u8', 256] } },
				];
			};
		},
	];
	types: [
		{
			name: 'MarketStatus';
			type: {
				kind: 'enum';
				variants: [
					{ name: 'Initialized' },
					{ name: 'Active' },
					{ name: 'Paused' },
				];
			};
		},
		{
			name: 'OrderSide';
			type: {
				kind: 'enum';
				variants: [{ name: 'Buy' }, { name: 'Sell' }];
			};
		},
	];
}

// Simplified IDL for runtime use
const APEX_IDL: ApexSimple = {
	version: '0.1.0',
	name: 'apex_simple',
	instructions: [
		{
			name: 'initialize',
			accounts: [
				{ name: 'state', isMut: true, isSigner: false },
				{ name: 'payer', isMut: true, isSigner: true },
				{ name: 'systemProgram', isMut: false, isSigner: false },
			],
			args: [{ name: 'admin', type: 'publicKey' }],
		},
		{
			name: 'initializeSpotMarket',
			accounts: [
				{ name: 'state', isMut: true, isSigner: false },
				{ name: 'spotMarket', isMut: true, isSigner: false },
				{ name: 'vault', isMut: true, isSigner: false },
				{ name: 'mint', isMut: false, isSigner: false },
				{ name: 'payer', isMut: true, isSigner: true },
				{ name: 'tokenProgram', isMut: false, isSigner: false },
				{ name: 'systemProgram', isMut: false, isSigner: false },
				{ name: 'rent', isMut: false, isSigner: false },
			],
			args: [
				{ name: 'marketIndex', type: 'u16' },
				{ name: 'oracle', type: 'publicKey' },
				{ name: 'mint', type: 'publicKey' },
				{ name: 'name', type: { array: ['u8', 32] } },
				{ name: 'decimals', type: 'u32' },
			],
		},
		{
			name: 'deposit',
			accounts: [
				{ name: 'state', isMut: true, isSigner: false },
				{ name: 'spotMarket', isMut: true, isSigner: false },
				{ name: 'user', isMut: true, isSigner: false },
				{ name: 'userTokenAccount', isMut: true, isSigner: false },
				{ name: 'vault', isMut: true, isSigner: false },
				{ name: 'authority', isMut: true, isSigner: true },
				{ name: 'tokenProgram', isMut: false, isSigner: false },
				{ name: 'systemProgram', isMut: false, isSigner: false },
				{ name: 'rent', isMut: false, isSigner: false },
			],
			args: [
				{ name: 'marketIndex', type: 'u16' },
				{ name: 'amount', type: 'u64' },
			],
		},
		{
			name: 'withdraw',
			accounts: [
				{ name: 'state', isMut: true, isSigner: false },
				{ name: 'spotMarket', isMut: true, isSigner: false },
				{ name: 'user', isMut: true, isSigner: false },
				{ name: 'userTokenAccount', isMut: true, isSigner: false },
				{ name: 'vault', isMut: true, isSigner: false },
				{ name: 'authority', isMut: true, isSigner: true },
				{ name: 'tokenProgram', isMut: false, isSigner: false },
			],
			args: [
				{ name: 'marketIndex', type: 'u16' },
				{ name: 'amount', type: 'u64' },
			],
		},
		{
			name: 'placeSpotOrder',
			accounts: [
				{ name: 'user', isMut: true, isSigner: false },
				{ name: 'authority', isMut: true, isSigner: true },
			],
			args: [
				{ name: 'marketIndex', type: 'u16' },
				{ name: 'amount', type: 'u64' },
				{ name: 'price', type: 'u64' },
				{ name: 'side', type: { defined: 'OrderSide' } },
			],
		},
	],
	accounts: [
		{
			name: 'ApexState',
			type: {
				kind: 'struct',
				fields: [
					{ name: 'admin', type: 'publicKey' },
					{ name: 'exchangeStatus', type: 'u8' },
					{ name: 'fundingPaused', type: 'bool' },
					{ name: 'fillPaused', type: 'bool' },
					{ name: 'ammPaused', type: 'bool' },
					{ name: 'padding', type: { array: ['u8', 32] } },
				],
			},
		},
		{
			name: 'SpotMarket',
			type: {
				kind: 'struct',
				fields: [
					{ name: 'marketIndex', type: 'u16' },
					{ name: 'oracle', type: 'publicKey' },
					{ name: 'mint', type: 'publicKey' },
					{ name: 'vault', type: 'publicKey' },
					{ name: 'name', type: { array: ['u8', 32] } },
					{ name: 'decimals', type: 'u32' },
					{ name: 'depositBalance', type: 'u128' },
					{ name: 'borrowBalance', type: 'u128' },
					{ name: 'status', type: { defined: 'MarketStatus' } },
					{ name: 'padding', type: { array: ['u8', 256] } },
				],
			},
		},
		{
			name: 'User',
			type: {
				kind: 'struct',
				fields: [
					{ name: 'authority', type: 'publicKey' },
					{ name: 'totalDeposits', type: 'u64' },
					{ name: 'totalWithdrawals', type: 'u64' },
					{ name: 'padding', type: { array: ['u8', 256] } },
				],
			},
		},
	],
	types: [
		{
			name: 'MarketStatus',
			type: {
				kind: 'enum',
				variants: [
					{ name: 'Initialized' },
					{ name: 'Active' },
					{ name: 'Paused' },
				],
			},
		},
		{
			name: 'OrderSide',
			type: {
				kind: 'enum',
				variants: [{ name: 'Buy' }, { name: 'Sell' }],
			},
		},
	],
};

export interface ApexUser {
	authority: PublicKey;
	totalDeposits: BN;
	totalWithdrawals: BN;
}

export interface SpotMarket {
	marketIndex: number;
	oracle: PublicKey;
	mint: PublicKey;
	vault: PublicKey;
	name: string;
	decimals: number;
	depositBalance: BN;
	borrowBalance: BN;
	status: 'Initialized' | 'Active' | 'Paused';
}

export class ApexService {
	private connection: Connection;
	private program: Program<ApexSimple> | null = null;
	private provider: AnchorProvider | null = null;

	constructor(connection: Connection) {
		this.connection = connection;
	}

	async initialize(wallet: WalletContextState): Promise<void> {
		if (!wallet.publicKey || !wallet.signTransaction) {
			throw new Error('Wallet not connected');
		}

		this.provider = new AnchorProvider(this.connection, wallet as any, {
			commitment: 'confirmed',
		});

		this.program = new Program(
			APEX_IDL as ApexSimple,
			APEX_PROGRAM_ID,
			this.provider
		);
	}

	// Get PDA addresses
	getStatePDA(): [PublicKey, number] {
		return PublicKey.findProgramAddressSync(
			[Buffer.from('state')],
			APEX_PROGRAM_ID
		);
	}

	getSpotMarketPDA(marketIndex: number): [PublicKey, number] {
		return PublicKey.findProgramAddressSync(
			[
				Buffer.from('spot_market'),
				Buffer.from(marketIndex.toString().padStart(2, '0')),
			],
			APEX_PROGRAM_ID
		);
	}

	getVaultPDA(marketIndex: number): [PublicKey, number] {
		return PublicKey.findProgramAddressSync(
			[
				Buffer.from('spot_market_vault'),
				Buffer.from(marketIndex.toString().padStart(2, '0')),
			],
			APEX_PROGRAM_ID
		);
	}

	getUserPDA(authority: PublicKey): [PublicKey, number] {
		return PublicKey.findProgramAddressSync(
			[Buffer.from('user'), authority.toBuffer()],
			APEX_PROGRAM_ID
		);
	}

	// Initialize protocol state
	async initializeProtocol(admin: PublicKey): Promise<string> {
		if (!this.program || !this.provider) {
			throw new Error('Service not initialized');
		}

		const [statePDA] = this.getStatePDA();

		const tx = await this.program.methods
			.initialize(admin)
			.accounts({
				state: statePDA,
				payer: this.provider.wallet.publicKey,
				systemProgram: SystemProgram.programId,
			})
			.rpc();

		return tx;
	}

	// Create spot market
	async createSpotMarket(
		marketIndex: number,
		oracle: PublicKey,
		mint: PublicKey,
		name: string,
		decimals: number
	): Promise<string> {
		if (!this.program || !this.provider) {
			throw new Error('Service not initialized');
		}

		const [statePDA] = this.getStatePDA();
		const [spotMarketPDA] = this.getSpotMarketPDA(marketIndex);
		const [vaultPDA] = this.getVaultPDA(marketIndex);

		// Convert name to 32-byte array
		const nameBytes = new Array(32).fill(0);
		const nameBuffer = Buffer.from(name, 'utf8');
		for (let i = 0; i < Math.min(nameBuffer.length, 32); i++) {
			nameBytes[i] = nameBuffer[i];
		}

		const tx = await this.program.methods
			.initializeSpotMarket(marketIndex, oracle, mint, nameBytes, decimals)
			.accounts({
				state: statePDA,
				spotMarket: spotMarketPDA,
				vault: vaultPDA,
				mint: mint,
				payer: this.provider.wallet.publicKey,
				tokenProgram: TOKEN_PROGRAM_ID,
				systemProgram: SystemProgram.programId,
				rent: SYSVAR_RENT_PUBKEY,
			})
			.rpc();

		return tx;
	}

	// Deposit tokens
	async deposit(
		marketIndex: number,
		amount: number,
		mint: PublicKey
	): Promise<string> {
		if (!this.program || !this.provider) {
			throw new Error('Service not initialized');
		}

		const [statePDA] = this.getStatePDA();
		const [spotMarketPDA] = this.getSpotMarketPDA(marketIndex);
		const [userPDA] = this.getUserPDA(this.provider.wallet.publicKey);
		const [vaultPDA] = this.getVaultPDA(marketIndex);

		// Get user's associated token account
		const userTokenAccount = await getAssociatedTokenAddress(
			mint,
			this.provider.wallet.publicKey
		);

		const amountBN = new BN(amount * Math.pow(10, 6)); // Assuming 6 decimals for USDC

		const tx = await this.program.methods
			.deposit(marketIndex, amountBN)
			.accounts({
				state: statePDA,
				spotMarket: spotMarketPDA,
				user: userPDA,
				userTokenAccount: userTokenAccount,
				vault: vaultPDA,
				authority: this.provider.wallet.publicKey,
				tokenProgram: TOKEN_PROGRAM_ID,
				systemProgram: SystemProgram.programId,
				rent: SYSVAR_RENT_PUBKEY,
			})
			.rpc();

		return tx;
	}

	// Withdraw tokens
	async withdraw(
		marketIndex: number,
		amount: number,
		mint: PublicKey
	): Promise<string> {
		if (!this.program || !this.provider) {
			throw new Error('Service not initialized');
		}

		const [statePDA] = this.getStatePDA();
		const [spotMarketPDA] = this.getSpotMarketPDA(marketIndex);
		const [userPDA] = this.getUserPDA(this.provider.wallet.publicKey);
		const [vaultPDA] = this.getVaultPDA(marketIndex);

		// Get user's associated token account
		const userTokenAccount = await getAssociatedTokenAddress(
			mint,
			this.provider.wallet.publicKey
		);

		const amountBN = new BN(amount * Math.pow(10, 6)); // Assuming 6 decimals for USDC

		const tx = await this.program.methods
			.withdraw(marketIndex, amountBN)
			.accounts({
				state: statePDA,
				spotMarket: spotMarketPDA,
				user: userPDA,
				userTokenAccount: userTokenAccount,
				vault: vaultPDA,
				authority: this.provider.wallet.publicKey,
				tokenProgram: TOKEN_PROGRAM_ID,
			})
			.rpc();

		return tx;
	}

	// Place spot order
	async placeSpotOrder(
		marketIndex: number,
		amount: number,
		price: number,
		side: 'Buy' | 'Sell'
	): Promise<string> {
		if (!this.program || !this.provider) {
			throw new Error('Service not initialized');
		}

		const [userPDA] = this.getUserPDA(this.provider.wallet.publicKey);

		const amountBN = new BN(amount * Math.pow(10, 6));
		const priceBN = new BN(price * Math.pow(10, 6));

		const orderSide = side === 'Buy' ? { buy: {} } : { sell: {} };

		const tx = await this.program.methods
			.placeSpotOrder(marketIndex, amountBN, priceBN, orderSide)
			.accounts({
				user: userPDA,
				authority: this.provider.wallet.publicKey,
			})
			.rpc();

		return tx;
	}

	// Get user account data
	async getUserAccount(userPublicKey: PublicKey): Promise<ApexUser | null> {
		if (!this.program) {
			throw new Error('Service not initialized');
		}

		try {
			const [userPDA] = this.getUserPDA(userPublicKey);
			const userAccount = await this.program.account.User.fetch(userPDA);

			return {
				authority: userAccount.authority as PublicKey,
				totalDeposits: userAccount.totalDeposits as BN,
				totalWithdrawals: userAccount.totalWithdrawals as BN,
			};
		} catch (error) {
			console.log('User account not found:', error);
			return null;
		}
	}

	// Get spot market data
	async getSpotMarket(marketIndex: number): Promise<SpotMarket | null> {
		if (!this.program) {
			throw new Error('Service not initialized');
		}

		try {
			const [spotMarketPDA] = this.getSpotMarketPDA(marketIndex);
			const spotMarket = await this.program.account.SpotMarket.fetch(
				spotMarketPDA
			);

			// Convert name bytes to string
			const nameBytes = spotMarket.name as number[];
			const nameString = Buffer.from(nameBytes)
				.toString('utf8')
				.replace(/\0/g, '');

			return {
				marketIndex: spotMarket.marketIndex as number,
				oracle: spotMarket.oracle as PublicKey,
				mint: spotMarket.mint as PublicKey,
				vault: spotMarket.vault as PublicKey,
				name: nameString,
				decimals: spotMarket.decimals as number,
				depositBalance: spotMarket.depositBalance as BN,
				borrowBalance: spotMarket.borrowBalance as BN,
				status: Object.keys(spotMarket.status)[0] as
					| 'Initialized'
					| 'Active'
					| 'Paused',
			};
		} catch (error) {
			console.log('Spot market not found:', error);
			return null;
		}
	}

	// Get protocol state
	async getProtocolState(): Promise<any> {
		if (!this.program) {
			throw new Error('Service not initialized');
		}

		try {
			const [statePDA] = this.getStatePDA();
			const state = await this.program.account.ApexState.fetch(statePDA);
			return state;
		} catch (error) {
			console.log('Protocol state not found:', error);
			return null;
		}
	}
}

export default ApexService;
