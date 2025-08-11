use anchor_lang::prelude::*;

pub mod error;
pub mod instructions;
pub mod math;
pub mod state;
pub mod optimization;

use optimization::parameter_optimizer::{ParameterOptimizer, OptimizedParameters};
use optimization::risk_calculator::RiskCalculator;
use instructions::place_perp_order::OrderParams;
use instructions::*;
use state::*;
use optimization::*;
use error::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

/// Apex Commodities Protocol - Advanced Derivatives Trading Platform
/// 
/// A specialized fork of Drift Protocol v2 optimized for commodity derivatives trading
/// with sophisticated risk management, real-time parameter optimization, and 
/// commodity-specific features including seasonal adjustments, weather impact modeling,
/// and geopolitical risk monitoring.

#[program]
pub mod apex {
    use super::*;

    /// Initialize the Apex Protocol with optimized parameters
    pub fn initialize(
        ctx: Context<Initialize>,
        admin: Pubkey,
        exchange_fee_structure: ExchangeFeeStructure,
        spot_fee_structure: SpotFeeStructure,
        oracle_guard_rails: OracleGuardRails,
        number_of_authorities: u16,
        number_of_sub_accounts: u16,
        signer_nonce: u8,
        min_perp_auction_duration: u8,
        default_market_order_time_in_force: u8,
        default_spot_auction_duration: u8,
        exchange_status: u8,
        settlement_duration: u16,
        number_of_markets: u16,
    ) -> Result<()> {
        instructions::initialize::handler(ctx, admin)
    }

    /// Initialize a new commodity perpetual market with optimized parameters
    pub fn initialize_perp_market(
        ctx: Context<InitializePerpMarket>,
        market_index: u16,
        amm_base_asset_reserve: u128,
        amm_quote_asset_reserve: u128,
        amm_periodicity: i64,
        amm_peg_multiplier: u128,
        oracle_source: OracleSource,
        commodity_type: CommodityType,
        name: [u8; 32],
    ) -> Result<()> {
        // Get optimized parameters for this commodity type
        let optimized_params = ParameterOptimizer::get_optimized_parameters(commodity_type);
        
        instructions::initialize_perp_market::handler(
            ctx,
            market_index,
            amm_base_asset_reserve,
            amm_quote_asset_reserve,
            amm_periodicity,
            amm_peg_multiplier,
            oracle_source,
            optimized_params.margin_ratio_initial,
            optimized_params.margin_ratio_maintenance,
            name,
        )
    }

    /// Initialize a new commodity spot market
    pub fn initialize_spot_market(
        ctx: Context<InitializeSpotMarket>,
        market_index: u16,
        oracle_source: OracleSource,
        commodity_type: CommodityType,
        optimal_utilization: u32,
        optimal_borrow_rate: u32,
        max_borrow_rate: u32,
        decimals: u32,
        name: [u8; 32],
    ) -> Result<()> {
        instructions::initialize_spot_market::handler(
            ctx,
            market_index,
            oracle_source,
            optimal_utilization,
            optimal_borrow_rate,
            max_borrow_rate,
            8000, // initial_asset_weight
            7500, // maintenance_asset_weight
            12000, // initial_liability_weight
        )
    }

    /// Place order with dynamic risk assessment
    pub fn place_perp_order(
        ctx: Context<PlacePerpOrder>,
        params: OrderParams,
    ) -> Result<()> {
        // Perform real-time risk assessment before placing order
        let market = &ctx.accounts.perp_market;
        let user = &ctx.accounts.user;
        
        // Calculate position risk
        let position_risk = RiskCalculator::calculate_position_risk(
            market.commodity_type,
            params.base_asset_amount as i64,
            params.price.unwrap_or(market.amm.mark_price()?),
            market.amm.mark_price()?,
            1000000, // Mock total collateral
            &ParameterOptimizer::get_optimized_parameters(market.commodity_type),
        );
        
        // Check if order exceeds risk limits
        if position_risk.margin_requirement > 500000 { // Mock free collateral check
            return Err(ErrorCode::InsufficientCollateral.into());
        }
        
        instructions::place_perp_order::handler(ctx, params)
    }

