use anchor_lang::prelude::*;
use crate::state::perp_market::PerpMarket;
use crate::error::ErrorCode;

#[derive(Accounts)]
pub struct EmergencyPauseMarket<'info> {
    #[account(mut)]
    pub perp_market: Account<'info, PerpMarket>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
}

pub fn handler(
    ctx: Context<EmergencyPauseMarket>,
    market_index: u16,
    pause_reason: u8,
) -> Result<()> {
    let perp_market = &mut ctx.accounts.perp_market;
    
    require!(perp_market.market_index == market_index, ErrorCode::MarketPaused);
    
    // Set market to paused state
    perp_market.paused_operations = pause_reason;
    
    msg!("Emergency paused market {} with reason {}", market_index, pause_reason);
    
    Ok(())
}
