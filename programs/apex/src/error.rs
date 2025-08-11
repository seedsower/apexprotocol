use anchor_lang::prelude::*;

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
    #[msg("Invalid order ID provided")]
    InvalidOrderId,
    #[msg("Weather sensitivity out of range")]
    WeatherSensitivityOutOfRange,
    #[msg("Geopolitical sensitivity out of range")]
    GeopoliticalSensitivityOutOfRange,
    #[msg("Invalid parameter value")]
    InvalidParameter,
}
