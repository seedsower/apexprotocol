// use anchor_lang::prelude::*; // Commented out unused import
use crate::math::constants::*;
use crate::state::perp_market::CommodityType;
use crate::optimization::parameter_optimizer::OptimizedParameters;
// use crate::optimization::parameter_optimizer::VolatilityProfile; // Commented out unused import

/// Advanced risk calculation system for Apex Protocol
/// Implements real-time risk assessment and dynamic parameter adjustment
/// based on market conditions, portfolio exposure, and systemic risk factors.

#[derive(Clone, Copy, Debug)]
pub struct RiskMetrics {
    pub portfolio_var: u64,           // Value at Risk (in quote precision)
    pub expected_shortfall: u64,      // Expected Shortfall/CVaR
    pub concentration_risk: u32,      // Concentration risk score (0-10000)
    pub liquidity_risk: u32,          // Liquidity risk score (0-10000)
    pub correlation_risk: u32,        // Cross-commodity correlation risk
    pub systemic_risk: u32,           // Overall systemic risk level
}

#[derive(Clone, Copy, Debug)]
pub struct PositionRisk {
    pub notional_value: u64,          // Position notional value
    pub margin_requirement: u64,      // Required margin
    pub liquidation_threshold: u64,   // Price level triggering liquidation
    pub time_to_liquidation: u32,     // Estimated time to liquidation (seconds)
    pub slippage_risk: u32,           // Expected slippage on liquidation
}

#[derive(Clone, Copy, Debug)]
pub struct MarketRisk {
    pub current_volatility: u32,      // Current implied volatility
    pub volatility_trend: i32,        // Volatility trend (+/- basis points)
    pub liquidity_depth: u64,         // Market depth in quote currency
    pub bid_ask_spread: u32,          // Current bid-ask spread (basis points)
    pub oracle_deviation: u32,        // Oracle vs mark price deviation
}

/// Risk calculator implementation
pub struct RiskCalculator;

impl RiskCalculator {
    /// Calculate comprehensive risk metrics for a position
    pub fn calculate_position_risk(
        _commodity_type: CommodityType, // Prefixed with underscore to indicate intentionally unused
        position_size: i64,
        entry_price: u64,
        current_price: u64,
        account_collateral: u64,
        params: &OptimizedParameters,
    ) -> PositionRisk {
        let notional_value = (position_size.abs() as u64 * current_price) / PRICE_PRECISION;
        
        // Calculate margin requirement with dynamic adjustments
        let margin_requirement = Self::calculate_dynamic_margin(
            notional_value,
            _commodity_type,
            params,
        );
        
        // Calculate liquidation threshold
        let liquidation_threshold = Self::calculate_liquidation_threshold(
            entry_price,
            position_size > 0,
            params.margin_ratio_maintenance,
        );
        
        // Estimate time to liquidation based on volatility
        let time_to_liquidation = Self::estimate_liquidation_time(
            current_price,
            liquidation_threshold,
            _commodity_type,
        );
        
        // Calculate expected slippage
        let slippage_risk = Self::calculate_slippage_risk(
            position_size.abs() as u64,
            _commodity_type,
        );
        
        PositionRisk {
            notional_value,
            margin_requirement,
            liquidation_threshold,
            time_to_liquidation,
            slippage_risk,
        }
    }
    
    /// Calculate portfolio-level risk metrics
    pub fn calculate_portfolio_risk(
        positions: &[(CommodityType, i64, u64)], // (commodity, size, price)
        total_collateral: u64,
        correlation_matrix: &[[i32; 4]; 4], // 4x4 correlation matrix for commodity types
    ) -> RiskMetrics {
        // Calculate portfolio VaR using Monte Carlo simulation
        let portfolio_var = Self::calculate_portfolio_var(positions, correlation_matrix);
        
        // Calculate Expected Shortfall (average loss beyond VaR)
        let expected_shortfall = (portfolio_var * 13000) / 10000; // 130% of VaR
        
        // Calculate concentration risk
        let concentration_risk = Self::calculate_concentration_risk(positions, total_collateral);
        
        // Calculate liquidity risk
        let liquidity_risk = Self::calculate_liquidity_risk(positions);
        
        // Calculate correlation risk
        let correlation_risk = Self::calculate_correlation_risk(positions, correlation_matrix);
        
        // Calculate systemic risk
        let systemic_risk = Self::calculate_systemic_risk(
            concentration_risk,
            liquidity_risk,
            correlation_risk,
        );
        
        RiskMetrics {
            portfolio_var,
            expected_shortfall,
            concentration_risk,
            liquidity_risk,
            correlation_risk,
            systemic_risk,
        }
    }
    
