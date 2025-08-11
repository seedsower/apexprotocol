use anchor_lang::prelude::*;
use crate::math::constants::*;
use crate::state::perp_market::{PerpMarket, CommodityType, AMM, OracleSource};
use crate::optimization::parameter_optimizer::{ParameterOptimizer, OptimizedParameters};

/// Optimized commodity market configurations for Apex Protocol
/// Provides pre-configured market parameters with real-time optimization
/// for different commodity types including energy, metals, agriculture, and livestock derivatives.
/// All parameters are dynamically calculated using the parameter optimization framework.

#[derive(Clone, Copy, Debug)]
pub struct CommodityMarketConfig {
    pub market_index: u16,
    pub commodity_type: CommodityType,
    pub symbol: &'static str,
    pub oracle_source: OracleSource,
    pub oracle_address: &'static str,
    
    // Base market parameters
    pub base_asset_reserve: u128,
    pub quote_asset_reserve: u128,
    pub peg_multiplier: u128,
    
    // Optimized risk parameters
    pub margin_ratio_initial: u32,
    pub margin_ratio_maintenance: u32,
    pub liquidation_fee: u32,
    
    // Optimized funding parameters
    pub funding_rate_cap: i64,
    pub funding_rate_half_life: u64,
    
    // Optimized position and trading limits
    pub max_position_size: u64,
    pub min_order_size: u64,
    pub tick_size: u64,
    
    // Optimized oracle parameters
    pub oracle_confidence_threshold: u64,
    pub oracle_twap_period: u64,
    
    // Optimized commodity-specific adjustments
    pub seasonal_adjustment: i32,
    pub weather_sensitivity: u32,
    pub geopolitical_sensitivity: u32,
    
    // Market maker parameters
    pub amm_periodicity: i64,
    pub curve_update_intensity: u8,
    
    pub name: [u8; 32],
}

impl CommodityMarketConfig {
    /// Get optimized configuration for Natural Gas Token (NGT) perpetual market
    pub fn ngt_perp_config() -> Self {
        let optimized_params = ParameterOptimizer::get_optimized_parameters(CommodityType::Energy);
        
        CommodityMarketConfig {
            market_index: 0,
            commodity_type: CommodityType::Energy,
            symbol: "NGT-PERP",
            oracle_source: OracleSource::Pyth,
            oracle_address: "7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE", // Pyth Natural Gas price feed
            
            // Base market parameters
            base_asset_reserve: 1_000_000 * AMM_RESERVE_PRECISION,
            quote_asset_reserve: 3_000_000 * AMM_RESERVE_PRECISION, // $3.00 initial price
            peg_multiplier: 3_000_000, // $3.00
            
            // Optimized risk parameters for energy volatility
            margin_ratio_initial: optimized_params.margin_ratio_initial,
            margin_ratio_maintenance: optimized_params.margin_ratio_maintenance,
            liquidation_fee: optimized_params.liquidation_fee,
            
            // Optimized funding parameters
            funding_rate_cap: optimized_params.funding_rate_cap,
            funding_rate_half_life: 3600,      // 1 hour
            
            // Optimized position and trading limits
            max_position_size: optimized_params.max_position_size,
            min_order_size: 1 * BASE_PRECISION,
            tick_size: QUOTE_PRECISION / 1000,  // $0.001
            
            // Optimized oracle parameters
            oracle_confidence_threshold: optimized_params.oracle_confidence_threshold,
            oracle_twap_period: 300,            // 5 minutes
            
            // Optimized commodity-specific adjustments
            seasonal_adjustment: optimized_params.seasonal_multiplier,
            weather_sensitivity: optimized_params.weather_sensitivity,
            geopolitical_sensitivity: optimized_params.geopolitical_sensitivity,
            
            // Market maker parameters
            amm_periodicity: 3600,              // 1 hour
            curve_update_intensity: 100,
            
            name: *b"Natural Gas Token Perpetual\0\0\0\0\0",
        }
    }

