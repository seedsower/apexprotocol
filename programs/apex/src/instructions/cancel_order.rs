use anchor_lang::prelude::*;
use crate::state::perp_market::PerpMarket;
use crate::error::ErrorCode;

#[derive(Accounts)]
pub struct CancelOrder<'info> {
    #[account(mut)]
    pub perp_market: Account<'info, PerpMarket>,
    
    #[account(mut)]
    pub user: Signer<'info>,
}

pub fn handler(ctx: Context<CancelOrder>, order_id: Option<u32>) -> Result<()> {
    let perp_market = &ctx.accounts.perp_market;
    
    require!(order_id.is_some(), ErrorCode::InvalidOrderId);
    
    msg!("Cancelled order: order_id {:?}", order_id);
    
    Ok(())
}
