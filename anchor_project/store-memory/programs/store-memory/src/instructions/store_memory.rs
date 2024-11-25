use crate::errors::StoreMemoryError;
use crate::states::*;
use anchor_lang::prelude::*;

// context - The StoreMemory struct containing all the relevant accounts
// memory - The memory to be stored
pub fn store_memory(context: Context<StoreMemory>, memory: String) -> Result<()> {
    // Validate the length of the memory string
    if memory.len() > MAX_MEMORY_LENGTH {
        return err!(StoreMemoryError::MemoryTooLong);
    }

    // log a message in the transaction log
    msg!("Hey {}", context.program_id);

    // log another message in the transaction log
    msg!(
        "{}'s stored memory is: {}",
        context.accounts.user.key(),
        memory
    );

    // store the memory in the memory account
    context.accounts.memory.set_inner(Memory { memory });

    Ok(())
}

// struct to hold all the required accounts for the instruction
#[derive(Accounts)]
pub struct StoreMemory<'info> {
    // signer of the transaction
    #[account(mut)]
    pub user: Signer<'info>,

    // initialise the account if it doesn't exist
    // payer of the transaction fee
    // space - minimum space required for the memory account + space for the memory
    // seeds - stores the memory in the correct users account
    #[account(
        init_if_needed,
        payer = user,
        space = ANCHOR_DISCRIMINATOR_SIZE + Memory::INIT_SPACE,
        seeds = [b"memory", user.key().as_ref()],
        bump
    )
    ]
    // name of the account to store the memory
    pub memory: Account<'info, Memory>,

    // system program used for transactions
    pub system_program: Program<'info, System>,
}
