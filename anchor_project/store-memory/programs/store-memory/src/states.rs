use anchor_lang::prelude::*;

// minimum each anchor account requires
pub const ANCHOR_DISCRIMINATOR_SIZE: usize = 8;
pub const MAX_MEMORY_LENGTH: usize = 250;

// account to store the memory
#[account]
#[derive(InitSpace)]
pub struct Memory {
    #[max_len(MAX_MEMORY_LENGTH)]
    pub memory: String,
}
