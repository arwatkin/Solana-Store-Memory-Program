use crate::instructions::*;
use anchor_lang::prelude::*;

declare_id!("EGspw3uLPvcW6CdH41x9kMuLQRF6jN7Qo8zMkyv9eYTn");

pub mod errors;
pub mod instructions;
pub mod states;

#[program]
pub mod store_memory {
    use super::*;

    pub fn store(context: Context<StoreMemory>, memory: String) -> Result<()> {
        store_memory(context, memory)
    }
}
