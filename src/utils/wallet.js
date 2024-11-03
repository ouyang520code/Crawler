import { Connection, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js'
import { AnchorProvider } from '@project-serum/anchor'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { TOKEN_MINT } from './constants'

// 导出钱包适配器
export const wallets = [
  new PhantomWalletAdapter()
]

// 导出网络端点
export const endpoint = clusterApiUrl('devnet')

export class WalletService {
  constructor() {
    this.connection = new Connection(endpoint)
    this.callbacks = {
      onConnect: null,
      onDisconnect: null
    }
  }

  // 检查钱包是否已安装
  checkWalletInstalled() {
    return 'solana' in window && window.solana.isPhantom
  }

  // 获取钱包实例
  getPhantomWallet() {
    return window.solana
  }

  // 连接钱包
  async connectWallet() {
    try {
      const wallet = this.getPhantomWallet()
      if (!wallet) {
        throw new Error('请安装 Phantom 钱包')
      }
      await wallet.connect()
      return wallet
    } catch (error) {
      console.error('Wallet connection error:', error)
      throw error
    }
  }

  // 获取 Provider
  getProvider(wallet) {
    if (!wallet) return null
    
    return new AnchorProvider(
      this.connection,
      {
        publicKey: wallet.publicKey,
        signTransaction: message => wallet.signTransaction(message),
        signAllTransactions: messages => wallet.signAllTransactions(messages),
      },
      {
        preflightCommitment: 'confirmed',
        commitment: 'confirmed'
      }
    )
  }

  // 获取 SOL 余额
  async getSolBalance(publicKey) {
    try {
      const balance = await this.connection.getBalance(publicKey)
      return balance / LAMPORTS_PER_SOL
    } catch (error) {
      console.error('Error getting SOL balance:', error)
      return 0
    }
  }

  // 获取代币余额
  async getTokenBalance(owner) {
    try {
      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
        owner,
        { mint: TOKEN_MINT }
      )
      
      if (tokenAccounts.value.length > 0) {
        const tokenAccountInfo = tokenAccounts.value[0].account.data.parsed.info.tokenAmount
        return tokenAccountInfo.uiAmount
      }
      return 0
    } catch (error) {
      console.error('Error getting token balance:', error)
      return 0
    }
  }

  // 检查用户取消
  isUserRejection(error) {
    if (!error?.message) return false
    const message = error.message.toLowerCase()
    return message.includes('user rejected') ||
           message.includes('user canceled') ||
           message.includes('user cancelled') ||
           message.includes('transaction cancelled') ||
           message.includes('rejected the request') ||
           message.includes('user denied') ||
           message.includes('declined by user')
  }

  // 设置回调
  setCallbacks(callbacks) {
    this.callbacks = callbacks
  }

  // 初始化钱包监听
  initWalletListeners() {
    const wallet = this.getPhantomWallet()
    if (wallet) {
      // 移除旧的监听器
      this.removeWalletListeners()
      
      // 添加新的监听器
      wallet.on('connect', () => {
        console.log('Wallet connected event')
        this.callbacks.onConnect?.(wallet)
      })
      
      wallet.on('disconnect', () => {
        console.log('Wallet disconnected event')
        this.callbacks.onDisconnect?.()
      })

      // 检查是否已连接
      if (wallet.isConnected) {
        this.callbacks.onConnect?.(wallet)
      }
      
      return true
    }
    return false
  }

  // 移除钱包监听
  removeWalletListeners() {
    const wallet = this.getPhantomWallet()
    if (wallet) {
      wallet.removeAllListeners('connect')
      wallet.removeAllListeners('disconnect')
    }
  }

  // 清理
  cleanup() {
    this.removeWalletListeners()
    this.callbacks = {
      onConnect: null,
      onDisconnect: null
    }
  }

  // 获取 connection 实例
  getConnection() {
    return this.connection
  }
}

// 导出单例实例
export const walletService = new WalletService() 