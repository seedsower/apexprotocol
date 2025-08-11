use anchor_lang::prelude::*;
use crate::state::perp_market::PerpMarket;
use crate::error::ErrorCode;

#[derive(Accounts)]
pub struct UpdateSeasonalAdjustments<'info> {
    #[account(mut)]
    pub perp_market: Account<'info, PerpMarket>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
}

pub fn handler(
    ctx: Context<UpdateSeasonalAdjustments>,
    market_index: u16,
    seasonal_multiplier: i32,
) -> Result<()> {
    let perp_market = &mut ctx.accounts.perp_market;
    
    require!(perp_market.market_index == market_index, ErrorCode::MarketPaused);
    require!(seasonal_multiplier >= -5000 && seasonal_multiplier <= 5000, ErrorCode::SeasonalAdjustmentOutOfRange);
    
    // Update seasonal adjustment
    perp_market.seasonal_adjustment = seasonal_multiplier;
    
    msg!("Updated seasonal adjustment for market {} to {}", market_index, seasonal_multiplier);
    
    Ok(())
}
