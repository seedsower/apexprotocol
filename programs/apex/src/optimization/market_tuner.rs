// use anchor_lang::prelude::*; // Commented out unused import
use crate::math::constants::*;
use crate::state::perp_market::{PerpMarket, CommodityType};
use crate::optimization::parameter_optimizer::{ParameterOptimizer, OptimizedParameters};
use crate::optimization::risk_calculator::{RiskCalculator, MarketRisk, RiskMetrics};

/// Real-time market parameter tuning system for Apex Protocol
/// Automatically adjusts market parameters based on current market conditions,
/// risk levels, and performance metrics to maintain optimal trading environment.

#[derive(Clone, Copy, Debug)]
pub struct MarketTuningConfig {
    pub auto_tuning_enabled: bool,
    pub tuning_frequency: u64,          // Seconds between tuning cycles
    pub max_adjustment_per_cycle: u32,  // Max % change per tuning cycle
    pub volatility_lookback_period: u64, // Seconds of price history to analyze
    pub risk_threshold_adjustment: u32,  // Risk level triggering adjustments
}

impl Default for MarketTuningConfig {
    fn default() -> Self {
        MarketTuningConfig {
            auto_tuning_enabled: true,
            tuning_frequency: 3600,        // 1 hour
            max_adjustment_per_cycle: 500, // 5% max change per hour
            volatility_lookback_period: 86400, // 24 hours
            risk_threshold_adjustment: 6000,   // 60% risk threshold
        }
    }
}

#[derive(Clone, Copy, Debug)]
pub struct TuningMetrics {
    pub last_tuning_timestamp: i64,
    pub adjustments_made: u32,
    pub performance_score: u32,        // 0-10000 (higher is better)
    pub stability_score: u32,          // 0-10000 (higher is more stable)
    pub efficiency_score: u32,         // 0-10000 (higher is more efficient)
}

impl Default for TuningMetrics {
    fn default() -> Self {
        TuningMetrics {
            last_tuning_timestamp: 0,
            adjustments_made: 0,
            performance_score: 7500,      // Start with good performance
            stability_score: 8000,        // Start with good stability
            efficiency_score: 7000,       // Start with decent efficiency
        }
    }
}

/// Market tuner implementation
pub struct MarketTuner;

impl MarketTuner {
    /// Perform comprehensive market parameter tuning
    pub fn tune_market_parameters(
        market: &mut PerpMarket,
        recent_trades: &[(u64, u64, i64)], // (price, volume, timestamp)
        current_positions: &[(i64, u64)],   // (size, entry_price)
        total_collateral: u64,
        config: &MarketTuningConfig,
        metrics: &mut TuningMetrics,
        current_timestamp: i64,
    ) -> std::result::Result<OptimizedParameters, &'static str> {
        // Check if tuning is needed
        if !config.auto_tuning_enabled {
            return Ok(ParameterOptimizer::get_optimized_parameters(market.commodity_type));
        }
        
        if current_timestamp - metrics.last_tuning_timestamp < config.tuning_frequency as i64 {
            return Ok(ParameterOptimizer::get_optimized_parameters(market.commodity_type));
        }
        
        // Analyze current market conditions
        let market_risk = Self::analyze_market_conditions(recent_trades, market.commodity_type);
        
        // Calculate portfolio risk
        let portfolio_risk = Self::calculate_portfolio_risk_simplified(current_positions, total_collateral);
        
        // Get current optimized parameters
        let current_params = ParameterOptimizer::get_optimized_parameters(market.commodity_type); // Removed mut as it's not needed
        
        // Apply dynamic adjustments based on market conditions
        let adjusted_params = Self::apply_dynamic_adjustments(
            &current_params,
            &market_risk,
            &portfolio_risk,
            config,
        )?;
        
        // Validate adjustments don't exceed maximum change per cycle
        let final_params = Self::limit_parameter_changes(
            &current_params,
            &adjusted_params,
            config.max_adjustment_per_cycle,
        );
        
        // Update performance metrics
        Self::update_performance_metrics(
            metrics,
            &market_risk,
            &portfolio_risk,
            current_timestamp,
        );
        
        // Update market parameters
        Self::apply_parameters_to_market(market, &final_params)?;
        
        metrics.last_tuning_timestamp = current_timestamp;
        metrics.adjustments_made += 1;
        
