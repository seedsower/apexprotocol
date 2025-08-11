// use anchor_lang::prelude::*; // Commented out unused import
use crate::math::constants::*;
use crate::error::ErrorCode;
use crate::state::perp_market::CommodityType;

/// Advanced parameter optimization framework for Apex Protocol
/// Implements data-driven parameter tuning based on historical volatility,
/// market liquidity, and risk characteristics of each commodity category.

#[derive(Clone, Copy, Debug)]
pub struct OptimizedParameters {
    pub margin_ratio_initial: u32,
    pub margin_ratio_maintenance: u32,
    pub liquidation_fee: u32,
    pub funding_rate_cap: i64,
    pub max_position_size: u64,
    pub oracle_confidence_threshold: u64,
    pub volatility_adjustment: u32,
    pub seasonal_multiplier: i32,
    pub weather_sensitivity: u32,
    pub geopolitical_sensitivity: u32,
}

impl Default for OptimizedParameters {
    fn default() -> Self {
        OptimizedParameters {
            margin_ratio_initial: 1000,        // 10%
            margin_ratio_maintenance: 625,     // 6.25%
            liquidation_fee: 250,              // 2.5%
            funding_rate_cap: 208,             // 0.208% per hour
            max_position_size: 1_000_000 * BASE_PRECISION,
            oracle_confidence_threshold: 5 * QUOTE_PRECISION / 100,
            volatility_adjustment: 10000,      // 100% (no adjustment)
            seasonal_multiplier: 0,            // No seasonal adjustment
            weather_sensitivity: 10000,        // 100% (normal)
            geopolitical_sensitivity: 10000,   // 100% (normal)
        }
    }
}

/// Historical volatility data for parameter optimization
#[derive(Clone, Copy, Debug)]
pub struct VolatilityProfile {
    pub daily_volatility: u32,     // Basis points (e.g., 200 = 2%)
    pub weekly_volatility: u32,    // Basis points
    pub monthly_volatility: u32,   // Basis points
    pub max_daily_move: u32,       // Basis points
    pub liquidity_score: u32,      // 0-10000 (10000 = highest liquidity)
}

/// Market characteristics for each commodity type
pub struct CommodityCharacteristics {
    pub commodity_type: CommodityType,
    pub volatility_profile: VolatilityProfile,
    pub seasonal_pattern: SeasonalPattern,
    pub weather_dependency: WeatherDependency,
    pub geopolitical_exposure: GeopoliticalExposure,
    pub market_hours: MarketHours,
}

#[derive(Clone, Copy, Debug)]
pub struct SeasonalPattern {
    pub has_seasonal_pattern: bool,
    pub peak_season_months: [bool; 12],     // Jan=0, Dec=11
    pub seasonal_volatility_multiplier: u32, // Basis points
    pub supply_cycle_impact: u32,           // Basis points
}

#[derive(Clone, Copy, Debug)]
pub struct WeatherDependency {
    pub weather_sensitive: bool,
    pub drought_impact: u32,                // Basis points price impact
    pub temperature_sensitivity: u32,       // Basis points per degree
    pub precipitation_impact: u32,          // Basis points impact
}

#[derive(Clone, Copy, Debug)]
pub struct GeopoliticalExposure {
    pub geopolitically_sensitive: bool,
    pub trade_war_impact: u32,              // Basis points
    pub sanctions_risk: u32,                // Basis points
    pub supply_chain_vulnerability: u32,    // Basis points
}

#[derive(Clone, Copy, Debug)]
pub struct MarketHours {
    pub trading_hours_per_day: u8,          // Hours of active trading
    pub weekend_trading: bool,
    pub holiday_impact: u32,                // Basis points volatility increase
}

/// Parameter optimizer implementation
pub struct ParameterOptimizer;

impl ParameterOptimizer {
    /// Get optimized parameters for a specific commodity type
    pub fn get_optimized_parameters(commodity_type: CommodityType) -> OptimizedParameters {
        let characteristics = Self::get_commodity_characteristics(commodity_type);
        Self::calculate_optimized_parameters(&characteristics)
    }
    
