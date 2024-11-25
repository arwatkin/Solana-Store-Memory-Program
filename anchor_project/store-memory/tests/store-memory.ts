import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { StoreMemory } from "../target/types/store_memory";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { assert } from "chai";

describe("store_memory", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.StoreMemory as Program<StoreMemory>;

  // Generate a keypair for the user.
  const user = anchor.web3.Keypair.generate();

  // Define constants
  const MEMORY_SEED = "memory";

  // Helper function to derive the memory account PDA.
  function getMemoryAddress(
    userPubkey: PublicKey,
    programId: PublicKey
  ): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(MEMORY_SEED), userPubkey.toBuffer()],
      programId
    );
  }

  // Airdrop SOL to the user.
  async function airdropSol(publicKey: PublicKey, amount = 5e9) {
    // 1 SOL
    const signature = await provider.connection.requestAirdrop(
      publicKey,
      amount
    );
    await provider.connection.confirmTransaction(signature, "confirmed");
  }

  describe("Store Memory", () => {
    before(async () => {
      // Airdrop SOL to the user to cover transaction fees and account rent.
      await airdropSol(user.publicKey);
    });

    it("Successfully stores a memory within the allowed length!", async () => {
      // Define a valid memory string (<= 250 bytes).
      const validMemory = "Hello, this is a valid memory string!";

      // Derive the memory account PDA.
      const [memoryPda, bump] = getMemoryAddress(
        user.publicKey,
        program.programId
      );

      // Invoke the store instruction.
      await program.methods
        .store(validMemory)
        .accounts({
          user: user.publicKey,
          memory: memoryPda,
          systemProgram: SystemProgram.programId,
        })
        .signers([user])
        .rpc({ commitment: "confirmed" });

      // Fetch the stored memory account data.
      const memoryAccount = await program.account.memory.fetch(memoryPda);

      // Assertions to verify that the memory was stored correctly.
      assert.strictEqual(
        memoryAccount.memory,
        validMemory,
        "The stored memory does not match the input."
      );
    });

    it("Fails to store a memory that exceeds the maximum allowed length!", async () => {
      // Define an invalid memory string (> 250 bytes).
      // For simplicity, we'll repeat a character to exceed 250 bytes.
      const invalidMemory = "a".repeat(251); // 251 bytes

      // Derive the memory account PDA.
      const [memoryPda, bump] = getMemoryAddress(
        user.publicKey,
        program.programId
      );

      // Attempt to invoke the store instruction and expect it to fail.
      try {
        await program.methods
          .store(invalidMemory)
          .accounts({
            user: user.publicKey,
            memory: memoryPda,
            systemProgram: SystemProgram.programId,
          })
          .signers([user])
          .rpc({ commitment: "confirmed" });

        // If the transaction succeeds unexpectedly, fail the test.
        assert.fail(
          "The transaction should have failed due to memory length exceeding the limit."
        );
      } catch (error: any) {
        // Parse the error to check if it's the expected `MemoryTooLong` error.
        const expectedErrorMessage =
          "The provided memory exceeds the maximum allowed length.";
        const isExpectedError = error.logs.some((log: string) =>
          log.includes(expectedErrorMessage)
        );

        assert.isTrue(
          isExpectedError,
          `Expected error message to include "${expectedErrorMessage}", but got ${error.logs}`
        );
      }
    });
  });
});
