'use client';

import React, { useEffect, useRef, memo } from 'react';
import { UIMarketData } from '../types';

interface TradingViewWidgetProps {
	selectedMarket: UIMarketData | null;
	theme?: 'light' | 'dark';
	height?: number;
}

declare global {
	interface Window {
		TradingView: any;
	}
}

function TradingViewWidget({
	selectedMarket,
	theme = 'dark',
	height = 500,
}: TradingViewWidgetProps) {
	const container = useRef<HTMLDivElement>(null);
	const scriptRef = useRef<HTMLScriptElement | null>(null);

	// Map commodity symbols to TradingView symbols
	const getSymbolMapping = (marketSymbol: string): string => {
		const symbolMap: Record<string, string> = {
			// Energy
			'NGT-USDC': 'NYMEX:NG1!', // Natural Gas Futures
			'WTI-USDC': 'NYMEX:CL1!', // Crude Oil WTI Futures
			'BRENT-USDC': 'ICE:BRN1!', // Brent Oil Futures

			// Metals
			'GOLD-USDC': 'COMEX:GC1!', // Gold Futures
			'SILVER-USDC': 'COMEX:SI1!', // Silver Futures
			'COPPER-USDC': 'COMEX:HG1!', // Copper Futures
			'ALUMINUM-USDC': 'LME:AH1!', // Aluminum Futures
			'PLATINUM-USDC': 'NYMEX:PL1!', // Platinum Futures
			'PALLADIUM-USDC': 'NYMEX:PA1!', // Palladium Futures

			// Agriculture
			'WHEAT-USDC': 'CBOT:ZW1!', // Wheat Futures
			'CORN-USDC': 'CBOT:ZC1!', // Corn Futures
			'SOYBEANS-USDC': 'CBOT:ZS1!', // Soybeans Futures
			'RICE-USDC': 'CBOT:ZR1!', // Rice Futures

			// Livestock
			'CATTLE-USDC': 'CME:LE1!', // Live Cattle Futures
			'HOGS-USDC': 'CME:HE1!', // Lean Hogs Futures

			// Softs
			'COFFEE-USDC': 'ICE:KC1!', // Coffee Futures
			'SUGAR-USDC': 'ICE:SB1!', // Sugar Futures
			'COCOA-USDC': 'ICE:CC1!', // Cocoa Futures
			'COTTON-USDC': 'ICE:CT1!', // Cotton Futures
			'ORANGE_JUICE-USDC': 'ICE:OJ1!', // Orange Juice Futures

			// Indices
			'DJP-USDC': 'AMEX:DJP', // DJ Commodity Index Fund
			'GSG-USDC': 'AMEX:GSG', // iShares S&P GSCI Commodity
			'CRB-USDC': 'AMEX:DJP', // CRB Index (using DJP as proxy)
		};

		return symbolMap[marketSymbol] || 'NYMEX:NG1!'; // Default to Natural Gas
	};

	useEffect(() => {
		if (!container.current) return;

		// Remove existing script if any
		if (scriptRef.current) {
			scriptRef.current.remove();
		}

		// Clear container
		container.current.innerHTML = '';

		// Create new script element
		const script = document.createElement('script');
		script.src =
			'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
		script.type = 'text/javascript';
		script.async = true;

		const symbol = selectedMarket
			? getSymbolMapping(selectedMarket.symbol)
			: 'NYMEX:NG1!';

		script.innerHTML = JSON.stringify({
			autosize: false,
			width: '100%',
			height: height,
			symbol: symbol,
			interval: 'D',
			timezone: 'Etc/UTC',
			theme: 'dark',
			style: '1',
			locale: 'en',
			enable_publishing: false,
			backgroundColor: '#000000',
			gridColor: '#1f1f1f',
			hide_top_toolbar: false,
			hide_legend: false,
			save_image: false,
			container_id: 'tradingview_chart',
			studies: ['Volume@tv-basicstudies', 'MACD@tv-basicstudies'],
			show_popup_button: true,
			popup_width: '1000',
			popup_height: '650',
			no_referral_id: true,
			withdateranges: true,
			hide_side_toolbar: false,
			allow_symbol_change: true,
			details: true,
			hotlist: true,
			calendar: true,
			studies_overrides: {},
			overrides: {
				'paneProperties.background': '#000000',
				'paneProperties.vertGridProperties.color': '#1f1f1f',
				'paneProperties.horzGridProperties.color': '#1f1f1f',
				'symbolWatermarkProperties.transparency': 90,
				'scalesProperties.textColor': '#9ca3af',
				'mainSeriesProperties.candleStyle.upColor': '#10b981',
				'mainSeriesProperties.candleStyle.downColor': '#ef4444',
				'mainSeriesProperties.candleStyle.drawWick': true,
				'mainSeriesProperties.candleStyle.drawBorder': true,
				'mainSeriesProperties.candleStyle.borderColor': '#6b7280',
				'mainSeriesProperties.candleStyle.borderUpColor': '#10b981',
				'mainSeriesProperties.candleStyle.borderDownColor': '#ef4444',
				'mainSeriesProperties.candleStyle.wickUpColor': '#10b981',
				'mainSeriesProperties.candleStyle.wickDownColor': '#ef4444',
				volumePaneSize: 'medium',
			},
			enabled_features: [
				'study_templates',
				'use_localstorage_for_settings',
				'save_chart_properties_to_local_storage',
				'chart_property_page_style',
				'disable_resolution_rebuild',
				'chart_crosshair_menu',
				'charting_library_debug_mode',
				'chart_template',
				'study_on_study',
				'scales_date_format',
			],
			disabled_features: [
				'use_localstorage_for_settings',
				'volume_force_overlay',
				'create_volume_indicator_by_default',
			],
			charts_storage_url: 'https://saveload.tradingview.com',
			charts_storage_api_version: '1.1',
			client_id: 'tradingview.com',
			user_id: 'public_user_id',
		});

		container.current.appendChild(script);
		scriptRef.current = script;

		return () => {
			if (scriptRef.current) {
				scriptRef.current.remove();
			}
		};
	}, [selectedMarket, theme, height]);

	return (
		<div className="w-full h-full bg-black rounded-lg overflow-hidden">
			{/* Chart Header */}
			<div className="flex items-center justify-between p-4 border-b border-gray-800 bg-black">
				<div className="flex items-center space-x-4">
					<h3 className="text-lg font-semibold text-white">
						{selectedMarket ? selectedMarket.symbol : 'NGT-USDC'} Chart
					</h3>
					<div className="flex items-center space-x-2">
						<span className="text-sm text-gray-400">Powered by</span>
						<span className="text-sm font-medium text-blue-400">
							TradingView
						</span>
					</div>
				</div>

				{selectedMarket && (
					<div className="flex items-center space-x-4">
						<div className="text-right">
							<div className="text-lg font-bold text-white">
								${selectedMarket.lastPrice.toFixed(2)}
							</div>
							<div
								className={`text-sm ${
									selectedMarket.priceChange24h >= 0
										? 'text-green-400'
										: 'text-red-400'
								}`}
							>
								{selectedMarket.priceChange24h >= 0 ? '+' : ''}
								{selectedMarket.priceChange24h.toFixed(2)}%
							</div>
						</div>
					</div>
				)}
			</div>

			{/* TradingView Widget Container */}
			<div
				ref={container}
				id="tradingview_widget"
				className="w-full h-full bg-black tradingview-dark-override"
				style={
					{
						backgroundColor: '#000000',
						filter: 'invert(1) hue-rotate(180deg)',
						'--tv-color-platform-background': '#000000',
						'--tv-color-pane-background': '#000000',
					} as React.CSSProperties
				}
			>
				{/* Loading State */}
				<div className="w-full h-full flex items-center justify-center bg-black">
					<div className="text-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
						<div className="text-gray-400 text-sm">
							Loading TradingView Chart...
						</div>
						<div className="text-gray-500 text-xs mt-1">
							{selectedMarket
								? `Loading ${selectedMarket.symbol} data`
								: 'Loading NGT-USDC data'}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default memo(TradingViewWidget);
