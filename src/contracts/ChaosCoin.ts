export const CHAOS_COIN_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export const CHAOS_COIN_ABI = [
  "function requestChaos() external",
  "function optInToChaos() external",
  "function executeChaosBatch() external",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function optedIn(address) external view returns (bool)",
  "function lastExecuted() external view returns (uint256)",
  "function chaosExecuted() external view returns (bool)"
];