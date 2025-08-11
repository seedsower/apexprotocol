import { useState, useEffect, useCallback } from 'react';
import { useDrift } from '../providers/DriftProvider';
import { UIPosition } from '../types';

export interface UsePositionsResult {
	positions: UIPosition[];
	loading: boolean;
	error: string | null;
	refetch: () => void;
	getTotalUnrealizedPnl: () => number;
	getTotalNotionalValue: () => number;
	getPositionByMarket: (marketIndex: number) => UIPosition | undefined;
}

export const usePositions = (): UsePositionsResult => {
	const { driftService, state, isReady } = useDrift();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Fetch positions
	const refetch = useCallback(() => {
		if (!driftService || !isReady) return;

		try {
			setLoading(true);
			setError(null);

			// Get positions from DriftService state
			const _positions = state.positions;

			setLoading(false);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Failed to fetch positions'
			);
			setLoading(false);
		}
	}, [driftService, isReady, state.positions]);

	// Auto-fetch when service becomes ready
	useEffect(() => {
		if (isReady) {
			refetch();
		}
	}, [isReady, refetch]);

	// Listen for user account changes and position updates
	useEffect(() => {
		if (!driftService || !isReady) return;

		const handleUserUpdate = () => {
			console.log('usePositions: User update detected, refetching...');
			refetch();
		};

		const handlePositionUpdate = () => {
			console.log('usePositions: Position update detected, refetching...');
			refetch();
		};

		// Listen to DriftService events
		driftService.on('userConnected', handleUserUpdate);
		driftService.on('stateChanged', handlePositionUpdate);

		// Real-time position updates (every 10 seconds instead of 5 to reduce load)
		const interval = setInterval(() => {
			if (isReady && driftService) {
				console.log('usePositions: Periodic refetch...');
				refetch();
			}
		}, 10000); // Increased from 5000 to 10000

		return () => {
			driftService.off('userConnected', handleUserUpdate);
			driftService.off('stateChanged', handlePositionUpdate);
			clearInterval(interval);
		};
	}, [driftService, isReady, refetch]);

	// Calculate total unrealized PnL
	const getTotalUnrealizedPnl = useCallback((): number => {
		return state.positions.reduce((total, position) => {
			return total + position.unrealizedPnl;
		}, 0);
	}, [state.positions]);

	// Calculate total notional value
	const getTotalNotionalValue = useCallback((): number => {
		return state.positions.reduce((total, position) => {
			return total + position.notionalValue;
		}, 0);
	}, [state.positions]);

	// Get position by market index
	const getPositionByMarket = useCallback(
		(marketIndex: number): UIPosition | undefined => {
			return state.positions.find(
				(position) => position.marketIndex === marketIndex
			);
		},
		[state.positions]
	);

	return {
		positions: state.positions,
		loading: loading || state.loading,
		error: error || state.error,
		refetch,
		getTotalUnrealizedPnl,
		getTotalNotionalValue,
		getPositionByMarket,
	};
};
