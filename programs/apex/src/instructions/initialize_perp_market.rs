use anchor_lang::prelude::*;
use crate::state::perp_market::{PerpMarket, OracleSource};
use crate::error::ErrorCode;

#[derive(Accounts)]
pub struct InitializePerpMarket<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + std::mem::size_of::<PerpMarket>()
    )]
    pub perp_market: Account<'info, PerpMarket>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<InitializePerpMarket>,
    market_index: u16,
    amm_base_asset_reserve: u128,
    amm_quote_asset_reserve: u128,
    amm_periodicity: i64,
    amm_peg_multiplier: u128,
    oracle_source: OracleSource,
    margin_ratio_initial: u32,
    margin_ratio_maintenance: u32,
    name: [u8; 32],
) -> Result<()> {
    let perp_market = &mut ctx.accounts.perp_market;
    
    // Initialize basic market parameters
    perp_market.market_index = market_index;
    // perp_market.commodity_type = CommodityType::Energy; // Default commodity type
    
    // Initialize with default optimized parameters
    let commodity_type = crate::state::perp_market::CommodityType::Energy; // Default commodity type
    let optimized_params = crate::optimization::parameter_optimizer::ParameterOptimizer::get_optimized_parameters(commodity_type);
    
    // Apply commodity-specific risk parameters
    let recent_trades = vec![(1000000, 100000)]; // Mock recent trades data
    let risk_params = crate::optimization::risk_calculator::RiskCalculator::calculate_market_risk(
        commodity_type,
        1000000, // Mock current price
        1000000, // Mock oracle price
        &recent_trades,
    );
    
    perp_market.margin_ratio_initial = optimized_params.margin_ratio_initial;
    perp_market.margin_ratio_maintenance = optimized_params.margin_ratio_maintenance;
    
    msg!("Initialized perpetual market {} for commodity type {:?}", market_index, commodity_type);
    
    Ok(())
}