    /// Cancel order
    pub fn cancel_order(
        ctx: Context<CancelOrder>,
        order_id: Option<u32>,
    ) -> Result<()> {
        instructions::cancel_order::handler(ctx, order_id)
    }

    /// Fill order with optimized execution
    pub fn fill_perp_order(
        ctx: Context<FillPerpOrder>,
        order_id: Option<u32>,
        maker_order_id: Option<u32>,
    ) -> Result<()> {
        instructions::fill_perp_order::handler(ctx, order_id, maker_order_id)
    }

    /// Liquidate perp position with dynamic parameters
    pub fn liquidate_perp(
        ctx: Context<LiquidatePerp>,
        market_index: u16,
        liquidatee_user_account_key: Pubkey,
        liquidatee_sub_account_id: u16,
        max_base_asset_amount: u64,
        limit_price: Option<u64>,
    ) -> Result<()> {
        // Apply dynamic liquidation parameters based on market conditions
        let market = &ctx.accounts.perp_market;
        let optimized_params = ParameterOptimizer::get_optimized_parameters(market.commodity_type);
        
        instructions::liquidate_perp::handler(ctx, market_index, liquidatee_user_account_key, &optimized_params)
    }

    /// Update funding rate with commodity-specific calculations
    pub fn update_funding_rate(
        ctx: Context<UpdateFundingRate>,
        market_index: u16,
    ) -> Result<()> {
        let market = &mut ctx.accounts.perp_market;
        let optimized_params = ParameterOptimizer::get_optimized_parameters(market.commodity_type);
        
        instructions::update_funding_rate::handler(ctx, &optimized_params)
    }

    /// Tune market parameters in real-time
    pub fn tune_market_parameters(
        ctx: Context<TuneMarketParameters>,
        market_index: u16,
    ) -> Result<()> {
        let market = &mut ctx.accounts.perp_market;
        let state = &ctx.accounts.state;
        
        // Get recent trading data (simplified - in real implementation, fetch from accounts)
        let recent_trades: Vec<(u64, u64, i64)> = vec![]; // Placeholder
        let current_positions: Vec<(i64, u64)> = vec![]; // Placeholder
        let total_collateral = 1_000_000 * math::constants::QUOTE_PRECISION; // Placeholder
        
        let config = MarketTuningConfig::default();
        let mut metrics = TuningMetrics::default();
        let current_timestamp = Clock::get()?.unix_timestamp;
        
        // Perform market parameter tuning
        let optimized_params = MarketTuner::tune_market_parameters(
            market,
            &recent_trades,
            &current_positions,
            total_collateral,
            &config,
            &mut metrics,
            current_timestamp,
        ).map_err(|_| ErrorCode::RiskLimitsExceeded)?;
        
        // Emit tuning event
        emit!(MarketParametersTuned {
            market_index,
            commodity_type: market.commodity_type,
            timestamp: current_timestamp,
            margin_ratio_initial: optimized_params.margin_ratio_initial,
            margin_ratio_maintenance: optimized_params.margin_ratio_maintenance,
            funding_rate_cap: optimized_params.funding_rate_cap,
            max_position_size: optimized_params.max_position_size,
        });
        
        Ok(())
    }

    /// Get tuning recommendations without applying them
    pub fn get_tuning_recommendations(
        ctx: Context<GetTuningRecommendations>,
        market_index: u16,
    ) -> Result<()> {
        let market = &ctx.accounts.perp_market;
        
        // Get recent trading data (simplified)
        let recent_trades: Vec<(u64, u64, i64)> = vec![];
        let current_positions: Vec<(i64, u64)> = vec![];
        let total_collateral = 1_000_000 * math::constants::QUOTE_PRECISION;
        
        let recommendations = MarketTuner::get_tuning_recommendations(
            market,
            &recent_trades,
            &current_positions,
            total_collateral,
        );
        
        // Emit recommendations event
        emit!(TuningRecommendations {
            market_index,
            commodity_type: market.commodity_type,
            margin_increase_recommended: recommendations.margin_increase_recommended,
            position_limit_decrease_recommended: recommendations.position_limit_decrease_recommended,
            oracle_threshold_tightening_recommended: recommendations.oracle_threshold_tightening_recommended,
            risk_reduction_recommended: recommendations.risk_reduction_recommended,
            overall_risk_level: recommendations.overall_risk_level,
        });
        
        Ok(())
    }

