use anchor_lang::prelude::*;
use crate::math::constants::*;

/// Commodity types supported by Apex Protocol
#[derive(Clone, Copy, Debug, PartialEq, Eq, AnchorSerialize, AnchorDeserialize)]
#[repr(u8)]
pub enum CommodityType {
    Energy = 0,
    Metals = 1,
    Agriculture = 2,
    Livestock = 3,
}

// Safety: CommodityType is a simple enum with u8 repr, safe for Pod
unsafe impl bytemuck::Pod for CommodityType {}
unsafe impl bytemuck::Zeroable for CommodityType {}

/// Oracle source types
#[derive(Clone, Copy, Debug, PartialEq, Eq, AnchorSerialize, AnchorDeserialize)]
#[repr(u8)]
pub enum OracleSource {
    Pyth = 0,
    Switchboard = 1,
    QuoteAsset = 2,
    Prelaunch = 3,
}

// Safety: OracleSource is a simple enum with u8 repr, safe for Pod
unsafe impl bytemuck::Pod for OracleSource {}
unsafe impl bytemuck::Zeroable for OracleSource {}

/// Enhanced Perpetual Market structure for Apex Protocol
/// Extends the base perpetual market with commodity-specific features
#[account]
#[derive(Debug)]
pub struct PerpMarket {
    pub market_index: u16,
    pub commodity_type: CommodityType,
    pub oracle_source: OracleSource,
    pub _padding1: [u8; 5], // Align to 8-byte boundary
    pub oracle: Pubkey,
    
    // AMM (Automated Market Maker) parameters
    pub amm: AMM,
    
    // Risk management parameters (optimized)
    pub margin_ratio_initial: u32,
    pub margin_ratio_maintenance: u32,
    pub liquidator_fee: u32,
    pub if_liquidation_fee: u32,
    
    // Funding rate parameters (optimized)
    pub funding: FundingRateParams,
    
    // Position limits (optimized)
    pub max_base_asset_reserve: u64,
    pub min_base_asset_reserve: u64,
    
    // Oracle parameters (optimized)
    pub oracle_confidence_threshold: u64,
    pub oracle_twap_period: u64,
    
    // Commodity-specific adjustments (optimized)
    pub seasonal_adjustment: i32,
    pub weather_sensitivity: u32,
    pub geopolitical_sensitivity: u32,
    
    // Market status and controls
    pub status: MarketStatus,
    pub contract_tier: ContractTier,
    pub paused_operations: u8,
    pub _padding2: [u8; 1], // Align to 2-byte boundary
    
    // Fee structure
    pub fee_adjustment: i16,
    pub max_spread: u32,
    
    // Historical data for optimization
    pub historical_oracle_data: HistoricalOracleData,
    
    // Performance metrics
    pub number_of_users: u32,
    pub number_of_users_with_base: u32,
    pub total_fee_minus_distributions: i64,
    pub total_fee_withdrawn: u64,
    pub total_mm_fee: i64,
    pub total_exchange_fee: u64,
    pub total_fee: i128,
    pub open_interest: u128,
    
    // Market metadata
    pub name: [u8; 32],
    pub padding: [u8; 48],
}

/// AMM (Automated Market Maker) structure
#[derive(Debug, AnchorSerialize, AnchorDeserialize, Clone)]
pub struct AMM {
    pub oracle: Pubkey,
    pub oracle_source: OracleSource,
    pub _padding1: [u8; 7], // Align to 8-byte boundary
    
    // Reserve parameters
    pub base_asset_reserve: u128,
    pub quote_asset_reserve: u128,
    pub terminal_quote_asset_reserve: u128,
    pub sqrt_k: u128,
    
    // Peg and pricing
    pub peg_multiplier: u128,
    pub cumulative_funding_rate_long: i128,
    pub cumulative_funding_rate_short: i128,
    pub last_funding_rate: i64,
    pub last_funding_rate_ts: i64,
    
    // Market making parameters
    pub funding_period: i64,
    pub last_oracle_normalised_price: i64,
    pub last_oracle_reserve_price_spread_pct: i64,
    pub last_bid_price_twap: u64,
    pub last_ask_price_twap: u64,
    pub last_mark_price_twap: u64,
    pub last_mark_price_twap_ts: i64,
    
