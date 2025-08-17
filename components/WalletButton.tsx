'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import ClientOnly from './ClientOnly';

export default function WalletButton() {
	return (
		<ClientOnly
			fallback={
				<button className="!bg-purple-600 hover:!bg-purple-700 !text-white !px-4 !py-2 !rounded-lg !font-medium !text-sm !border-none">
					Connect Wallet
				</button>
			}
		>
			<WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 !text-white !px-4 !py-2 !rounded-lg !font-medium !text-sm !border-none" />
		</ClientOnly>
	);
}