    /// Emergency pause market (risk management)
    pub fn emergency_pause_market(
        ctx: Context<EmergencyPauseMarket>,
        market_index: u16,
        pause_reason: u8,
    ) -> Result<()> {
        instructions::emergency_pause_market::handler(ctx, market_index, pause_reason)
    }

    /// Resume market after emergency pause
    pub fn resume_market(
        ctx: Context<ResumeMarket>,
        market_index: u16,
    ) -> Result<()> {
        instructions::resume_market::handler(ctx, market_index)
    }

    /// Update seasonal adjustments for commodity markets
    pub fn update_seasonal_adjustments(
        ctx: Context<UpdateSeasonalAdjustments>,
        market_index: u16,
        seasonal_multiplier: i32,
    ) -> Result<()> {
        instructions::update_seasonal_adjustments::handler(ctx, market_index, seasonal_multiplier)
    }

    /// Update weather impact factors
    pub fn update_weather_impact(
        ctx: Context<UpdateWeatherImpact>,
        market_index: u16,
        weather_sensitivity: u32,
    ) -> Result<()> {
        instructions::update_weather_impact::handler(ctx, market_index, weather_sensitivity)
    }

    /// Update geopolitical risk factors
    pub fn update_geopolitical_risk(
        ctx: Context<UpdateGeopoliticalRisk>,
        market_index: u16,
        geopolitical_sensitivity: u32,
    ) -> Result<()> {
        instructions::update_geopolitical_risk::handler(ctx, market_index, geopolitical_sensitivity)
    }
}

/// Events for monitoring and analytics

#[event]
pub struct MarketParametersTuned {
    pub market_index: u16,
    pub commodity_type: CommodityType,
    pub timestamp: i64,
    pub margin_ratio_initial: u32,
    pub margin_ratio_maintenance: u32,
    pub funding_rate_cap: i64,
    pub max_position_size: u64,
}

#[event]
pub struct TuningRecommendations {
    pub market_index: u16,
    pub commodity_type: CommodityType,
    pub margin_increase_recommended: bool,
    pub position_limit_decrease_recommended: bool,
    pub oracle_threshold_tightening_recommended: bool,
    pub risk_reduction_recommended: bool,
    pub overall_risk_level: u32,
}

#[event]
pub struct RiskAlert {
    pub market_index: u16,
    pub commodity_type: CommodityType,
    pub risk_type: u8, // 1=volatility, 2=liquidity, 3=oracle, 4=systemic
    pub risk_level: u32,
    pub timestamp: i64,
}

#[event]
pub struct EmergencyAction {
    pub market_index: u16,
    pub action_type: u8, // 1=pause, 2=resume, 3=circuit_breaker
    pub reason: u8,
    pub timestamp: i64,
}

/// Error codes specific to Apex Protocol
#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient collateral for position")]
    InsufficientCollateral,
    #[msg("Position size exceeds maximum allowed")]
    PositionSizeExceeded,
    #[msg("Market is paused")]
    MarketPaused,
    #[msg("Oracle confidence too low")]
    OracleConfidenceTooLow,
    #[msg("Volatility too high for operation")]
    VolatilityTooHigh,
    #[msg("Liquidity insufficient")]
    LiquidityInsufficient,
    #[msg("Risk limits exceeded")]
    RiskLimitsExceeded,
    #[msg("Seasonal adjustment out of range")]
    SeasonalAdjustmentOutOfRange,
    #[msg("Weather sensitivity out of range")]
    WeatherSensitivityOutOfRange,
    #[msg("Geopolitical sensitivity out of range")]
    GeopoliticalSensitivityOutOfRange,
}
