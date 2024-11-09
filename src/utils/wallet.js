import {
    Connection,
    PublicKey,
    LAMPORTS_PER_SOL,
    clusterApiUrl, Keypair,
} from "@solana/web3.js";
import {AnchorProvider} from "@project-serum/anchor";
import {PhantomWalletAdapter} from "@solana/wallet-adapter-phantom";
import {NFT_CREATE, TOKEN_MINT} from "./constants";
import {getAssociatedTokenAddress} from "@solana/spl-token";
import {createAssociatedTokenAccountInstruction} from "@solana/spl-token";
import {Transaction} from "@solana/web3.js";
import {showFailToast, showToast} from "vant";
import {keypairIdentity, Metaplex} from "@metaplex-foundation/js";


// 导出钱包适配器
export const wallets = [new PhantomWalletAdapter()];

// 导出网络端点
export const endpoint = clusterApiUrl("devnet");

export class WalletService {
    constructor() {
        this.connection = new Connection(endpoint);
        this.callbacks = {
            onConnect: null,
            onDisconnect: null,
        };
        this.wallet = null;
    }

    // 检查钱包是否已安装
    checkWalletInstalled() {
        return "solana" in window && window.solana.isPhantom;
    }

    // 获取钱包实例
    getPhantomWallet() {
        return window.solana;
    }

    async fetchAllNft() {

        const connection = this.getConnection();
        // const keypair = Keypair.generate();
        const metaplex = new Metaplex(connection);
        let num = 0;
        const allNFTs = await metaplex.nfts().findAllByOwner({"owner":this.wallet.publicKey});
        console.log(allNFTs)
        for (const allNFTsKey in allNFTs) {
            if (allNFTs[allNFTsKey].creators[0].address.toBase58() == NFT_CREATE.toBase58()
                && allNFTs[allNFTsKey].name == "1024") {

                num += 1;
            }
        }
        return num;
    };

    // 连接钱包
    async connectWallet() {
        try {
            const wallet = this.getPhantomWallet();
            if (!wallet) {
                throw new Error("请安装 Phantom 钱包");
            }
            await wallet.connect();
            this.wallet = wallet;

            return wallet;
        } catch (error) {
            console.error("Wallet connection error:", error);
            throw error;
        }
    }

    // 获取 Provider
    getProvider(wallet) {
        if (!wallet) return null;
        return new AnchorProvider(
            this.connection,
            {
                publicKey: wallet.publicKey,
                signTransaction: (message) => wallet.signTransaction(message),
                signAllTransactions: (messages) => wallet.signAllTransactions(messages),
            },
            {
                preflightCommitment: "confirmed",
                commitment: "confirmed",
            }
        );
    }

    // 获取 SOL 余额
    async getSolBalance(publicKey) {
        try {
            const balance = await this.connection.getBalance(publicKey);
            return balance / LAMPORTS_PER_SOL;
        } catch (error) {
            console.error("Error getting SOL balance:", error);
            return 0;
        }
    }

    // 获取代币余额
    async getTokenBalance(owner, mint = TOKEN_MINT) {
        try {
            if (!owner) {
                console.warn("No owner provided for getTokenBalance");
                return 0;
            }

            // 验证 mint 地址
            if (!mint) {
                console.warn("No mint address provided for getTokenBalance");
                return 0;
            }

            // 获取用户代币账户
            const tokenAccount = await this.getUserTokenAccount(mint);

            if (!tokenAccount.exists || !tokenAccount.address) {
                return 0;
            }

            // 获取代币余额
            try {
                const accountInfo = await this.connection.getTokenAccountBalance(
                    tokenAccount.address
                );
                return accountInfo.value.uiAmount || 0;
            } catch (error) {
                console.error("Error getting token balance:", error);
                return 0;
            }
        } catch (error) {
            console.error("Error getting token balance:", error);
            // 对于任何错误，返回0而不是抛出错误
            return 0;
        }
    }

    // 检查用户取消
    isUserRejection(error) {
        if (!error?.message) return false;
        const message = error.message.toLowerCase();
        return (
            message.includes("user rejected") ||
            message.includes("user canceled") ||
            message.includes("user cancelled") ||
            message.includes("transaction cancelled") ||
            message.includes("rejected the request") ||
            message.includes("user denied") ||
            message.includes("declined by user")
        );
    }

    // 设置回调
    setCallbacks(callbacks) {
        this.callbacks = {
            onConnect: (wallet) => {
                this.wallet = wallet;
                callbacks.onConnect?.(wallet);
            },
            onDisconnect: () => {
                this.wallet = null;
                callbacks.onDisconnect?.();
            },
        };
    }

    // 初始化钱包监听
    initWalletListeners() {
        const wallet = this.getPhantomWallet();
        if (wallet) {
            // 移除旧的监听器
            this.removeWalletListeners();

            // 添加新的监听器
            wallet.on("connect", () => {
                console.log("Wallet connected event");
                this.callbacks.onConnect?.(wallet);
            });

            wallet.on("disconnect", () => {
                console.log("Wallet disconnected event");
                this.callbacks.onDisconnect?.();
            });

            // 检查是否已连接
            if (wallet.isConnected) {
                this.callbacks.onConnect?.(wallet);
            }

            return true;
        }
        return false;
    }

    // 移除钱包监听
    removeWalletListeners() {
        const wallet = this.getPhantomWallet();
        if (wallet) {
            wallet.removeAllListeners("connect");
            wallet.removeAllListeners("disconnect");
        }
    }

    // 清理
    cleanup() {
        this.removeWalletListeners();
        this.callbacks = {
            onConnect: null,
            onDisconnect: null,
        };
    }

    // 获取 connection 实例
    getConnection() {
        return this.connection;
    }

    /**
     * Gets or creates the user's associated token account
     * @returns {Promise<{address: PublicKey}>} The token account address
     */
    async getUserTokenAccount(mint = TOKEN_MINT) {
        if (!this.wallet?.publicKey) {
            showToast("Wallet connection failed");
            throw new Error("Wallet not connected");
        }

        try {
            // 获取用户代币账户地址
            const userTokenAccount = await getAssociatedTokenAddress(
                mint,
                this.wallet.publicKey
            );

            // 检查代币账户是否存在
            const tokenAccountInfo = await this.connection.getAccountInfo(
                userTokenAccount
            );

            // 如果代币账户不存在，返回地址和存在状态
            if (!tokenAccountInfo) {
                return {
                    address: userTokenAccount,
                    exists: false,
                };
            }

            return {
                address: userTokenAccount,
                exists: true,
            };
        } catch (error) {
            console.error("Error getting user token account:", error);
            showFailToast({
                message: "JSON-RPC endpoint request timeout",
                mask: true,
            });
            // 如果是资源不可用错误，返回 null 地址
            if (error.message?.includes("Requested resource not available")) {
                showFailToast({
                    message: "JSON-RPC endpoint request timeout",
                    mask: true,
                });
                return {
                    address: null,
                    exists: false,
                };
            }
            throw error;
        }
    }
}

// 导出单例实例
export const walletService = new WalletService();
