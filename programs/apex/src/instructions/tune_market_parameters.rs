use anchor_lang::prelude::*;
use crate::state::perp_market::PerpMarket;
use crate::state::state::ApexState;
use crate::error::ErrorCode;

#[derive(Accounts)]
pub struct TuneMarketParameters<'info> {
    #[account(mut)]
    pub perp_market: Account<'info, PerpMarket>,
    
    #[account(mut)]
    pub state: Account<'info, ApexState>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<TuneMarketParameters>, market_index: u16) -> Result<()> {
    let perp_market = &mut ctx.accounts.perp_market;
    
    require!(perp_market.market_index == market_index, ErrorCode::MarketPaused);
    
    msg!("Tuned market parameters for market {}", market_index);
    
    Ok(())
}