        Ok(final_params)
    }
    
    /// Analyze current market conditions
    fn analyze_market_conditions(
        recent_trades: &[(u64, u64, i64)],
        commodity_type: CommodityType,
    ) -> MarketRisk {
        // Convert trades to format expected by RiskCalculator
        let price_volume_trades: Vec<(u64, u64)> = recent_trades
            .iter()
            .map(|&(price, volume, _)| (price, volume))
            .collect();
        
        if price_volume_trades.is_empty() {
            return MarketRisk {
                current_volatility: 300, // Default 3%
                volatility_trend: 0,
                liquidity_depth: 1_000_000 * QUOTE_PRECISION,
                bid_ask_spread: 100, // 1%
                oracle_deviation: 50, // 0.5%
            };
        }
        
        // Use the last price as current price and calculate oracle price
        let current_price = price_volume_trades.last().unwrap().0;
        let oracle_price = current_price; // Simplified - in real implementation, get from oracle
        
        RiskCalculator::calculate_market_risk(
            commodity_type,
            current_price,
            oracle_price,
            &price_volume_trades,
        )
    }
    
    /// Calculate simplified portfolio risk
    fn calculate_portfolio_risk_simplified(
        positions: &[(i64, u64)],
        total_collateral: u64,
    ) -> RiskMetrics {
        let mut total_notional = 0u64;
        let mut max_position = 0u64;
        
        for &(size, price) in positions {
            let notional = (size.abs() as u64 * price) / PRICE_PRECISION;
            total_notional += notional;
            max_position = max_position.max(notional);
        }
        
        let concentration_risk = if total_notional > 0 {
            ((max_position * 10000) / total_notional) as u32
        } else {
            0
        };
        
        let leverage = if total_collateral > 0 {
            ((total_notional * 10000) / total_collateral) as u32
        } else {
            0
        };
        
        RiskMetrics {
            portfolio_var: total_notional / 20, // Simplified VaR (5% of notional)
            expected_shortfall: total_notional / 15, // Simplified ES
            concentration_risk,
            liquidity_risk: 3000, // Default medium liquidity risk
            correlation_risk: 2000, // Default low correlation risk
            systemic_risk: leverage.min(10000), // Use leverage as systemic risk proxy
        }
    }
    
    /// Apply dynamic adjustments based on market conditions
    fn apply_dynamic_adjustments(
        base_params: &OptimizedParameters,
        market_risk: &MarketRisk,
        portfolio_risk: &RiskMetrics,
        config: &MarketTuningConfig,
    ) -> std::result::Result<OptimizedParameters, &'static str> {
        let mut adjusted_params = *base_params;
        
        // Adjust margin requirements based on volatility
        if market_risk.current_volatility > 500 { // > 5% volatility
            let volatility_multiplier = 11000 + (market_risk.current_volatility - 500) * 2; // +10% base + 2x excess
            adjusted_params.margin_ratio_initial = (adjusted_params.margin_ratio_initial * volatility_multiplier / 10000).min(2500);
            adjusted_params.margin_ratio_maintenance = (adjusted_params.margin_ratio_maintenance * volatility_multiplier / 10000).min(2000);
        }
        
        // Adjust funding rate cap based on oracle deviation
        if market_risk.oracle_deviation > 200 { // > 2% deviation
            let deviation_multiplier = 11000 + market_risk.oracle_deviation * 5; // +10% base + 5x deviation
            adjusted_params.funding_rate_cap = (adjusted_params.funding_rate_cap * deviation_multiplier as i64 / 10000).min(1000);
        }
        
        // Adjust position limits based on liquidity
        if market_risk.liquidity_depth < 500_000 * QUOTE_PRECISION { // Low liquidity
            adjusted_params.max_position_size = (adjusted_params.max_position_size * 7500 / 10000).max(100_000 * BASE_PRECISION);
        }
        
        // Adjust oracle confidence based on bid-ask spread
        if market_risk.bid_ask_spread > 200 { // > 2% spread
            let spread_adjustment = 8000 - (market_risk.bid_ask_spread - 200) * 10; // Tighter confidence for wide spreads
            adjusted_params.oracle_confidence_threshold = (adjusted_params.oracle_confidence_threshold * spread_adjustment as u64 / 10000).max(QUOTE_PRECISION / 1000);
        }
        
        // Adjust liquidation fee based on systemic risk
        if portfolio_risk.systemic_risk > config.risk_threshold_adjustment {
            let risk_multiplier = 10000 + (portfolio_risk.systemic_risk - config.risk_threshold_adjustment) * 2;
            adjusted_params.liquidation_fee = (adjusted_params.liquidation_fee * risk_multiplier / 10000).min(500);
        }
        
        // Validate parameters
        if let Err(_) = ParameterOptimizer::validate_parameters(&adjusted_params) {
            return Err("Parameter validation failed");
        }
        
        Ok(adjusted_params)
    }
    
    /// Limit parameter changes to maximum allowed per cycle
    fn limit_parameter_changes(
        current_params: &OptimizedParameters,
        target_params: &OptimizedParameters,
        max_change_bps: u32,
    ) -> OptimizedParameters {
        let mut limited_params = *current_params;
        
        // Limit margin ratio initial
        limited_params.margin_ratio_initial = Self::limit_change(
            current_params.margin_ratio_initial,
            target_params.margin_ratio_initial,
            max_change_bps,
        );
        
        // Limit margin ratio maintenance
        limited_params.margin_ratio_maintenance = Self::limit_change(
            current_params.margin_ratio_maintenance,
            target_params.margin_ratio_maintenance,
            max_change_bps,
        );
        
        // Limit liquidation fee
        limited_params.liquidation_fee = Self::limit_change(
            current_params.liquidation_fee,
            target_params.liquidation_fee,
            max_change_bps,
        );
        
        // Limit funding rate cap (signed)
        limited_params.funding_rate_cap = Self::limit_change_signed(
            current_params.funding_rate_cap,
            target_params.funding_rate_cap,
            max_change_bps,
        );
        
        // Limit max position size
        limited_params.max_position_size = Self::limit_change_u64(
            current_params.max_position_size,
            target_params.max_position_size,
            max_change_bps,
        );
        
        // Limit oracle confidence threshold
        limited_params.oracle_confidence_threshold = Self::limit_change_u64(
            current_params.oracle_confidence_threshold,
            target_params.oracle_confidence_threshold,
            max_change_bps,
        );
        
        limited_params
    }
    
    /// Limit change for u32 values
    fn limit_change(current: u32, target: u32, max_change_bps: u32) -> u32 {
        let max_change = (current * max_change_bps) / 10000;
        
        if target > current {
            (current + max_change).min(target)
        } else {
            (current - max_change.min(current)).max(target)
        }
    }
    
    /// Limit change for i64 values
    fn limit_change_signed(current: i64, target: i64, max_change_bps: u32) -> i64 {
        let max_change = (current.abs() * max_change_bps as i64) / 10000;
        
        if target > current {
            (current + max_change).min(target)
        } else {
            (current - max_change).max(target)
        }
    }
    
    /// Limit change for u64 values
    fn limit_change_u64(current: u64, target: u64, max_change_bps: u32) -> u64 {
        let max_change = (current * max_change_bps as u64) / 10000;
        
        if target > current {
            (current + max_change).min(target)
        } else {
            (current - max_change.min(current)).max(target)
        }
    }
    
    /// Update performance metrics based on current conditions
    fn update_performance_metrics(
        metrics: &mut TuningMetrics,
        market_risk: &MarketRisk,
        _portfolio_risk: &RiskMetrics,
        _current_timestamp: i64,
    ) {
        // Calculate performance score based on market efficiency
        let efficiency_factor = if market_risk.bid_ask_spread < 100 { // < 1% spread
            10000
        } else if market_risk.bid_ask_spread < 200 { // < 2% spread
            8000
        } else {
            6000
        };
        
        // Calculate stability score based on volatility
        let stability_factor = if market_risk.current_volatility < 200 { // < 2% volatility
            10000
        } else if market_risk.current_volatility < 400 { // < 4% volatility
            8000
        } else {
            6000
        };
        
        // Calculate efficiency score based on oracle deviation
        let oracle_efficiency = if market_risk.oracle_deviation < 50 { // < 0.5% deviation
            10000
        } else if market_risk.oracle_deviation < 100 { // < 1% deviation
            8000
        } else {
            6000
        };
        
        // Update metrics with exponential moving average
        let alpha = 2000; // 20% weight for new data
        metrics.performance_score = (metrics.performance_score * (10000 - alpha) + efficiency_factor * alpha) / 10000;
        metrics.stability_score = (metrics.stability_score * (10000 - alpha) + stability_factor * alpha) / 10000;
        metrics.efficiency_score = (metrics.efficiency_score * (10000 - alpha) + oracle_efficiency * alpha) / 10000;
    }
    
    /// Apply optimized parameters to market
    fn apply_parameters_to_market(
        market: &mut PerpMarket,
        params: &OptimizedParameters,
    ) -> std::result::Result<(), &'static str> {
        // Update margin requirements
        market.margin_ratio_initial = params.margin_ratio_initial;
        market.margin_ratio_maintenance = params.margin_ratio_maintenance;
        
        // Update liquidation parameters
        market.liquidator_fee = params.liquidation_fee;
        
        // Update funding parameters
        market.funding.funding_rate_cap = params.funding_rate_cap;
        
        // Update position limits
        market.max_base_asset_reserve = params.max_position_size;
        
        // Update oracle parameters
        market.oracle_confidence_threshold = params.oracle_confidence_threshold;
        
        // Update commodity-specific adjustments
        market.seasonal_adjustment = params.seasonal_multiplier;
        market.weather_sensitivity = params.weather_sensitivity;
        market.geopolitical_sensitivity = params.geopolitical_sensitivity;
        
        Ok(())
    }
    
    /// Get tuning recommendations without applying them
    pub fn get_tuning_recommendations(
        market: &PerpMarket,
        recent_trades: &[(u64, u64, i64)],
        current_positions: &[(i64, u64)],
        total_collateral: u64,
    ) -> TuningRecommendations {
        let market_risk = Self::analyze_market_conditions(recent_trades, market.commodity_type);
        let portfolio_risk = Self::calculate_portfolio_risk_simplified(current_positions, total_collateral);
        
        let mut recommendations = TuningRecommendations::default();
        
        // Analyze volatility
        if market_risk.current_volatility > 500 {
            recommendations.margin_increase_recommended = true;
            recommendations.volatility_concern = true;
        }
        
        // Analyze liquidity
        if market_risk.liquidity_depth < 500_000 * QUOTE_PRECISION {
            recommendations.position_limit_decrease_recommended = true;
            recommendations.liquidity_concern = true;
        }
        
        // Analyze oracle deviation
        if market_risk.oracle_deviation > 200 {
            recommendations.oracle_threshold_tightening_recommended = true;
            recommendations.oracle_concern = true;
        }
        
        // Analyze systemic risk
        if portfolio_risk.systemic_risk > 7000 {
            recommendations.risk_reduction_recommended = true;
            recommendations.systemic_concern = true;
        }
        
        recommendations.overall_risk_level = Self::calculate_overall_risk_level(&market_risk, &portfolio_risk);
        
        recommendations
    }
    
    /// Calculate overall risk level
    fn calculate_overall_risk_level(market_risk: &MarketRisk, portfolio_risk: &RiskMetrics) -> u32 {
        let volatility_risk = (market_risk.current_volatility * 100).min(10000);
        let liquidity_risk = if market_risk.liquidity_depth < 100_000 * QUOTE_PRECISION {
            8000
        } else if market_risk.liquidity_depth < 500_000 * QUOTE_PRECISION {
            5000
        } else {
            2000
        };
        let oracle_risk = (market_risk.oracle_deviation * 50).min(10000);
        let systemic_risk = portfolio_risk.systemic_risk;
        
        // Weighted average of risk factors
        (volatility_risk * 3 + liquidity_risk * 2 + oracle_risk * 2 + systemic_risk * 3) / 10
    }
}

