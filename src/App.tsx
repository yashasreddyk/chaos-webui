import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Toaster, toast } from 'react-hot-toast';
import { Coins, Shuffle, Send, UserPlus, Wallet } from 'lucide-react';
import { CHAOS_COIN_ADDRESS, CHAOS_COIN_ABI } from './contracts/ChaosCoin';

function App() {
  const [account, setAccount] = useState<string>('');
  const [balance, setBalance] = useState<string>('0');
  const [isOptedIn, setIsOptedIn] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
      const contract = new ethers.Contract(CHAOS_COIN_ADDRESS, CHAOS_COIN_ABI, provider);
      setContract(contract);
    }
  }, []);

  const connectWallet = async () => {
    try {
      if (!provider) return;
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      await updateBalance(accounts[0]);
      await checkOptInStatus(accounts[0]);
    } catch (error) {
      toast.error('Failed to connect wallet');
    }
  };

  const updateBalance = async (address: string) => {
    if (!contract) return;
    const balance = await contract.balanceOf(address);
    setBalance(ethers.formatEther(balance));
  };

  const checkOptInStatus = async (address: string) => {
    if (!contract) return;
    const opted = await contract.optedIn(address);
    setIsOptedIn(opted);
  };

  const requestChaos = async () => {
    try {
      if (!contract || !provider) return;
      const signer = await provider.getSigner();
      const tx = await contract.connect(signer).requestChaos();
      await tx.wait();
      toast.success('Successfully requested Chaos!');
      await updateBalance(account);
    } catch (error) {
      toast.error('Failed to request Chaos');
    }
  };

  const optInToChaos = async () => {
    try {
      if (!contract || !provider) return;
      const signer = await provider.getSigner();
      const tx = await contract.connect(signer).optInToChaos();
      await tx.wait();
      toast.success('Successfully opted in to Chaos!');
      setIsOptedIn(true);
    } catch (error) {
      toast.error('Failed to opt in to Chaos');
    }
  };

  const executeChaosBatch = async () => {
    try {
      if (!contract || !provider) return;
      const signer = await provider.getSigner();
      const tx = await contract.connect(signer).executeChaosBatch();
      await tx.wait();
      toast.success('Successfully executed Chaos batch!');
      await updateBalance(account);
    } catch (error) {
      toast.error('Failed to execute Chaos batch');
    }
  };

  const transfer = async () => {
    try {
      if (!contract || !provider || !transferTo || !transferAmount) return;
      const signer = await provider.getSigner();
      const amount = ethers.parseEther(transferAmount);
      const tx = await contract.connect(signer).transfer(transferTo, amount);
      await tx.wait();
      toast.success('Transfer successful!');
      await updateBalance(account);
      setTransferAmount('');
      setTransferTo('');
    } catch (error) {
      toast.error('Transfer failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black text-white">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-4xl font-bold text-center mb-4">Chaos Coin Interface</h1>
          
          {!account ? (
            <button
              onClick={connectWallet}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Wallet size={20} />
              Connect Wallet
            </button>
          ) : (
            <div className="w-full max-w-3xl space-y-6">
              <div className="bg-purple-800/30 p-6 rounded-lg">
                <p className="text-sm text-purple-300">Connected Account</p>
                <p className="font-mono">{account}</p>
                <p className="mt-2 text-sm text-purple-300">Balance</p>
                <p className="font-mono">{balance} CHAOS</p>
                <p className="mt-2 text-sm text-purple-300">Opted In</p>
                <p className="font-mono">{isOptedIn ? 'Yes' : 'No'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={requestChaos}
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <Coins size={20} />
                  Request Chaos
                </button>

                <button
                  onClick={optInToChaos}
                  disabled={isOptedIn}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <UserPlus size={20} />
                  Opt In to Chaos
                </button>

                <button
                  onClick={executeChaosBatch}
                  className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <Shuffle size={20} />
                  Execute Chaos Batch
                </button>
              </div>

              <div className="bg-purple-800/30 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Send size={20} />
                  Transfer Chaos
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Recipient Address"
                    value={transferTo}
                    onChange={(e) => setTransferTo(e.target.value)}
                    className="w-full bg-purple-900/50 border border-purple-600 rounded-lg px-4 py-2 text-white placeholder-purple-400"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="w-full bg-purple-900/50 border border-purple-600 rounded-lg px-4 py-2 text-white placeholder-purple-400"
                  />
                  <button
                    onClick={transfer}
                    className="w-full bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Transfer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;