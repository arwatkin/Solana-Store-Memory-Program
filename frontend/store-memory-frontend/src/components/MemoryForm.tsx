import { FC, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
import { StoreMemory } from '../store_memory';
import { Commitment, Connection, TransactionMessage, VersionedTransaction } from '@solana/web3.js';

const programID = new web3.PublicKey('EGspw3uLPvcW6CdH41x9kMuLQRF6jN7Qo8zMkyv9eYTn');
const opts = {
  preflightCommitment: 'confirmed' as Commitment,
  commitment: 'confirmed' as Commitment,
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const MemoryForm: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [memory, setMemory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getLatestBlockhash = async (connection: Connection) => {
    const MAX_RETRIES = 3;
    let retries = 0;
    
    while (retries < MAX_RETRIES) {
      try {
        return await connection.getLatestBlockhash(opts.commitment);
      } catch (error) {
        retries++;
        if (retries === MAX_RETRIES) throw error;
        await sleep(1000);
      }
    }
    throw new Error('Failed to get latest blockhash');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) return;

    try {
      setIsLoading(true);

      const provider = new AnchorProvider(
        connection, 
        window.solana,
        { commitment: opts.commitment }
      );

      const program = new Program(StoreMemory, programID, provider);

      const [memoryPda] = web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from('memory'),
          publicKey.toBuffer(),
        ],
        programID
      );

      const { blockhash, lastValidBlockHeight } = await getLatestBlockhash(connection);

      const transaction = await program.methods
        .store(memory)
        .accounts({
          user: publicKey,
          memory: memoryPda,
          systemProgram: web3.SystemProgram.programId,
        })
        .transaction();

      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const messageV0 = new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: blockhash,
        instructions: transaction.instructions,
      }).compileToV0Message();

      const tx = new VersionedTransaction(messageV0);

      const signature = await sendTransaction(tx, connection, {
        maxRetries: 5,
        skipPreflight: false,
        preflightCommitment: opts.preflightCommitment,
      });

      const status = await connection.confirmTransaction(
        { signature, blockhash, lastValidBlockHeight },
        opts.commitment
      );

      if (status.value.err) {
        throw new Error(`Transaction failed: ${status.value.err.toString()}`);
      }

      setMemory('');
      alert('Memory stored successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to store memory. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <textarea
          value={memory}
          onChange={(e) => setMemory(e.target.value)}
          placeholder="Enter your memory here..."
          className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          maxLength={250}
          required
        />
        <p className="text-sm text-gray-500 text-right mt-1">
          {memory.length}/250 characters
        </p>
      </div>
      
      <button
        type="submit"
        disabled={!publicKey || isLoading}
        className={`w-full py-3 px-4 rounded-lg text-white font-medium transition
          ${publicKey 
            ? 'bg-purple-600 hover:bg-purple-700' 
            : 'bg-gray-400 cursor-not-allowed'
          } ${isLoading ? 'opacity-75 cursor-wait' : ''}`}
      >
        {isLoading 
          ? 'Storing...' 
          : !publicKey 
            ? 'Connect Wallet to Store' 
            : 'Store Memory'}
      </button>
    </form>
  );
};