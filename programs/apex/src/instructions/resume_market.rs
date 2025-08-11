use anchor_lang::prelude::*;
use crate::state::perp_market::PerpMarket;
use crate::error::ErrorCode;

#[derive(Accounts)]
pub struct ResumeMarket<'info> {
    #[account(mut)]
    pub perp_market: Account<'info, PerpMarket>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
}

pub fn handler(
    ctx: Context<ResumeMarket>,
    market_index: u16,
) -> Result<()> {
    let perp_market = &mut ctx.accounts.perp_market;
    
    require!(perp_market.market_index == market_index, ErrorCode::MarketPaused);
    
    // Resume market operations
    perp_market.paused_operations = 0;
    
    msg!("Resumed market operations for market {}", market_index);
    
    Ok(())
}
