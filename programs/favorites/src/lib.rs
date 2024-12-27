use anchor_lang::prelude::*;

declare_id!("GdUGUfarmfcsus3j7MHS2PNmZA43poVRS1su6XGFZDoa");

#[program]
pub mod favorites {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
