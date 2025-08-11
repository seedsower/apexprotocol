use anchor_lang::prelude::*;
use crate::state::perp_market::PerpMarket;
use crate::error::ErrorCode;

#[derive(Accounts)]
pub struct UpdateWeatherImpact<'info> {
    #[account(mut)]
    pub perp_market: Account<'info, PerpMarket>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
}

pub fn handler(
    ctx: Context<UpdateWeatherImpact>,
    market_index: u16,
    weather_sensitivity: u32,
) -> Result<()> {
    let perp_market = &mut ctx.accounts.perp_market;
    
    require!(perp_market.market_index == market_index, ErrorCode::MarketPaused);
    require!(weather_sensitivity <= 10000, ErrorCode::WeatherSensitivityOutOfRange);
    
    // Update weather sensitivity
    perp_market.weather_sensitivity = weather_sensitivity;
    
    msg!("Updated weather sensitivity for market {} to {}", market_index, weather_sensitivity);
    
    Ok(())
}