    // AMM configuration
    pub periodicity: i64,
    pub curve_update_intensity: u8,
    pub amm_jit_intensity: u8,
    
    // Spread and fees
    pub base_spread: u32,
    pub max_spread: u32,
    pub long_spread: u32,
    pub short_spread: u32,
    pub long_intensity_volume: u64,
    pub short_intensity_volume: u64,
    pub volume_24h: u64,
    
    // Mark price calculation
    pub mark_std: u64,
    pub oracle_std: u64,
    pub last_oracle_price_twap: i64,
    pub last_oracle_price_twap_ts: i64,
    
    // Net revenue tracking
    pub net_revenue_since_last_funding: i64,
    pub last_update_slot: u64,
    
    pub padding: [u8; 32],
}

impl AMM {
    /// Calculate current mark price
    pub fn mark_price(&self) -> Result<u64> {
        // Simplified mark price calculation
        // In a real implementation, this would use the AMM formula
        let price = (self.quote_asset_reserve * PRICE_PRECISION as u128) / self.base_asset_reserve;
        Ok(price as u64)
    }
    
    /// Calculate bid price
    pub fn bid_price(&self) -> Result<u64> {
        let mark_price = self.mark_price()?;
        let spread_adjustment = (mark_price * self.base_spread as u64) / 10000;
        Ok(mark_price - spread_adjustment)
    }
    
    /// Calculate ask price
    pub fn ask_price(&self) -> Result<u64> {
        let mark_price = self.mark_price()?;
        let spread_adjustment = (mark_price * self.base_spread as u64) / 10000;
        Ok(mark_price + spread_adjustment)
    }
}

/// Funding rate parameters
#[derive(Debug, AnchorSerialize, AnchorDeserialize, Clone)]
pub struct FundingRateParams {
    pub funding_rate_cap: i64,
    pub funding_rate_half_life: u64,
    pub last_funding_rate: i64,
    pub last_funding_rate_ts: i64,
    pub funding_period: i64,
    pub cumulative_funding_rate_long: i128,
    pub cumulative_funding_rate_short: i128,
    pub padding: [u8; 16],
}

/// Market status enumeration
#[derive(Clone, Copy, Debug, PartialEq, Eq, AnchorSerialize, AnchorDeserialize)]
#[repr(u8)]
pub enum MarketStatus {
    Initialized = 0,
    Active = 1,
    FundingPaused = 2,
    AmmPaused = 3,
    FillPaused = 4,
    WithdrawPaused = 5,
    ReduceOnly = 6,
    Settlement = 7,
    Delisted = 8,
}

// Safety: MarketStatus is a simple enum with u8 repr, safe for Pod
unsafe impl bytemuck::Pod for MarketStatus {}
unsafe impl bytemuck::Zeroable for MarketStatus {}

/// Contract tier for risk management
#[derive(Clone, Copy, Debug, PartialEq, Eq, AnchorSerialize, AnchorDeserialize)]
#[repr(u8)]
pub enum ContractTier {
    A = 0,
    B = 1,
    C = 2,
    Speculative = 3,
    Isolated = 4,
}

// Safety: ContractTier is a simple enum with u8 repr, safe for Pod
unsafe impl bytemuck::Pod for ContractTier {}
unsafe impl bytemuck::Zeroable for ContractTier {}

/// Historical oracle data for optimization
#[derive(Debug, AnchorSerialize, AnchorDeserialize, Clone)]
pub struct HistoricalOracleData {
    pub last_oracle_price: i64,
    pub last_oracle_price_twap: i64,
    pub last_oracle_price_twap_5min: i64,
    pub last_oracle_conf_pct: u64,
    pub last_oracle_delay: i64,
    pub oracle_twap_fast: i64,
    pub oracle_twap_slow: i64,
    pub oracle_twap_fast_ts: i64,
    pub oracle_twap_slow_ts: i64,
    pub padding: [u8; 32],
}

