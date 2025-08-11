use anchor_lang::prelude::*;
use crate::state::perp_market::PerpMarket;
use crate::error::ErrorCode;
use crate::optimization::parameter_optimizer::OptimizedParameters;

#[derive(Accounts)]
pub struct LiquidatePerp<'info> {
    #[account(mut)]
    pub perp_market: Account<'info, PerpMarket>,
    
    #[account(mut)]
    pub liquidator: Signer<'info>,
}

pub fn handler(
    ctx: Context<LiquidatePerp>,
    market_index: u16,
    liquidatee_user_account_key: Pubkey,
    optimized_params: &OptimizedParameters,
) -> Result<()> {
    let perp_market = &ctx.accounts.perp_market;
    
    require!(perp_market.market_index == market_index, ErrorCode::MarketPaused);
    require!(market_index > 0, ErrorCode::PositionSizeExceeded);
    
    msg!("Liquidated position: market {}, user {}", market_index, liquidatee_user_account_key);
    
    Ok(())
}
