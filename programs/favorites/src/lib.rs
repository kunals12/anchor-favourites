use anchor_lang::prelude::*;

declare_id!("GdUGUfarmfcsus3j7MHS2PNmZA43poVRS1su6XGFZDoa");

#[program]
pub mod favorites {
    use super::*;

    pub fn set_favorites(ctx: Context<SetFavorites>, number: u64, color: String, hobbies: Vec<String>) -> Result<()> {
        ctx.accounts.favorites.set_inner(Favorites {
            number,
            color,
            hobbies,
        });
        Ok(())
    }

    pub fn get_favorites(ctx: Context<GetFavorites>) -> Result<Favorites> {
        let favorites = &ctx.accounts.favorites;
        Ok(favorites.clone().into_inner())
    }
}

#[derive(Accounts)]
pub struct SetFavorites<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + Favorites::INIT_SPACE,
        seeds = [b"favorites", user.key().as_ref()],
        bump,
    )]
    pub favorites: Account<'info, Favorites>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct GetFavorites<'info> {
    pub user: Signer<'info>,
    #[account(
        seeds = [b"favorites", user.key().as_ref()],
        bump,
    )]
    pub favorites: Account<'info, Favorites>,
}

#[account]
#[derive(InitSpace)]
pub struct Favorites {
    pub number: u64,
    #[max_len(50)]
    pub color: String,
    #[max_len(5,50)]
    pub hobbies: Vec<String>,
}