/// Tuning recommendations structure
#[derive(Clone, Debug)]
pub struct TuningRecommendations {
    pub margin_increase_recommended: bool,
    pub position_limit_decrease_recommended: bool,
    pub oracle_threshold_tightening_recommended: bool,
    pub risk_reduction_recommended: bool,
    pub volatility_concern: bool,
    pub liquidity_concern: bool,
    pub oracle_concern: bool,
    pub systemic_concern: bool,
    pub overall_risk_level: u32, // 0-10000
}

impl Default for TuningRecommendations {
    fn default() -> Self {
        TuningRecommendations {
            margin_increase_recommended: false,
            position_limit_decrease_recommended: false,
            oracle_threshold_tightening_recommended: false,
            risk_reduction_recommended: false,
            volatility_concern: false,
            liquidity_concern: false,
            oracle_concern: false,
            systemic_concern: false,
            overall_risk_level: 3000, // Default medium-low risk
        }
    }
}

/// Market tuning events for logging and monitoring
#[derive(Clone, Debug)]
pub struct TuningEvent {
    pub timestamp: i64,
    pub market_index: u16,
    pub commodity_type: CommodityType,
    pub adjustment_type: TuningAdjustmentType,
    pub old_value: u64,
    pub new_value: u64,
    pub reason: TuningReason,
}

#[derive(Clone, Debug)]
pub enum TuningAdjustmentType {
    MarginRatio,
    LiquidationFee,
    FundingRateCap,
    PositionLimit,
    OracleThreshold,
}

#[derive(Clone, Debug)]
pub enum TuningReason {
    HighVolatility,
    LowLiquidity,
    OracleDeviation,
    SystemicRisk,
    PerformanceOptimization,
}
