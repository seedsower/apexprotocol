import { EventEmitter } from 'events';
import { AppConfig, UIMarketData } from '../types';

export interface IDriftService extends EventEmitter {
	initialize(wallet: any): Promise<void>;
	fetchMarkets(): Promise<UIMarketData[]>;
	createUser(): Promise<void>;
	disconnect(): void;

	// Optional methods that may not be implemented in all services
	getUserPositions?(): Promise<any[]> | any[];
	placeOrder?(orderData: any): Promise<void> | Promise<string>;
	cancelAllOrders?(): Promise<void> | Promise<string>;
	getTokenBalance?(mintAddress: string): Promise<number>;
	placeSpotOrder?(
		marketIndex: number,
		direction: 'buy' | 'sell',
		amount: number,
		price?: number
	): Promise<void>;
}

export interface DriftServiceConstructor {
	new (config: AppConfig): IDriftService;
}
