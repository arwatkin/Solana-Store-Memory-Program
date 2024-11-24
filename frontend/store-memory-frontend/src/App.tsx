import { FC } from 'react';
import { WalletButton } from './components/WalletButton';
import { MemoryForm } from './components/MemoryForm';
import '@solana/wallet-adapter-react-ui/styles.css';

const App: FC = () => {
  return (
    <div className="min-h-screen p-4">
      <WalletButton />
      
      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Store Your Memory on Solana
        </h1>
        <MemoryForm />
      </div>
    </div>
  );
};

export default App;