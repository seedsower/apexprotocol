use anchor_lang::prelude::*;
use crate::state::perp_market::{PerpMarket, OracleSource, CommodityType};
use crate::error::ErrorCode;

#[derive(Accounts)]
pub struct InitializeSpotMarket<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<InitializeSpotMarket>,
    market_index: u16,
    oracle_source: OracleSource,
    optimal_utilization: u32,
    optimal_rate: u32,
    max_rate: u32,
    initial_asset_weight: u32,
    maintenance_asset_weight: u32,
    initial_liability_weight: u32,
) -> Result<()> {
    msg!("Initialized spot market {}", market_index);
    Ok(())
}