    /// Calculate market risk metrics
    pub fn calculate_market_risk(
        _commodity_type: CommodityType, // Prefixed with underscore to indicate intentionally unused
        current_price: u64,
        oracle_price: u64,
        recent_trades: &[(u64, u64)], // (price, volume) pairs
    ) -> MarketRisk {
        // Calculate current implied volatility from recent price movements
        let current_volatility = Self::calculate_implied_volatility(recent_trades);
        
        // Calculate volatility trend
        let volatility_trend = Self::calculate_volatility_trend(recent_trades);
        
        // Calculate market depth
        let liquidity_depth = Self::estimate_market_depth(recent_trades);
        
        // Calculate bid-ask spread
        let bid_ask_spread = Self::estimate_bid_ask_spread(recent_trades);
        
        // Calculate oracle deviation
        let oracle_deviation = if oracle_price > 0 {
            ((current_price.max(oracle_price) - current_price.min(oracle_price)) * 10000) / oracle_price
        } else {
            0
        };
        
        MarketRisk {
            current_volatility,
            volatility_trend,
            liquidity_depth,
            bid_ask_spread: bid_ask_spread as u32,
            oracle_deviation: oracle_deviation as u32,
        }
    }
    
    /// Calculate dynamic margin requirement based on current risk factors
    fn calculate_dynamic_margin(
        notional_value: u64,
        _commodity_type: CommodityType, // Prefixed with underscore to indicate intentionally unused
        params: &OptimizedParameters,
    ) -> u64 {
        let base_margin = (notional_value * params.margin_ratio_initial as u64) / 10000;
        
        // Apply volatility adjustment
        let volatility_adjusted = (base_margin * params.volatility_adjustment as u64) / 10000;
        
        // Apply seasonal adjustment
        let seasonal_adjustment = if params.seasonal_multiplier >= 0 {
            10000 + params.seasonal_multiplier as u32
        } else {
            10000 - (-params.seasonal_multiplier) as u32
        };
        let seasonal_adjusted = (volatility_adjusted * seasonal_adjustment as u64) / 10000;
        
        // Apply weather and geopolitical adjustments
        let weather_adjusted = (seasonal_adjusted * params.weather_sensitivity as u64) / 10000;
        let final_margin = (weather_adjusted * params.geopolitical_sensitivity as u64) / 10000;
        
        final_margin
    }
    
    /// Calculate liquidation threshold price
    fn calculate_liquidation_threshold(
        entry_price: u64,
        is_long: bool,
        maintenance_margin_ratio: u32,
    ) -> u64 {
        let margin_factor = 10000 - maintenance_margin_ratio;
        
        if is_long {
            // For long positions, liquidation occurs when price drops
            (entry_price * margin_factor as u64) / 10000
        } else {
            // For short positions, liquidation occurs when price rises
            (entry_price * (10000 + maintenance_margin_ratio) as u64) / 10000
        }
    }
    
