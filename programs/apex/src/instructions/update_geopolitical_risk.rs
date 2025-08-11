use anchor_lang::prelude::*;
use crate::state::perp_market::PerpMarket;
use crate::error::ErrorCode;

#[derive(Accounts)]
pub struct UpdateGeopoliticalRisk<'info> {
    #[account(mut)]
    pub perp_market: Account<'info, PerpMarket>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
}

pub fn handler(
    ctx: Context<UpdateGeopoliticalRisk>,
    market_index: u16,
    geopolitical_sensitivity: u32,
) -> Result<()> {
    let perp_market = &mut ctx.accounts.perp_market;
    
    require!(perp_market.market_index == market_index, ErrorCode::MarketPaused);
    require!(geopolitical_sensitivity <= 10000, ErrorCode::GeopoliticalSensitivityOutOfRange);
    
    // Update geopolitical sensitivity
    perp_market.geopolitical_sensitivity = geopolitical_sensitivity;
    
    msg!("Updated geopolitical sensitivity for market {} to {}", market_index, geopolitical_sensitivity);
    
    Ok(())
}