    /// Get optimized configuration for Oil perpetual market
    pub fn oil_perp_config() -> Self {
        let optimized_params = ParameterOptimizer::get_optimized_parameters(CommodityType::Energy);
        
        CommodityMarketConfig {
            market_index: 1,
            commodity_type: CommodityType::Energy,
            symbol: "OIL-PERP",
            oracle_source: OracleSource::Pyth,
            oracle_address: "6NpdXrQEpmDZ3jZKmM2rhdmkd3H6QAk23j2x8bkXcHKA", // Pyth WTI Crude Oil
            
            base_asset_reserve: 500_000 * AMM_RESERVE_PRECISION,
            quote_asset_reserve: 37_500_000 * AMM_RESERVE_PRECISION, // $75.00 initial price
            peg_multiplier: 75_000_000, // $75.00
            
            // Optimized risk parameters
            margin_ratio_initial: optimized_params.margin_ratio_initial,
            margin_ratio_maintenance: optimized_params.margin_ratio_maintenance,
            liquidation_fee: optimized_params.liquidation_fee,
            
            // Optimized funding parameters
            funding_rate_cap: optimized_params.funding_rate_cap,
            funding_rate_half_life: 3600,
            
            // Optimized position limits
            max_position_size: optimized_params.max_position_size,
            min_order_size: 1 * BASE_PRECISION / 10, // 0.1 barrel
            tick_size: QUOTE_PRECISION / 100,   // $0.01
            
            // Optimized oracle parameters
            oracle_confidence_threshold: optimized_params.oracle_confidence_threshold,
            oracle_twap_period: 300,
            
            // Optimized commodity-specific adjustments
            seasonal_adjustment: optimized_params.seasonal_multiplier,
            weather_sensitivity: optimized_params.weather_sensitivity,
            geopolitical_sensitivity: optimized_params.geopolitical_sensitivity,
            
            amm_periodicity: 3600,
            curve_update_intensity: 100,
            
            name: *b"WTI Crude Oil Perpetual\0\0\0\0\0\0\0\0\0",
        }
    }

    /// Get optimized configuration for Gold perpetual market
    pub fn gold_perp_config() -> Self {
        let optimized_params = ParameterOptimizer::get_optimized_parameters(CommodityType::Metals);
        
        CommodityMarketConfig {
            market_index: 2,
            commodity_type: CommodityType::Metals,
            symbol: "GOLD-PERP",
            oracle_source: OracleSource::Pyth,
            oracle_address: "GVXRSBjFk6e6J3NbVPXohDJetcTjaeeuykUpbQF8UoMU", // Pyth Gold price feed
            
            base_asset_reserve: 100_000 * AMM_RESERVE_PRECISION,
            quote_asset_reserve: 200_000_000 * AMM_RESERVE_PRECISION, // $2,000 initial price
            peg_multiplier: 2_000_000_000, // $2,000
            
            // Optimized risk parameters for metals (lower volatility)
            margin_ratio_initial: optimized_params.margin_ratio_initial,
            margin_ratio_maintenance: optimized_params.margin_ratio_maintenance,
            liquidation_fee: optimized_params.liquidation_fee,
            
            // Optimized funding parameters
            funding_rate_cap: optimized_params.funding_rate_cap,
            funding_rate_half_life: 7200,      // 2 hours (longer for stable metals)
            
            // Optimized position limits
            max_position_size: optimized_params.max_position_size,
            min_order_size: 1 * BASE_PRECISION / 100, // 0.01 oz
            tick_size: QUOTE_PRECISION / 10,    // $0.10
            
            // Optimized oracle parameters
            oracle_confidence_threshold: optimized_params.oracle_confidence_threshold,
            oracle_twap_period: 600,            // 10 minutes (longer for stable assets)
            
            // Optimized commodity-specific adjustments
            seasonal_adjustment: optimized_params.seasonal_multiplier,
            weather_sensitivity: optimized_params.weather_sensitivity,
            geopolitical_sensitivity: optimized_params.geopolitical_sensitivity,
            
            amm_periodicity: 7200,              // 2 hours
            curve_update_intensity: 50,         // Lower intensity for stable metals
            
            name: *b"Gold Perpetual\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0",
        }
    }

