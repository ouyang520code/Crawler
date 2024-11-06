import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

// 程序 ID (合约地址)
export const PROGRAM_ID = new PublicKey(
  "8cCt8xCsoCpuyj6qjRAYgQTZAgaKRtsmcabCM5aMUWAT"
);

// 代币 Mint 地址
export const TOKEN_MINT = new PublicKey(
  "4F4LHzLMuEVMv5cGhagFNnFyYxzAoJj13FTfUWf623NV"
);

// 接收者地址
export const RECEIVER = new PublicKey(
  "3seNSMvECriku89kXg6TNNzFpmMeLNqTqooPMxAQQTD1"
);

// PDA seeds
export const DATA_SEED = "data";
export const ADMIN_SEED = "adminGlobal";
export const POINT_SEED = "point";
export const EDITION_MARKER_SEED = "edition_marker";

// Mint Point 相关地址
export const METADATA_INFO = new PublicKey(
  "55uh8C2y2MKoMpkkPQVHc8EymQ822M1eeYurTim1g5v4"
);
export const MASTER_EDITION_INFO = new PublicKey(
  "25izbF3Xb7P14TFoco4p7kyMvJdNYTUEQp4ZZHPYvw9y"
);
export const MINT_INFO = new PublicKey(
  "3gQVUrzb5qWFsNppMWMVMPMaRkpDBqtH5RZHYaokoBdE"
);
export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

export const MASTER_METADATA = new PublicKey(
  "BVMbuAkQYMYpbygCS8gZZ3s75QkymAe1cuAjNUWKeTQc"
);

export const SYSVAR_INSTRUCTIONS = new PublicKey(
  "Sysvar1nstructions1111111111111111111111111"
);

// 代币精度
export const TOKEN_DECIMALS = 8;
export const MIN_AMOUNT = 1024;

// 其他配置常量
export const MINT_NFT_AMOUNT = {
  EDITION_NUMBER: new BN(1024),
  AMOUNT: new BN(100),
};

// 导出所有常量
export const CONSTANTS = {
  PROGRAM_ID,
  TOKEN_MINT,
  RECEIVER,
  DATA_SEED,
  ADMIN_SEED,
  POINT_SEED,
  EDITION_MARKER_SEED,
  METADATA_INFO,
  MASTER_EDITION_INFO,
  TOKEN_METADATA_PROGRAM_ID,
  MASTER_METADATA,
  SYSVAR_INSTRUCTIONS,
  TOKEN_DECIMALS,
  MIN_AMOUNT,
  MINT_NFT_AMOUNT,
  MINT_INFO
};
