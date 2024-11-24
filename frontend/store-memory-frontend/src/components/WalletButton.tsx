import { FC } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const WalletButton: FC = () => (
  <div className="absolute top-4 right-4">
    <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700" />
  </div>
);