    /// Get optimized configuration for Silver perpetual market
    pub fn silver_perp_config() -> Self {
        let optimized_params = ParameterOptimizer::get_optimized_parameters(CommodityType::Metals);
        
        CommodityMarketConfig {
            market_index: 3,
            commodity_type: CommodityType::Metals,
            symbol: "SILVER-PERP",
            oracle_source: OracleSource::Pyth,
            oracle_address: "4pUQS4Jo2dsfWzt3VgHXy3H6RYnEDd9p2BjyZvniqZQE", // Pyth Silver price feed
            
            base_asset_reserve: 1_000_000 * AMM_RESERVE_PRECISION,
            quote_asset_reserve: 25_000_000 * AMM_RESERVE_PRECISION, // $25.00 initial price
            peg_multiplier: 25_000_000, // $25.00
            
            // Optimized risk parameters
            margin_ratio_initial: optimized_params.margin_ratio_initial,
            margin_ratio_maintenance: optimized_params.margin_ratio_maintenance,
            liquidation_fee: optimized_params.liquidation_fee,
            
            // Optimized funding parameters
            funding_rate_cap: optimized_params.funding_rate_cap,
            funding_rate_half_life: 7200,
            
            // Optimized position limits
            max_position_size: optimized_params.max_position_size,
            min_order_size: 1 * BASE_PRECISION / 10, // 0.1 oz
            tick_size: QUOTE_PRECISION / 100,   // $0.01
            
            // Optimized oracle parameters
            oracle_confidence_threshold: optimized_params.oracle_confidence_threshold,
            oracle_twap_period: 600,
            
            // Optimized commodity-specific adjustments
            seasonal_adjustment: optimized_params.seasonal_multiplier,
            weather_sensitivity: optimized_params.weather_sensitivity,
            geopolitical_sensitivity: optimized_params.geopolitical_sensitivity,
            
            amm_periodicity: 7200,
            curve_update_intensity: 50,
            
            name: *b"Silver Perpetual\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0",
        }
    }

    /// Get optimized configuration for Wheat perpetual market
    pub fn wheat_perp_config() -> Self {
        let optimized_params = ParameterOptimizer::get_optimized_parameters(CommodityType::Agriculture);
        
        CommodityMarketConfig {
            market_index: 4,
            commodity_type: CommodityType::Agriculture,
            symbol: "WHEAT-PERP",
            oracle_source: OracleSource::Pyth,
            oracle_address: "GwzBgrXb4PG59zjce24SF2b9JXbLEjJJTBkmytuEZj1b", // Pyth Wheat price feed
            
            base_asset_reserve: 2_000_000 * AMM_RESERVE_PRECISION,
            quote_asset_reserve: 16_000_000 * AMM_RESERVE_PRECISION, // $8.00 initial price
            peg_multiplier: 8_000_000, // $8.00
            
            // Optimized risk parameters for agriculture (high volatility)
            margin_ratio_initial: optimized_params.margin_ratio_initial,
            margin_ratio_maintenance: optimized_params.margin_ratio_maintenance,
            liquidation_fee: optimized_params.liquidation_fee,
            
            // Optimized funding parameters
            funding_rate_cap: optimized_params.funding_rate_cap,
            funding_rate_half_life: 1800,      // 30 minutes (shorter for volatile agriculture)
            
            // Optimized position limits
            max_position_size: optimized_params.max_position_size,
            min_order_size: 1 * BASE_PRECISION, // 1 bushel
            tick_size: QUOTE_PRECISION / 1000,  // $0.001
            
            // Optimized oracle parameters
            oracle_confidence_threshold: optimized_params.oracle_confidence_threshold,
            oracle_twap_period: 180,            // 3 minutes (shorter for volatile assets)
            
            // Optimized commodity-specific adjustments
            seasonal_adjustment: optimized_params.seasonal_multiplier,
            weather_sensitivity: optimized_params.weather_sensitivity,
            geopolitical_sensitivity: optimized_params.geopolitical_sensitivity,
            
            amm_periodicity: 1800,              // 30 minutes
            curve_update_intensity: 200,        // Higher intensity for volatile agriculture
            
            name: *b"Wheat Perpetual\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0",
        }
    }

