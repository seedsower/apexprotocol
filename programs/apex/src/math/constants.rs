// Math constants for Apex Protocol
pub const PRECISION: u128 = 1_000_000;
pub const PRICE_PRECISION: u64 = 1_000_000;
pub const AMM_RESERVE_PRECISION: u128 = 1_000_000_000;
pub const QUOTE_PRECISION: u64 = 1_000_000;
pub const BASE_PRECISION: u64 = 1_000_000;

// Commodity-specific constants
pub const MAX_LEVERAGE: u32 = 20;
pub const DEFAULT_MARGIN_RATIO: u32 = 5000; // 5%
pub const LIQUIDATION_BUFFER: u32 = 1000; // 1%

// Commodity-specific funding rate constants
pub const ENERGY_MAX_FUNDING_RATE: u32 = 4167; // 0.4167%
pub const METALS_MAX_FUNDING_RATE: u32 = 2083; // 0.2083%
pub const AGRICULTURE_MAX_FUNDING_RATE: u32 = 4167; // 0.4167%
pub const LIVESTOCK_MAX_FUNDING_RATE: u32 = 3125; // 0.3125%

// Commodity-specific position size limits
pub const MAX_ENERGY_POSITION_SIZE: u64 = 1_000_000 * BASE_PRECISION;
pub const MAX_METALS_POSITION_SIZE: u64 = 500_000 * BASE_PRECISION;
pub const MAX_AGRICULTURE_POSITION_SIZE: u64 = 2_000_000 * BASE_PRECISION;
pub const MAX_LIVESTOCK_POSITION_SIZE: u64 = 750_000 * BASE_PRECISION;

// Commodity-specific oracle confidence thresholds
pub const ENERGY_ORACLE_CONFIDENCE_THRESHOLD: u64 = 80; // 80%
pub const METALS_ORACLE_CONFIDENCE_THRESHOLD: u64 = 85; // 85%
pub const AGRICULTURE_ORACLE_CONFIDENCE_THRESHOLD: u64 = 75; // 75%
pub const LIVESTOCK_ORACLE_CONFIDENCE_THRESHOLD: u64 = 80; // 80%

// Time constants
pub const SECONDS_PER_DAY: u64 = 86400; // 24 * 60 * 60
