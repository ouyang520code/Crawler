import { PublicKey } from '@solana/web3.js'

// 程序 ID (合约地址)
export const PROGRAM_ID = new PublicKey('8cCt8xCsoCpuyj6qjRAYgQTZAgaKRtsmcabCM5aMUWAT')

// 代币 Mint 地址
export const TOKEN_MINT = new PublicKey('4F4LHzLMuEVMv5cGhagFNnFyYxzAoJj13FTfUWf623NV')

// 接收者地址
export const RECEIVER = new PublicKey('3seNSMvECriku89kXg6TNNzFpmMeLNqTqooPMxAQQTD1')

// PDA seeds
export const DATA_SEED = "data"
export const ADMIN_SEED = "adminGlobal"
export const POINT_SEED = "point"

// Mint Point 相关地址
export const METADATA_INFO = new PublicKey('DwxS2MSHYBfxSWG3tuzPJ6qbH4Y1n3pnkyAR6MGARhav')
export const MASTER_EDITION_INFO = new PublicKey('72yMP3AhsBUjipyzWE9Mg8pVBzeh4V1kkZgLdgXu327C')
export const MINT_INFO = new PublicKey('9Nw3PubVwQaAG6wgizM1oC47zmgsjvo7c5ctk6yWNzV2')
export const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')
export const SYSVAR_INSTRUCTIONS = new PublicKey('Sysvar1nstructions1111111111111111111111111')

// 代币精度
export const TOKEN_DECIMALS = 8
export const MIN_AMOUNT = 1024

// 导出所有常量
export const CONSTANTS = {
  PROGRAM_ID,
  TOKEN_MINT,
  RECEIVER,
  DATA_SEED,
  ADMIN_SEED,
  POINT_SEED,
  METADATA_INFO,
  MASTER_EDITION_INFO,
  MINT_INFO,
  TOKEN_METADATA_PROGRAM_ID,
  SYSVAR_INSTRUCTIONS,
  TOKEN_DECIMALS,
  MIN_AMOUNT
}