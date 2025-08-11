use anchor_lang::prelude::*;
use crate::state::state::ApexState as State;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + std::mem::size_of::<State>()
    )]
    pub state: Account<'info, State>,
    
    #[account(mut)]
    pub admin: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<Initialize>,
    admin: Pubkey,
) -> Result<()> {
    let state = &mut ctx.accounts.state;
    
    // Initialize Apex state with basic parameters
    state.admin = admin;
    state.exchange_status = 0;
    state.funding_paused = false;
    state.fill_paused = false;
    state.amm_paused = false;
    
    msg!("Initialized Apex Protocol with admin: {}", admin);
    
    Ok(())
}
