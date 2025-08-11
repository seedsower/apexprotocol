use anchor_lang::prelude::*;

#[account]
#[derive(Debug)]
pub struct ApexState {
    pub admin: Pubkey,
    pub exchange_status: u8,
    pub funding_paused: bool,
    pub fill_paused: bool,
    pub amm_paused: bool,
    pub padding: [u8; 32],
}

impl ApexState {
    pub fn is_exchange_paused(&self) -> bool {
        self.exchange_status != 0
    }
}
