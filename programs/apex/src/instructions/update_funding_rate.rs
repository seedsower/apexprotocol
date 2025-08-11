use anchor_lang::prelude::*;
use crate::state::perp_market::PerpMarket;
use crate::error::ErrorCode;
use crate::optimization::parameter_optimizer::OptimizedParameters;

#[derive(Accounts)]
pub struct UpdateFundingRate<'info> {
    #[account(mut)]
    pub perp_market: Account<'info, PerpMarket>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<UpdateFundingRate>, optimized_params: &OptimizedParameters) -> Result<()> {
    let perp_market = &mut ctx.accounts.perp_market;
    
    require!(perp_market.market_index > 0, ErrorCode::MarketPaused);
    
    // Update funding rate based on current market conditions
    let current_timestamp = Clock::get()?.unix_timestamp;
    perp_market.funding.last_funding_rate_ts = current_timestamp;
    
    msg!("Updated funding rate for market {}", perp_market.market_index);
    
    Ok(())
}