    /// Get optimized configuration for Corn perpetual market
    pub fn corn_perp_config() -> Self {
        let optimized_params = ParameterOptimizer::get_optimized_parameters(CommodityType::Agriculture);
        
        CommodityMarketConfig {
            market_index: 5,
            commodity_type: CommodityType::Agriculture,
            symbol: "CORN-PERP",
            oracle_source: OracleSource::Pyth,
            oracle_address: "Gnt27xtC473ZT2Mw5u8wZ68Z3gULkSTb5DuxJy7eJotD", // Pyth Corn price feed
            
            base_asset_reserve: 5_000_000 * AMM_RESERVE_PRECISION,
            quote_asset_reserve: 20_000_000 * AMM_RESERVE_PRECISION, // $4.00 initial price
            peg_multiplier: 4_000_000, // $4.00
            
            // Optimized risk parameters
            margin_ratio_initial: optimized_params.margin_ratio_initial,
            margin_ratio_maintenance: optimized_params.margin_ratio_maintenance,
            liquidation_fee: optimized_params.liquidation_fee,
            
            // Optimized funding parameters
            funding_rate_cap: optimized_params.funding_rate_cap,
            funding_rate_half_life: 1800,
            
            // Optimized position limits
            max_position_size: optimized_params.max_position_size,
            min_order_size: 1 * BASE_PRECISION, // 1 bushel
            tick_size: QUOTE_PRECISION / 1000,  // $0.001
            
            // Optimized oracle parameters
            oracle_confidence_threshold: optimized_params.oracle_confidence_threshold,
            oracle_twap_period: 180,
            
            // Optimized commodity-specific adjustments
            seasonal_adjustment: optimized_params.seasonal_multiplier,
            weather_sensitivity: optimized_params.weather_sensitivity,
            geopolitical_sensitivity: optimized_params.geopolitical_sensitivity,
            
            amm_periodicity: 1800,
            curve_update_intensity: 200,
            
            name: *b"Corn Perpetual\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0",
        }
    }

    /// Get optimized configuration for Cattle perpetual market
    pub fn cattle_perp_config() -> Self {
        let optimized_params = ParameterOptimizer::get_optimized_parameters(CommodityType::Livestock);
        
        CommodityMarketConfig {
            market_index: 6,
            commodity_type: CommodityType::Livestock,
            symbol: "CATTLE-PERP",
            oracle_source: OracleSource::Pyth,
            oracle_address: "Dp8VqL5CZBDqMFqS7VoHrTNL9MtjrQQpoxGGFaGFg8Wf", // Pyth Live Cattle price feed
            
            base_asset_reserve: 200_000 * AMM_RESERVE_PRECISION,
            quote_asset_reserve: 30_000_000 * AMM_RESERVE_PRECISION, // $150.00 initial price
            peg_multiplier: 150_000_000, // $150.00
            
            // Optimized risk parameters for livestock
            margin_ratio_initial: optimized_params.margin_ratio_initial,
            margin_ratio_maintenance: optimized_params.margin_ratio_maintenance,
            liquidation_fee: optimized_params.liquidation_fee,
            
            // Optimized funding parameters
            funding_rate_cap: optimized_params.funding_rate_cap,
            funding_rate_half_life: 3600,      // 1 hour
            
            // Optimized position limits
            max_position_size: optimized_params.max_position_size,
            min_order_size: 1 * BASE_PRECISION / 100, // 0.01 cwt (hundredweight)
            tick_size: QUOTE_PRECISION / 100,   // $0.01
            
            // Optimized oracle parameters
            oracle_confidence_threshold: optimized_params.oracle_confidence_threshold,
            oracle_twap_period: 300,            // 5 minutes
            
            // Optimized commodity-specific adjustments
            seasonal_adjustment: optimized_params.seasonal_multiplier,
            weather_sensitivity: optimized_params.weather_sensitivity,
            geopolitical_sensitivity: optimized_params.geopolitical_sensitivity,
            
            amm_periodicity: 3600,              // 1 hour
            curve_update_intensity: 100,
            
            name: *b"Live Cattle Perpetual\0\0\0\0\0\0\0\0\0\0\0",
        }
    }