    /// Calculate optimized parameters based on commodity characteristics
    fn calculate_optimized_parameters(characteristics: &CommodityCharacteristics) -> OptimizedParameters {
        let _base_params = OptimizedParameters::default(); // Prefixed with underscore to indicate intentionally unused
        let volatility = &characteristics.volatility_profile;
        
        // Calculate volatility-adjusted margin requirements
        let volatility_multiplier = Self::calculate_volatility_multiplier(volatility);
        let margin_initial = Self::calculate_initial_margin(volatility, volatility_multiplier);
        let margin_maintenance = (margin_initial * 625) / 1000; // 62.5% of initial
        
        // Calculate funding rate cap based on volatility and liquidity
        let funding_cap = Self::calculate_funding_rate_cap(volatility, characteristics.commodity_type);
        
        // Calculate position size limits based on liquidity
        let max_position = Self::calculate_max_position_size(volatility, characteristics.commodity_type);
        
        // Calculate oracle confidence threshold
        let oracle_threshold = Self::calculate_oracle_threshold(volatility, characteristics.commodity_type);
        
        // Calculate seasonal and weather adjustments
        let seasonal_mult = Self::calculate_seasonal_multiplier(&characteristics.seasonal_pattern);
        let weather_sens = Self::calculate_weather_sensitivity(&characteristics.weather_dependency);
        let geopolitical_sens = Self::calculate_geopolitical_sensitivity(&characteristics.geopolitical_exposure);
        
        OptimizedParameters {
            margin_ratio_initial: margin_initial,
            margin_ratio_maintenance: margin_maintenance,
            liquidation_fee: Self::calculate_liquidation_fee(volatility),
            funding_rate_cap: funding_cap,
            max_position_size: max_position,
            oracle_confidence_threshold: oracle_threshold,
            volatility_adjustment: volatility_multiplier,
            seasonal_multiplier: seasonal_mult,
            weather_sensitivity: weather_sens,
            geopolitical_sensitivity: geopolitical_sens,
        }
    }
    
    /// Calculate volatility multiplier based on historical data
    fn calculate_volatility_multiplier(volatility: &VolatilityProfile) -> u32 {
        // Base multiplier of 100% (10000 basis points)
        let mut multiplier = 10000u32;
        
        // Adjust based on daily volatility
        if volatility.daily_volatility > 500 {      // > 5% daily vol
            multiplier += 5000;                     // +50% margin requirement
        } else if volatility.daily_volatility > 300 { // > 3% daily vol
            multiplier += 2000;                     // +20% margin requirement
        } else if volatility.daily_volatility > 150 { // > 1.5% daily vol
            multiplier += 1000;                     // +10% margin requirement
        }
        
        // Adjust based on max daily move
        if volatility.max_daily_move > 1000 {       // > 10% max move
            multiplier += 3000;                     // +30% additional margin
        } else if volatility.max_daily_move > 500 { // > 5% max move
            multiplier += 1500;                     // +15% additional margin
        }
        
        // Adjust based on liquidity (lower liquidity = higher margin)
        if volatility.liquidity_score < 3000 {      // Low liquidity
            multiplier += 2000;                     // +20% margin
        } else if volatility.liquidity_score < 6000 { // Medium liquidity
            multiplier += 1000;                     // +10% margin
        }
        
        multiplier.min(25000) // Cap at 250% multiplier
    }
    
    /// Calculate initial margin requirement
    fn calculate_initial_margin(volatility: &VolatilityProfile, volatility_multiplier: u32) -> u32 {
        let base_margin = match volatility.daily_volatility {
            0..=100 => 300,      // 3% for very low volatility
            101..=200 => 500,    // 5% for low volatility
            201..=400 => 800,    // 8% for medium volatility
            401..=600 => 1200,   // 12% for high volatility
            _ => 1500,           // 15% for very high volatility
        };
        
        // Apply volatility multiplier
        (base_margin * volatility_multiplier / 10000).min(2500) // Cap at 25%
    }
    
    /// Calculate funding rate cap based on volatility and commodity type
    fn calculate_funding_rate_cap(volatility: &VolatilityProfile, commodity_type: CommodityType) -> i64 {
        let base_cap = match commodity_type {
            CommodityType::Energy => ENERGY_MAX_FUNDING_RATE,
            CommodityType::Metals => METALS_MAX_FUNDING_RATE,
            CommodityType::Agriculture => AGRICULTURE_MAX_FUNDING_RATE,
            CommodityType::Livestock => LIVESTOCK_MAX_FUNDING_RATE,
        };
        
        // Adjust based on volatility
        let volatility_adjustment = if volatility.daily_volatility > 400 {
            15000 // +50% funding cap for high volatility
        } else if volatility.daily_volatility > 200 {
            12000 // +20% funding cap for medium volatility
        } else {
            10000 // No adjustment for low volatility
        };
        
        ((base_cap as u64 * volatility_adjustment as u64) / 10000).min(1000) as i64 // Cap at 1% per hour
    }
    