    /// Estimate time to liquidation based on volatility
    fn estimate_liquidation_time(
        current_price: u64,
        liquidation_price: u64,
        _commodity_type: CommodityType, // Prefixed with underscore to indicate intentionally unused
    ) -> u32 {
        let price_distance = if current_price > liquidation_price {
            current_price - liquidation_price
        } else {
            liquidation_price - current_price
        };
        
        let price_distance_pct = (price_distance * 10000) / current_price;
        
        // Get expected daily volatility for commodity type
        let daily_volatility = match _commodity_type {
            CommodityType::Energy => 350,      // 3.5%
            CommodityType::Metals => 180,      // 1.8%
            CommodityType::Agriculture => 450, // 4.5%
            CommodityType::Livestock => 280,   // 2.8%
        };
        
        // Estimate time using volatility (simplified model)
        if daily_volatility > 0 {
            let days_to_liquidation = (price_distance_pct * price_distance_pct) / (daily_volatility * daily_volatility);
            ((days_to_liquidation as u64 * SECONDS_PER_DAY).min(30 * SECONDS_PER_DAY)) as u32 // Cap at 30 days
        } else {
            (30 * SECONDS_PER_DAY) as u32 // Default to 30 days
        }
    }
    
    /// Calculate expected slippage on liquidation
    fn calculate_slippage_risk(position_size: u64, commodity_type: CommodityType) -> u32 {
        // Base slippage depends on commodity liquidity
        let base_slippage = match commodity_type {
            CommodityType::Metals => 50,       // 0.5% for highly liquid metals
            CommodityType::Energy => 100,      // 1% for energy
            CommodityType::Livestock => 200,   // 2% for livestock
            CommodityType::Agriculture => 150, // 1.5% for agriculture
        };
        
        // Adjust for position size (larger positions have more slippage)
        let size_multiplier = if position_size > 10_000_000 * BASE_PRECISION {
            20000 // 2x slippage for very large positions
        } else if position_size > 1_000_000 * BASE_PRECISION {
            15000 // 1.5x slippage for large positions
        } else {
            10000 // No adjustment for normal positions
        };
        
        (base_slippage * size_multiplier) / 10000
    }
    
    /// Calculate portfolio Value at Risk using simplified Monte Carlo
    fn calculate_portfolio_var(
        positions: &[(CommodityType, i64, u64)],
        correlation_matrix: &[[i32; 4]; 4],
    ) -> u64 {
        let mut total_var = 0u64;
        
        for (i, &(commodity_type_i, size_i, price_i)) in positions.iter().enumerate() {
            let notional_i = (size_i.abs() as u64 * price_i) / PRICE_PRECISION;
            
            // Individual VaR (95% confidence, 1-day horizon)
            let individual_volatility = match commodity_type_i {
                CommodityType::Energy => 350,
                CommodityType::Metals => 180,
                CommodityType::Agriculture => 450,
                CommodityType::Livestock => 280,
            };
            
            let individual_var = (notional_i * individual_volatility as u64 * 165) / 100000; // 1.65 * volatility for 95% VaR
            
            total_var += individual_var * individual_var;
            
            // Add correlation effects
            for (j, &(commodity_type_j, size_j, price_j)) in positions.iter().enumerate() {
                if i != j {
                    let notional_j = (size_j.abs() as u64 * price_j) / PRICE_PRECISION;
                    let correlation = correlation_matrix[commodity_type_i as usize][commodity_type_j as usize];
                    
                    let individual_volatility_j = match commodity_type_j {
                        CommodityType::Energy => 350,
                        CommodityType::Metals => 180,
                        CommodityType::Agriculture => 450,
                        CommodityType::Livestock => 280,
                    };
                    
                    let individual_var_j = (notional_j * individual_volatility_j as u64 * 165) / 100000;
                    let correlation_contribution = (2 * individual_var * individual_var_j * correlation.abs() as u64) / 10000;
                    
                    total_var += correlation_contribution;
                }
            }
        }
        
        // Return square root for final VaR
        Self::integer_sqrt(total_var)
    }
    
    /// Calculate concentration risk
    fn calculate_concentration_risk(
        positions: &[(CommodityType, i64, u64)],
        total_collateral: u64,
    ) -> u32 {
        let mut max_exposure = 0u64;
        let mut total_exposure = 0u64;
        
        for &(_, size, price) in positions {
            let notional = (size.abs() as u64 * price) / PRICE_PRECISION;
            total_exposure += notional;
            max_exposure = max_exposure.max(notional);
        }
        
        if total_exposure > 0 {
            // Concentration risk as percentage of largest position
            ((max_exposure * 10000) / total_exposure) as u32
        } else {
            0
        }
    }
    