impl PerpMarket {
    /// Initialize a new perpetual market with optimized parameters
    pub fn initialize(
        &mut self,
        market_index: u16,
        commodity_type: CommodityType,
        oracle: Pubkey,
        oracle_source: OracleSource,
        optimized_params: &crate::optimization::OptimizedParameters,
        name: [u8; 32],
    ) -> Result<()> {
        self.market_index = market_index;
        self.commodity_type = commodity_type;
        self.oracle = oracle;
        self.oracle_source = oracle_source;
        
        // Apply optimized parameters
        self.margin_ratio_initial = optimized_params.margin_ratio_initial;
        self.margin_ratio_maintenance = optimized_params.margin_ratio_maintenance;
        self.liquidator_fee = optimized_params.liquidation_fee;
        
        self.funding.funding_rate_cap = optimized_params.funding_rate_cap;
        self.max_base_asset_reserve = optimized_params.max_position_size;
        self.oracle_confidence_threshold = optimized_params.oracle_confidence_threshold;
        
        self.seasonal_adjustment = optimized_params.seasonal_multiplier;
        self.weather_sensitivity = optimized_params.weather_sensitivity;
        self.geopolitical_sensitivity = optimized_params.geopolitical_sensitivity;
        
        self.status = MarketStatus::Initialized;
        self.contract_tier = ContractTier::B; // Default to B tier
        self.name = name;
        
        Ok(())
    }
    
    /// Check if market is active and can accept orders
    pub fn is_active(&self) -> bool {
        matches!(self.status, MarketStatus::Active)
    }
    
    /// Check if market is paused
    pub fn is_paused(&self) -> bool {
        !matches!(self.status, MarketStatus::Active | MarketStatus::Initialized)
    }
    
    /// Get current funding rate
    pub fn get_current_funding_rate(&self) -> i64 {
        self.funding.last_funding_rate
    }
    
    /// Calculate margin requirement for a position
    pub fn calculate_margin_requirement(&self, base_asset_amount: u64, is_initial: bool) -> Result<u64> {
        let margin_ratio = if is_initial {
            self.margin_ratio_initial
        } else {
            self.margin_ratio_maintenance
        };
        
        let mark_price = self.amm.mark_price()?;
        let notional_value = (base_asset_amount * mark_price) / PRICE_PRECISION;
        let base_margin = (notional_value * margin_ratio as u64) / 10000;
        
        // Apply commodity-specific adjustments
        let seasonal_adjusted = if self.seasonal_adjustment >= 0 {
            (base_margin * (10000 + self.seasonal_adjustment as u32) as u64) / 10000
        } else {
            (base_margin * (10000 - (-self.seasonal_adjustment) as u32) as u64) / 10000
        };
        
        let weather_adjusted = (seasonal_adjusted * self.weather_sensitivity as u64) / 10000;
        let final_margin = (weather_adjusted * self.geopolitical_sensitivity as u64) / 10000;
        
        Ok(final_margin)
    }
    
    /// Update seasonal adjustment
    pub fn update_seasonal_adjustment(&mut self, new_adjustment: i32) -> Result<()> {
        if new_adjustment < -5000 || new_adjustment > 5000 {
            return Err(error!(crate::ErrorCode::SeasonalAdjustmentOutOfRange));
        }
        self.seasonal_adjustment = new_adjustment;
        Ok(())
    }
    
    /// Update weather sensitivity
    pub fn update_weather_sensitivity(&mut self, new_sensitivity: u32) -> Result<()> {
        if new_sensitivity < 5000 || new_sensitivity > 20000 {
            return Err(error!(crate::ErrorCode::WeatherSensitivityOutOfRange));
        }
        self.weather_sensitivity = new_sensitivity;
        Ok(())
    }
    
    /// Update geopolitical sensitivity
    pub fn update_geopolitical_sensitivity(&mut self, new_sensitivity: u32) -> Result<()> {
        if new_sensitivity < 5000 || new_sensitivity > 20000 {
            return Err(error!(crate::ErrorCode::GeopoliticalSensitivityOutOfRange));
        }
        self.geopolitical_sensitivity = new_sensitivity;
        Ok(())
    }
    
    /// Emergency pause market
    pub fn emergency_pause(&mut self, reason: u8) -> Result<()> {
        self.status = MarketStatus::AmmPaused;
        self.paused_operations = reason;
        Ok(())
    }
    