    /// Calculate maximum position size based on liquidity
    fn calculate_max_position_size(volatility: &VolatilityProfile, commodity_type: CommodityType) -> u64 {
        let base_size = match commodity_type {
            CommodityType::Energy => MAX_ENERGY_POSITION_SIZE,
            CommodityType::Metals => MAX_METALS_POSITION_SIZE,
            CommodityType::Agriculture => MAX_AGRICULTURE_POSITION_SIZE,
            CommodityType::Livestock => MAX_LIVESTOCK_POSITION_SIZE,
        };
        
        // Adjust based on liquidity score
        let liquidity_multiplier = if volatility.liquidity_score > 8000 {
            15000 // +50% position size for high liquidity
        } else if volatility.liquidity_score > 5000 {
            12000 // +20% position size for medium liquidity
        } else if volatility.liquidity_score > 2000 {
            10000 // No adjustment for low liquidity
        } else {
            5000  // -50% position size for very low liquidity
        };
        
        base_size * liquidity_multiplier as u64 / 10000
    }
    
    /// Calculate oracle confidence threshold
    fn calculate_oracle_threshold(volatility: &VolatilityProfile, commodity_type: CommodityType) -> u64 {
        let base_threshold = match commodity_type {
            CommodityType::Energy => ENERGY_ORACLE_CONFIDENCE_THRESHOLD,
            CommodityType::Metals => METALS_ORACLE_CONFIDENCE_THRESHOLD,
            CommodityType::Agriculture => AGRICULTURE_ORACLE_CONFIDENCE_THRESHOLD,
            CommodityType::Livestock => LIVESTOCK_ORACLE_CONFIDENCE_THRESHOLD,
        };
        
        // Tighter thresholds for higher volatility
        let volatility_adjustment = if volatility.daily_volatility > 400 {
            5000  // -50% threshold (tighter) for high volatility
        } else if volatility.daily_volatility > 200 {
            7500  // -25% threshold for medium volatility
        } else {
            10000 // No adjustment for low volatility
        };
        
        (base_threshold * volatility_adjustment as u64 / 10000).max(QUOTE_PRECISION / 1000) // Min $0.001
    }
    
    /// Calculate liquidation fee based on volatility
    fn calculate_liquidation_fee(volatility: &VolatilityProfile) -> u32 {
        // Higher fees for higher volatility to compensate liquidators
        match volatility.daily_volatility {
            0..=150 => 200,      // 2% for low volatility
            151..=300 => 250,    // 2.5% for medium volatility
            301..=500 => 300,    // 3% for high volatility
            _ => 400,            // 4% for very high volatility
        }
    }
    
    /// Calculate seasonal multiplier
    fn calculate_seasonal_multiplier(seasonal: &SeasonalPattern) -> i32 {
        if seasonal.has_seasonal_pattern {
            // Return current month's seasonal adjustment
            // For now, return average seasonal impact
            (seasonal.seasonal_volatility_multiplier as i32 - 10000) / 2
        } else {
            0
        }
    }
    
    /// Calculate weather sensitivity
    fn calculate_weather_sensitivity(weather: &WeatherDependency) -> u32 {
        if weather.weather_sensitive {
            // Combine all weather factors
            let total_impact = weather.drought_impact + weather.temperature_sensitivity + weather.precipitation_impact;
            10000 + (total_impact / 3) // Average impact as multiplier
        } else {
            10000 // No weather sensitivity
        }
    }
    
    /// Calculate geopolitical sensitivity
    fn calculate_geopolitical_sensitivity(geopolitical: &GeopoliticalExposure) -> u32 {
        if geopolitical.geopolitically_sensitive {
            let total_risk = geopolitical.trade_war_impact + geopolitical.sanctions_risk + geopolitical.supply_chain_vulnerability;
            10000 + (total_risk / 3) // Average risk as multiplier
        } else {
            10000 // No geopolitical sensitivity
        }
    }
    
    /// Get commodity characteristics for optimization
    fn get_commodity_characteristics(commodity_type: CommodityType) -> CommodityCharacteristics {
        match commodity_type {
            CommodityType::Energy => Self::get_energy_characteristics(),
            CommodityType::Metals => Self::get_metals_characteristics(),
            CommodityType::Agriculture => Self::get_agriculture_characteristics(),
            CommodityType::Livestock => Self::get_livestock_characteristics(),
        }
    }
    
