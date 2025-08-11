import { useState, useEffect, useMemo } from 'react';
import { useDrift } from '../providers/DriftProvider';
import { UIMarketData, MarketSelectorState } from '../types';

export interface UseMarketsResult {
	markets: UIMarketData[];
	filteredMarkets: UIMarketData[];
	loading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
	selectorState: MarketSelectorState;
	updateSelectorState: (updates: Partial<MarketSelectorState>) => void;
	selectMarket: (market: UIMarketData) => void;
}

export const useMarkets = (): UseMarketsResult => {
	const { driftService, state } = useDrift();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Market selector state
	const [selectorState, setSelectorState] = useState<MarketSelectorState>({
		selectedMarket: null,
		searchTerm: '',
		marketType: 'all',
		sortBy: 'symbol',
		sortDirection: 'asc',
	});

	// Fetch markets data
	const refetch = async () => {
		if (!driftService) return;

		try {
			setLoading(true);
			setError(null);
			await driftService.fetchMarkets();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to fetch markets');
		} finally {
			setLoading(false);
		}
	};

	// Auto-fetch on service ready
	useEffect(() => {
		if (driftService && state.initialized) {
			refetch();
		}
	}, [driftService, state.initialized]);

	// Periodic refresh (every 30 seconds)
	useEffect(() => {
		if (!driftService || !state.initialized) return;

		const interval = setInterval(() => {
			refetch();
		}, 30000);

		return () => clearInterval(interval);
	}, [driftService, state.initialized]);

	// Filter and sort markets
	const filteredMarkets = useMemo(() => {
		let filtered = state.markets;

		// Filter by search term
		if (selectorState.searchTerm) {
			const searchLower = selectorState.searchTerm.toLowerCase();
			filtered = filtered.filter(
				(market) =>
					market.symbol.toLowerCase().includes(searchLower) ||
					market.baseAssetSymbol.toLowerCase().includes(searchLower)
			);
		}

		// Filter by market type
		if (selectorState.marketType !== 'all') {
			filtered = filtered.filter(
				(market) => market.marketType === selectorState.marketType
			);
		}

		// Sort markets
		filtered.sort((a, b) => {
			const direction = selectorState.sortDirection === 'asc' ? 1 : -1;

			switch (selectorState.sortBy) {
				case 'symbol':
					return direction * a.symbol.localeCompare(b.symbol);
				case 'volume':
					return direction * (a.volume24h - b.volume24h);
				case 'priceChange':
					return direction * (a.priceChange24h - b.priceChange24h);
				default:
					return 0;
			}
		});

		return filtered;
	}, [state.markets, selectorState]);

	// Update selector state
	const updateSelectorState = (updates: Partial<MarketSelectorState>) => {
		setSelectorState((prev) => ({ ...prev, ...updates }));
	};

	// Select market
	const selectMarket = (market: UIMarketData) => {
		setSelectorState((prev) => ({ ...prev, selectedMarket: market }));
	};

	return {
		markets: state.markets,
		filteredMarkets,
		loading: loading || state.loading,
		error: error || state.error,
		refetch,
		selectorState,
		updateSelectorState,
		selectMarket,
	};
};