    /// Resume market after pause
    pub fn resume(&mut self) -> Result<()> {
        self.status = MarketStatus::Active;
        self.paused_operations = 0;
        Ok(())
    }
}

/// Order parameters for placing orders
#[derive(Clone, Copy, Debug, AnchorSerialize, AnchorDeserialize)]
pub struct OrderParams {
    pub order_type: OrderType,
    pub market_type: MarketType,
    pub direction: PositionDirection,
    pub user_order_id: u8,
    pub base_asset_amount: u64,
    pub price: Option<u64>,
    pub market_index: u16,
    pub reduce_only: bool,
    pub post_only: PostOnlyParam,
    pub immediate_or_cancel: bool,
    pub max_ts: Option<i64>,
    pub trigger_price: Option<u64>,
    pub trigger_condition: OrderTriggerCondition,
    pub oracle_price_offset: Option<i32>,
    pub auction_duration: Option<u8>,
    pub auction_start_price: Option<i64>,
    pub auction_end_price: Option<i64>,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, AnchorSerialize, AnchorDeserialize)]
pub enum OrderType {
    Market = 0,
    Limit = 1,
    TriggerMarket = 2,
    TriggerLimit = 3,
    Oracle = 4,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, AnchorSerialize, AnchorDeserialize)]
pub enum MarketType {
    Perp = 0,
    Spot = 1,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, AnchorSerialize, AnchorDeserialize)]
pub enum PositionDirection {
    Long = 0,
    Short = 1,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, AnchorSerialize, AnchorDeserialize)]
pub enum PostOnlyParam {
    None = 0,
    MustPostOnly = 1,
    TryPostOnly = 2,
    Slide = 3,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, AnchorSerialize, AnchorDeserialize)]
pub enum OrderTriggerCondition {
    Above = 0,
    Below = 1,
    TriggeredAbove = 2,
    TriggeredBelow = 3,
}

/// Exchange fee structure
#[derive(Clone, Copy, Debug, AnchorSerialize, AnchorDeserialize)]
pub struct ExchangeFeeStructure {
    pub fee_tiers: [FeeTier; 10],
    pub filler_reward_structure: OrderFillerRewardStructure,
    pub referrer_reward_epoch_upper_bound: u64,
    pub flat_filler_fee: u64,
}

#[derive(Clone, Copy, Debug, AnchorSerialize, AnchorDeserialize)]
pub struct FeeTier {
    pub fee_numerator: u32,
    pub fee_denominator: u32,
    pub maker_rebate_numerator: u32,
    pub maker_rebate_denominator: u32,
    pub referrer_reward_numerator: u32,
    pub referrer_reward_denominator: u32,
    pub referee_fee_numerator: u32,
    pub referee_fee_denominator: u32,
}

#[derive(Clone, Copy, Debug, AnchorSerialize, AnchorDeserialize)]
pub struct OrderFillerRewardStructure {
    pub reward_numerator: u32,
    pub reward_denominator: u32,
    pub time_based_reward_lower_bound: u128,
}

/// Spot fee structure
#[derive(Clone, Copy, Debug, AnchorSerialize, AnchorDeserialize)]
pub struct SpotFeeStructure {
    pub fee_tiers: [FeeTier; 10],
    pub filler_reward_structure: OrderFillerRewardStructure,
    pub referrer_reward_epoch_upper_bound: u64,
    pub flat_filler_fee: u64,
}

/// Oracle guard rails
#[derive(Clone, Copy, Debug, AnchorSerialize, AnchorDeserialize)]
pub struct OracleGuardRails {
    pub price_divergence: PriceDivergenceGuardRails,
    pub validity: ValidityGuardRails,
}

#[derive(Clone, Copy, Debug, AnchorSerialize, AnchorDeserialize)]
pub struct PriceDivergenceGuardRails {
    pub mark_oracle_percent_divergence: u64,
    pub oracle_twap_5min_percent_divergence: u64,
}

#[derive(Clone, Copy, Debug, AnchorSerialize, AnchorDeserialize)]
pub struct ValidityGuardRails {
    pub slots_before_stale_for_amm: i64,
    pub slots_before_stale_for_margin: i64,
    pub confidence_interval_max_size: u64,
    pub too_volatile_ratio: i64,
}