    /// Energy commodity characteristics (Natural Gas, Oil)
    fn get_energy_characteristics() -> CommodityCharacteristics {
        CommodityCharacteristics {
            commodity_type: CommodityType::Energy,
            volatility_profile: VolatilityProfile {
                daily_volatility: 350,     // 3.5% daily volatility
                weekly_volatility: 800,    // 8% weekly volatility
                monthly_volatility: 1500,  // 15% monthly volatility
                max_daily_move: 1200,      // 12% max daily move
                liquidity_score: 7500,     // High liquidity
            },
            seasonal_pattern: SeasonalPattern {
                has_seasonal_pattern: true,
                peak_season_months: [true, true, false, false, false, false, false, false, false, true, true, true], // Winter months
                seasonal_volatility_multiplier: 12000, // +20% volatility in winter
                supply_cycle_impact: 500,   // 5% supply cycle impact
            },
            weather_dependency: WeatherDependency {
                weather_sensitive: true,
                drought_impact: 200,        // 2% drought impact
                temperature_sensitivity: 300, // 3% per extreme temperature
                precipitation_impact: 100,  // 1% precipitation impact
            },
            geopolitical_exposure: GeopoliticalExposure {
                geopolitically_sensitive: true,
                trade_war_impact: 800,      // 8% trade war impact
                sanctions_risk: 1500,       // 15% sanctions risk
                supply_chain_vulnerability: 1000, // 10% supply chain risk
            },
            market_hours: MarketHours {
                trading_hours_per_day: 23,  // Nearly 24/7 trading
                weekend_trading: true,
                holiday_impact: 200,        // 2% holiday volatility increase
            },
        }
    }
    
    /// Metals commodity characteristics (Gold, Silver)
    fn get_metals_characteristics() -> CommodityCharacteristics {
        CommodityCharacteristics {
            commodity_type: CommodityType::Metals,
            volatility_profile: VolatilityProfile {
                daily_volatility: 180,     // 1.8% daily volatility
                weekly_volatility: 400,    // 4% weekly volatility
                monthly_volatility: 800,   // 8% monthly volatility
                max_daily_move: 600,       // 6% max daily move
                liquidity_score: 9000,     // Very high liquidity
            },
            seasonal_pattern: SeasonalPattern {
                has_seasonal_pattern: false,
                peak_season_months: [false; 12],
                seasonal_volatility_multiplier: 10000, // No seasonal pattern
                supply_cycle_impact: 100,   // 1% supply cycle impact
            },
            weather_dependency: WeatherDependency {
                weather_sensitive: false,
                drought_impact: 0,
                temperature_sensitivity: 0,
                precipitation_impact: 0,
            },
            geopolitical_exposure: GeopoliticalExposure {
                geopolitically_sensitive: true,
                trade_war_impact: 300,      // 3% trade war impact
                sanctions_risk: 500,        // 5% sanctions risk
                supply_chain_vulnerability: 200, // 2% supply chain risk
            },
            market_hours: MarketHours {
                trading_hours_per_day: 24,  // 24/7 trading
                weekend_trading: true,
                holiday_impact: 100,        // 1% holiday volatility increase
            },
        }
    }
    
    /// Agriculture commodity characteristics (Wheat, Corn)
    fn get_agriculture_characteristics() -> CommodityCharacteristics {
        CommodityCharacteristics {
            commodity_type: CommodityType::Agriculture,
            volatility_profile: VolatilityProfile {
                daily_volatility: 450,     // 4.5% daily volatility
                weekly_volatility: 1000,   // 10% weekly volatility
                monthly_volatility: 2000,  // 20% monthly volatility
                max_daily_move: 1500,      // 15% max daily move
                liquidity_score: 6000,     // Medium-high liquidity
            },
            seasonal_pattern: SeasonalPattern {
                has_seasonal_pattern: true,
                peak_season_months: [false, false, true, true, true, false, false, true, true, true, false, false], // Planting & harvest
                seasonal_volatility_multiplier: 15000, // +50% volatility during key seasons
                supply_cycle_impact: 1200,  // 12% supply cycle impact
            },
            weather_dependency: WeatherDependency {
                weather_sensitive: true,
                drought_impact: 2000,       // 20% drought impact
                temperature_sensitivity: 800, // 8% per extreme temperature
                precipitation_impact: 1500, // 15% precipitation impact
            },
            geopolitical_exposure: GeopoliticalExposure {
                geopolitically_sensitive: true,
                trade_war_impact: 1200,     // 12% trade war impact
                sanctions_risk: 800,        // 8% sanctions risk
                supply_chain_vulnerability: 600, // 6% supply chain risk
            },
            market_hours: MarketHours {
                trading_hours_per_day: 17,  // Business hours + some extended
                weekend_trading: false,
                holiday_impact: 300,        // 3% holiday volatility increase
            },
        }
    }
    