    /// Calculate liquidity risk
    fn calculate_liquidity_risk(positions: &[(CommodityType, i64, u64)]) -> u32 {
        let mut weighted_liquidity_risk = 0u64;
        let mut total_notional = 0u64;
        
        for &(commodity_type, size, price) in positions {
            let notional = (size.abs() as u64 * price) / PRICE_PRECISION;
            total_notional += notional;
            
            // Liquidity risk score by commodity type
            let liquidity_risk = match commodity_type {
                CommodityType::Metals => 1000,     // 10% - highly liquid
                CommodityType::Energy => 2000,     // 20% - good liquidity
                CommodityType::Agriculture => 4000, // 40% - medium liquidity
                CommodityType::Livestock => 5000,   // 50% - lower liquidity
            };
            
            weighted_liquidity_risk += notional * liquidity_risk as u64;
        }
        
        if total_notional > 0 {
            (weighted_liquidity_risk / total_notional) as u32
        } else {
            0
        }
    }
    
    /// Calculate correlation risk
    fn calculate_correlation_risk(
        positions: &[(CommodityType, i64, u64)],
        correlation_matrix: &[[i32; 4]; 4],
    ) -> u32 {
        if positions.len() < 2 {
            return 0; // No correlation risk with single position
        }
        
        let mut max_correlation = 0i32;
        let mut total_notional = 0u64;
        
        for &(_, size, price) in positions {
            total_notional += (size.abs() as u64 * price) / PRICE_PRECISION;
        }
        
        // Find maximum correlation between any two positions
        for (i, &(commodity_type_i, size_i, price_i)) in positions.iter().enumerate() {
            for (j, &(commodity_type_j, size_j, price_j)) in positions.iter().enumerate() {
                if i < j {
                    let correlation = correlation_matrix[commodity_type_i as usize][commodity_type_j as usize];
                    let notional_i = (size_i.abs() as u64 * price_i) / PRICE_PRECISION;
                    let notional_j = (size_j.abs() as u64 * price_j) / PRICE_PRECISION;
                    
                    // Weight correlation by position sizes
                    let weight = ((notional_i + notional_j) * 10000) / total_notional;
                    let weighted_correlation = (correlation * weight as i32) / 10000;
                    
                    max_correlation = max_correlation.max(weighted_correlation.abs());
                }
            }
        }
        
        max_correlation as u32
    }
    
    /// Calculate systemic risk
    fn calculate_systemic_risk(
        concentration_risk: u32,
        liquidity_risk: u32,
        correlation_risk: u32,
    ) -> u32 {
        // Combine risk factors with weights
        let weighted_risk = (concentration_risk * 3 + liquidity_risk * 4 + correlation_risk * 3) / 10;
        weighted_risk.min(10000) // Cap at 100%
    }
    
    /// Calculate implied volatility from recent trades
    fn calculate_implied_volatility(recent_trades: &[(u64, u64)]) -> u32 {
        if recent_trades.len() < 2 {
            return 300; // Default 3% volatility
        }
        
        let mut price_changes = Vec::new();
        for i in 1..recent_trades.len() {
            let prev_price = recent_trades[i-1].0;
            let curr_price = recent_trades[i].0;
            
            if prev_price > 0 {
                let change = if curr_price > prev_price {
                    ((curr_price - prev_price) * 10000) / prev_price
                } else {
                    ((prev_price - curr_price) * 10000) / prev_price
                };
                price_changes.push(change);
            }
        }
        
        if price_changes.is_empty() {
            return 300;
        }
        
        // Calculate standard deviation of price changes
        let mean = price_changes.iter().sum::<u64>() / price_changes.len() as u64;
        let variance = price_changes.iter()
            .map(|&x| {
                let diff = if x > mean { x - mean } else { mean - x };
                diff * diff
            })
            .sum::<u64>() / price_changes.len() as u64;
        
        Self::integer_sqrt(variance) as u32
    }
    
