import {PublicKey} from "@solana/web3.js";
import BN from "bn.js";

// 程序 ID (合约地址)
export const PROGRAM_ID = new PublicKey(
    "BiLPns4MjNFjTw3q4HG84iJ8Tqo6FtiTFmeph66aMxw8"
);

// 代币 Mint 地址
export const TOKEN_MINT = new PublicKey(
    "EVdhdgXLk6y3UwxmZKu3aoEcpy4KaHYu825NT7Fcpump"
);

// 接收者地址
export const RECEIVER = new PublicKey(
    "3Csfgy5W9gzF2VHCVAk2b5S2pXniZm23BYEhBgMEPC9t"
);

// PDA seeds
export const DATA_SEED = "data";
export const ADMIN_SEED = "adminGlobal";
export const POINT_SEED = "point";
export const EDITION_MARKER_SEED = "edition_marker";

// Mint Point 相关地址
export const METADATA_INFO = new PublicKey(
    "9gC1rg4RdQU3JEoHsZFm53JheWBPJFLVD5xTTvC2Z4KS"
);//ok

export const MINT_INFO = new PublicKey(
    "6ogLquqLihFzaRgEEdV6zxur2cPZ6Xq5gpSB8Awt38L5"
);//ok


export const MASTER_EDITION_INFO = new PublicKey(
    "HC1pavRK5xMZ1rtmMGd9Dj3gMa1NMVmporfLTogGHr13"
); //ok


export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
); //ok

export const MASTER_METADATA = new PublicKey(
    "A67dVMC36gNRKFqmGG3CqyeLJFVhB4638Y2z2CqsWiUr"
);//ok

export const MASTER_METADATA_MINT_ID = new PublicKey(
    "J85o5CPZv8KUURJt4Kdm4Q42UHLesPbs4ULWs3D9K4cJ"
); //ok

export const EDITION_MARKER_BIT_SIZE = 248;

export const SYSVAR_INSTRUCTIONS = new PublicKey(
    "Sysvar1nstructions1111111111111111111111111"
);

export const EDITION_MARKERPDA = new PublicKey(
    "fa5W7PhdhKEviZm6uMcYtxaPeQDVjxkwmFeCCjX69rZ"
)//没用

export const MASTER_TOKEN_ACCOUNT = new PublicKey("GEBntfuRwS17tM9kK3HdRH5H8bbhG6HCXZRzjXMRsMCh"); // ok

export const NFT_CREATE = new PublicKey("Hrm1SEAf9GQUL5svdDRcTKWQpuAna7PNoWMSWiDcVECx");//ok
// 代币精度
export const TOKEN_DECIMALS = 9;
export const MIN_AMOUNT = 1;//ok

// 其他配置常量
export const MINT_NFT_AMOUNT = {
    EDITION_NUMBER: new BN(1),//ok
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