    /// Livestock commodity characteristics (Cattle, Hogs)
    fn get_livestock_characteristics() -> CommodityCharacteristics {
        CommodityCharacteristics {
            commodity_type: CommodityType::Livestock,
            volatility_profile: VolatilityProfile {
                daily_volatility: 280,     // 2.8% daily volatility
                weekly_volatility: 600,    // 6% weekly volatility
                monthly_volatility: 1200,  // 12% monthly volatility
                max_daily_move: 800,       // 8% max daily move
                liquidity_score: 5000,     // Medium liquidity
            },
            seasonal_pattern: SeasonalPattern {
                has_seasonal_pattern: true,
                peak_season_months: [false, false, false, false, true, true, true, true, false, false, false, false], // Summer grilling season
                seasonal_volatility_multiplier: 11000, // +10% volatility in summer
                supply_cycle_impact: 800,   // 8% supply cycle impact
            },
            weather_dependency: WeatherDependency {
                weather_sensitive: true,
                drought_impact: 1000,       // 10% drought impact (feed costs)
                temperature_sensitivity: 400, // 4% per extreme temperature
                precipitation_impact: 600,  // 6% precipitation impact
            },
            geopolitical_exposure: GeopoliticalExposure {
                geopolitically_sensitive: false,
                trade_war_impact: 200,      // 2% trade war impact
                sanctions_risk: 100,        // 1% sanctions risk
                supply_chain_vulnerability: 300, // 3% supply chain risk
            },
            market_hours: MarketHours {
                trading_hours_per_day: 16,  // Business hours
                weekend_trading: false,
                holiday_impact: 200,        // 2% holiday volatility increase
            },
        }
    }
}

/// Utility functions for parameter validation and adjustment
impl ParameterOptimizer {
    /// Validate that parameters are within acceptable ranges
    pub fn validate_parameters(params: &OptimizedParameters) -> std::result::Result<(), anchor_lang::error::Error> {
        if params.margin_ratio_initial < 100 || params.margin_ratio_initial > 5000 {
            return Err(ErrorCode::InvalidParameter.into());
        }
        
        if params.margin_ratio_maintenance >= params.margin_ratio_initial {
            return Err(ErrorCode::InvalidParameter.into());
        }
        
        if params.liquidation_fee > 1000 {
            return Err(ErrorCode::InvalidParameter.into());
        }
        
        if params.funding_rate_cap > 1000 {
            return Err(ErrorCode::InvalidParameter.into());
        }
        
        Ok(())
    }
    
    /// Get current month for seasonal adjustments
    pub fn get_current_month() -> usize {
        // In a real implementation, this would get the current month
        // For now, return a placeholder
        0 // January
    }
    
    /// Calculate real-time parameter adjustments based on current market conditions
    pub fn get_dynamic_adjustments(
        commodity_type: CommodityType,
        current_volatility: u32,
        market_stress_level: u32,
    ) -> OptimizedParameters {
        let mut base_params = Self::get_optimized_parameters(commodity_type);
        
        // Adjust for current volatility vs historical
        let characteristics = Self::get_commodity_characteristics(commodity_type);
        let volatility_ratio = current_volatility * 10000 / characteristics.volatility_profile.daily_volatility;
        
        if volatility_ratio > 15000 { // 50% higher than normal
            base_params.margin_ratio_initial = (base_params.margin_ratio_initial * 12000 / 10000).min(2500);
            base_params.funding_rate_cap = (base_params.funding_rate_cap * 12000 / 10000).min(1000);
        }
        
        // Adjust for market stress
        if market_stress_level > 7500 { // High stress
            base_params.liquidation_fee = (base_params.liquidation_fee * 11000 / 10000).min(500);
            base_params.oracle_confidence_threshold = base_params.oracle_confidence_threshold * 8000 / 10000;
        }
        
        base_params
    }
}