    /// Calculate volatility trend
    fn calculate_volatility_trend(recent_trades: &[(u64, u64)]) -> i32 {
        if recent_trades.len() < 4 {
            return 0; // No trend data
        }
        
        let mid_point = recent_trades.len() / 2;
        let early_volatility = Self::calculate_period_volatility(&recent_trades[..mid_point]);
        let recent_volatility = Self::calculate_period_volatility(&recent_trades[mid_point..]);
        
        (recent_volatility as i32) - (early_volatility as i32)
    }
    
    /// Calculate volatility for a specific period
    fn calculate_period_volatility(trades: &[(u64, u64)]) -> u32 {
        if trades.len() < 2 {
            return 300;
        }
        
        let mut sum_squared_changes = 0u64;
        let mut count = 0;
        
        for i in 1..trades.len() {
            let prev_price = trades[i-1].0;
            let curr_price = trades[i].0;
            
            if prev_price > 0 {
                let change = if curr_price > prev_price {
                    ((curr_price - prev_price) * 10000) / prev_price
                } else {
                    ((prev_price - curr_price) * 10000) / prev_price
                };
                sum_squared_changes += change * change;
                count += 1;
            }
        }
        
        if count > 0 {
            Self::integer_sqrt(sum_squared_changes / count as u64) as u32
        } else {
            300
        }
    }
    
    /// Estimate market depth from recent trades
    fn estimate_market_depth(recent_trades: &[(u64, u64)]) -> u64 {
        // Simple estimation based on recent volume
        recent_trades.iter().map(|&(_, volume)| volume).sum::<u64>() / recent_trades.len().max(1) as u64
    }
    
    /// Estimate bid-ask spread from recent trades
    fn estimate_bid_ask_spread(recent_trades: &[(u64, u64)]) -> u64 {
        if recent_trades.len() < 2 {
            return 100; // Default 1% spread
        }
        
        let mut spreads = Vec::new();
        for i in 1..recent_trades.len() {
            let prev_price = recent_trades[i-1].0;
            let curr_price = recent_trades[i].0;
            
            if prev_price > 0 && curr_price > 0 {
                let spread = if curr_price > prev_price {
                    ((curr_price - prev_price) * 10000) / prev_price
                } else {
                    ((prev_price - curr_price) * 10000) / prev_price
                };
                spreads.push(spread);
            }
        }
        
        if spreads.is_empty() {
            100
        } else {
            spreads.iter().sum::<u64>() / spreads.len() as u64
        }
    }
    
    /// Integer square root implementation
    fn integer_sqrt(n: u64) -> u64 {
        if n == 0 {
            return 0;
        }
        
        let mut x = n;
        let mut y = (x + 1) / 2;
        
        while y < x {
            x = y;
            y = (x + n / x) / 2;
        }
        
        x
    }
}

/// Default correlation matrix for commodity types
/// Values are in basis points (-10000 to +10000)
pub const DEFAULT_CORRELATION_MATRIX: [[i32; 4]; 4] = [
    // Energy, Metals, Agriculture, Livestock
    [10000,  2000,   1500,   1000], // Energy
    [ 2000, 10000,    500,    300], // Metals  
    [ 1500,   500,  10000,   3000], // Agriculture
    [ 1000,   300,   3000,  10000], // Livestock
];

/// Risk thresholds for different risk levels
pub const RISK_THRESHOLDS: [u32; 5] = [
    2000, // Low risk: 20%
    4000, // Medium-low risk: 40%
    6000, // Medium risk: 60%
    8000, // High risk: 80%
    10000, // Very high risk: 100%
];

/// Get risk level description
pub fn get_risk_level(risk_score: u32) -> &'static str {
    match risk_score {
        0..=2000 => "Low",
        2001..=4000 => "Medium-Low",
        4001..=6000 => "Medium",
        6001..=8000 => "High",
        _ => "Very High",
    }
}
