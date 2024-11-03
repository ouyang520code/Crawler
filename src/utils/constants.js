import { PublicKey } from '@solana/web3.js'

// 程序 ID (合约地址)
export const PROGRAM_ID = new PublicKey('ATrEfqjWEjFKjqhb9KNFMnqTTi5vLtdyPiXPVHkv5jd7')

// 代币 Mint 地址
export const TOKEN_MINT = new PublicKey('4F4LHzLMuEVMv5cGhagFNnFyYxzAoJj13FTfUWf623NV')

// 接收者地址
export const RECEIVER = new PublicKey('3seNSMvECriku89kXg6TNNzFpmMeLNqTqooPMxAQQTD1')

// PDA seeds
export const DATA_SEED = "data"  // 用于用户数据的 seed
export const ADMIN_SEED = "adminGlobal"  // 用于管理员的 seed

// 导出所有常量
export const CONSTANTS = {
  PROGRAM_ID,
  TOKEN_MINT,
  RECEIVER,
  DATA_SEED,
  ADMIN_SEED
}