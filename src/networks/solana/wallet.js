import BN from "bn.js";
import * as web3 from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey, Connection, clusterApiUrl } from "@solana/web3.js";


class SolanaService {
  // 初始化数据
  async initUserData() {
    const [PDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("data"), user.publicKey.toBuffer()],
      program.programId
    );
    const transactionSignature = await program.methods
      .initUserData()
      .accounts({
        user: user.publicKey,
        pdaAccount: PDA,
      })
      .rpc();
    console.log("Transaction Signature:", transactionSignature);
    return transactionSignature;
  }
  //  获取用户代币账户
  async getTokenBalance(mintAddress) {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const userPublicKey = user.publicKey; // 获取用户的代币账户
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      userPublicKey,
      {
        mint: mintAddress,
      }
    ); // 假设用户只有一个与该铸造地址相关的代币账户
    const tokenAccountInfo =
      tokenAccounts.value[0].account.data.parsed.info.tokenAmount;
    console.log(`User's token balance: ${tokenAccountInfo.uiAmount}`);
    return tokenAccountInfo.uiAmount;
  }
  //  购买
  async buy_node() {
    const tokenAccountInfo = await provider.connection.getParsedAccountInfo(
      new PublicKey("58N2Eh1tbyJEqYam1JX41tMP2HMZtWXx7x5RBbvgUEgz")
    );
    const transactionSignature = await initUserData();
    if (transactionSignature) {
      try {
        const [PDA] = PublicKey.findProgramAddressSync(
          [Buffer.from("data"), user.publicKey.toBuffer()],
          program.programId
        );
        const transactionSignature = await program.methods
          .buyNode(new BN(1000 * 1_000_000_00.0))
          .accounts({
            pdaAccount: PDA,
            burnAuthority: user.payer,
            //   userTokenAccount: new PublicKey(
            //     "58N2Eh1tbyJEqYam1JX41tMP2HMZtWXx7x5RBbvgUEgz"
            //   ),
            userTokenAccount: await getTokenBalance(
              new PublicKey("7b6NVaR9TGXyLXBtY6XstAy17WSrE9C7WurjNUHO1UKK")
            ),
            tokenMint: new PublicKey(
              "4F4LHzLMuEVMv5cGhagFNnFyYxzAoJj13FTfUWf623NV"
            ),
            tokenProgram: TOKEN_PROGRAM_ID,
            receiver: new PublicKey(
              "3seNSMvECriku89kXg6TNNzFpmMeLNqTqooPMxAQQTD1"
            ),
          })
          .rpc();

        console.log("Transaction Signature:", transactionSignature);
      } catch (error) {
        console.error("Transaction failed:", error);
      }
    }
  }
}
export default new SolanaService();
