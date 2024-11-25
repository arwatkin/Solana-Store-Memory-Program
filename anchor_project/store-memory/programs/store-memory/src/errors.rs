use anchor_lang::prelude::*;

// Errors for StoreMemory program errors.
#[error_code]
pub enum StoreMemoryError {
    #[msg("The provided memory exceeds the maximum allowed length.")]
    MemoryTooLong,
}