    /// Get optimized configuration for Hogs perpetual market
    pub fn hogs_perp_config() -> Self {
        let optimized_params = ParameterOptimizer::get_optimized_parameters(CommodityType::Livestock);
        
        CommodityMarketConfig {
            market_index: 7,
            commodity_type: CommodityType::Livestock,
            symbol: "HOGS-PERP",
            oracle_source: OracleSource::Pyth,
            oracle_address: "9pG2T4xrKVs5dHmaFdxzxmCbYNrKHFdoKo8C8TJvKx2D", // Pyth Lean Hogs price feed
            
            base_asset_reserve: 300_000 * AMM_RESERVE_PRECISION,
            quote_asset_reserve: 24_000_000 * AMM_RESERVE_PRECISION, // $80.00 initial price
            peg_multiplier: 80_000_000, // $80.00
            
            // Optimized risk parameters
            margin_ratio_initial: optimized_params.margin_ratio_initial,
            margin_ratio_maintenance: optimized_params.margin_ratio_maintenance,
            liquidation_fee: optimized_params.liquidation_fee,
            
            // Optimized funding parameters
            funding_rate_cap: optimized_params.funding_rate_cap,
            funding_rate_half_life: 3600,
            
            // Optimized position limits
            max_position_size: optimized_params.max_position_size,
            min_order_size: 1 * BASE_PRECISION / 100, // 0.01 cwt
            tick_size: QUOTE_PRECISION / 100,   // $0.01
            
            // Optimized oracle parameters
            oracle_confidence_threshold: optimized_params.oracle_confidence_threshold,
            oracle_twap_period: 300,
            
            // Optimized commodity-specific adjustments
            seasonal_adjustment: optimized_params.seasonal_multiplier,
            weather_sensitivity: optimized_params.weather_sensitivity,
            geopolitical_sensitivity: optimized_params.geopolitical_sensitivity,
            
            amm_periodicity: 3600,
            curve_update_intensity: 100,
            
            name: *b"Lean Hogs Perpetual\0\0\0\0\0\0\0\0\0\0\0\0\0",
        }
    }

    /// Get all optimized commodity market configurations
    pub fn get_all_configs() -> Vec<CommodityMarketConfig> {
        vec![
            Self::ngt_perp_config(),
            Self::oil_perp_config(),
            Self::gold_perp_config(),
            Self::silver_perp_config(),
            Self::wheat_perp_config(),
            Self::corn_perp_config(),
            Self::cattle_perp_config(),
            Self::hogs_perp_config(),
        ]
    }

    /// Get configuration by market index
    pub fn get_config_by_index(market_index: u16) -> Option<CommodityMarketConfig> {
        match market_index {
            0 => Some(Self::ngt_perp_config()),
            1 => Some(Self::oil_perp_config()),
            2 => Some(Self::gold_perp_config()),
            3 => Some(Self::silver_perp_config()),
            4 => Some(Self::wheat_perp_config()),
            5 => Some(Self::corn_perp_config()),
            6 => Some(Self::cattle_perp_config()),
            7 => Some(Self::hogs_perp_config()),
            _ => None,
        }
    }

    /// Get configuration by commodity type
    pub fn get_configs_by_commodity_type(commodity_type: CommodityType) -> Vec<CommodityMarketConfig> {
        Self::get_all_configs()
            .into_iter()
            .filter(|config| config.commodity_type == commodity_type)
            .collect()
    }

    /// Apply configuration to a PerpMarket
    pub fn apply_to_market(&self, market: &mut PerpMarket) -> Result<()> {
        market.market_index = self.market_index;
        market.commodity_type = self.commodity_type;
        market.oracle_source = self.oracle_source;
        
        // Apply optimized risk parameters
        market.margin_ratio_initial = self.margin_ratio_initial;
        market.margin_ratio_maintenance = self.margin_ratio_maintenance;
        market.liquidator_fee = self.liquidation_fee;
        
        // Apply optimized funding parameters
        market.funding.funding_rate_cap = self.funding_rate_cap;
        
        // Apply optimized position limits
        market.max_base_asset_reserve = self.max_position_size;
        
        // Apply optimized oracle parameters
        market.oracle_confidence_threshold = self.oracle_confidence_threshold;
        
        // Apply optimized commodity-specific adjustments
        market.seasonal_adjustment = self.seasonal_adjustment;
        market.weather_sensitivity = self.weather_sensitivity;
        market.geopolitical_sensitivity = self.geopolitical_sensitivity;
        
        // Apply AMM parameters
        market.amm.base_asset_reserve = self.base_asset_reserve;
        market.amm.quote_asset_reserve = self.quote_asset_reserve;
        market.amm.peg_multiplier = self.peg_multiplier;
        market.amm.periodicity = self.amm_periodicity;
        market.amm.curve_update_intensity = self.curve_update_intensity;
        
        market.name = self.name;
        
        Ok(())
    }
}

/// Helper functions for market initialization and management

impl CommodityMarketConfig {
    /// Calculate optimal AMM reserves based on target price and liquidity
    pub fn calculate_optimal_reserves(
        target_price: u64,
        target_liquidity: u64,
        commodity_type: CommodityType,
    ) -> (u128, u128) {
        // Base liquidity multiplier by commodity type
        let liquidity_multiplier = match commodity_type {
            CommodityType::Energy => 2.0,      // Higher liquidity for energy
            CommodityType::Metals => 3.0,      // Highest liquidity for metals
            CommodityType::Agriculture => 1.5, // Medium liquidity for agriculture
            CommodityType::Livestock => 1.0,   // Base liquidity for livestock
        };
        
        let adjusted_liquidity = (target_liquidity as f64 * liquidity_multiplier) as u64;
        let base_reserve = (adjusted_liquidity as u128 * AMM_RESERVE_PRECISION) / target_price as u128;
        let quote_reserve = adjusted_liquidity as u128 * AMM_RESERVE_PRECISION;
        
        (base_reserve as u128, quote_reserve as u128)
    }
    
    /// Get recommended tick size based on price level and commodity type
    pub fn get_recommended_tick_size(price: u64, commodity_type: CommodityType) -> u64 {
        let base_tick = match commodity_type {
            CommodityType::Energy => {
                if price > 100 * QUOTE_PRECISION {
                    QUOTE_PRECISION / 100  // $0.01 for high-priced energy
                } else {
                    QUOTE_PRECISION / 1000 // $0.001 for low-priced energy
                }
            },
            CommodityType::Metals => {
                if price > 1000 * QUOTE_PRECISION {
                    QUOTE_PRECISION / 10   // $0.10 for precious metals
                } else {
                    QUOTE_PRECISION / 100  // $0.01 for base metals
                }
            },
            CommodityType::Agriculture => QUOTE_PRECISION / 1000, // $0.001 for agriculture
            CommodityType::Livestock => QUOTE_PRECISION / 100,    // $0.01 for livestock
        };
        
        base_tick
    }
    
    /// Get recommended minimum order size based on commodity type
    pub fn get_recommended_min_order_size(commodity_type: CommodityType) -> u64 {
        match commodity_type {
            CommodityType::Energy => BASE_PRECISION,           // 1 unit
            CommodityType::Metals => BASE_PRECISION / 100,     // 0.01 oz
            CommodityType::Agriculture => BASE_PRECISION,      // 1 bushel
            CommodityType::Livestock => BASE_PRECISION / 100,  // 0.01 cwt
        }
    }
}

/// Market performance metrics for optimization feedback
#[derive(Clone, Copy, Debug)]
pub struct MarketPerformanceMetrics {
    pub market_index: u16,
    pub total_volume_24h: u64,
    pub average_spread: u32,           // Basis points
    pub liquidation_count_24h: u32,
    pub funding_rate_efficiency: u32,  // 0-10000 (higher is better)
    pub oracle_deviation_avg: u32,     // Basis points
    pub risk_adjusted_return: i32,     // Basis points (can be negative)
}

impl MarketPerformanceMetrics {
    /// Calculate overall performance score
    pub fn calculate_performance_score(&self) -> u32 {
        let volume_score = (self.total_volume_24h / 1_000_000).min(10000) as u32;
        let spread_score = if self.average_spread < 50 { 10000 } else { 10000 - (self.average_spread - 50) * 100 };
        let liquidation_score = if self.liquidation_count_24h < 10 { 10000 } else { 10000 - (self.liquidation_count_24h - 10) * 100 };
        let oracle_score = if self.oracle_deviation_avg < 100 { 10000 } else { 10000 - (self.oracle_deviation_avg - 100) * 50 };
        
        // Weighted average
        (volume_score * 3 + spread_score * 2 + liquidation_score * 2 + self.funding_rate_efficiency + oracle_score * 2) / 10
    }
}
