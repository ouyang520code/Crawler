<template>
  <div class="pool">
    <div class="biaoti">爬虫信息查询</div>
    <div class="inpt">
      <van-field
        v-model="value1"
        label=""
        left-icon="search"
        :placeholder="t('home.input')"
        center="true"
      />
      <div class="btn" style="cursor: pointer;">{{t('home.sure')}}</div>
    </div>
    <div class="info">
      <span>{{t('home.address')}}：{{ walletAddress }}</span>
      <div>
        NFT：{{ balance
        }}<span style="margin-left: 10px">{{
          balance > 0 ? t("home.production") : t("home.ispro")
        }}</span>
      </div>
    </div>
    <div class="synthesis">
      <div class="left">
        <div class="left_btn">
          <img src="../../assets/img/zhuan.png" alt="" />
          <span>{{ fragment }}</span>
        </div>
      </div>
      <div class="right">
        <img src="../../assets/img/zhuan1.png" alt="" />
        <div class="num">
          <span class="sui">{{ fragment }}</span>
          <span class="content">{{t('pool.num')}}</span>
        </div>
        <div class="inpt_bi">
          <van-field
            v-model="value2"
            :placeholder="t('pool.quantity')"
            :center="true"
            type="number"
          />
        </div>
        <img src="../../assets/img/huan.png" alt="" class="huan" />
        <div class="huo">
          <img src="../../assets/img/num.png" alt="" />
          <span>{{t('pool.Obtain')}}</span>
        </div>
        <div class="sure" @click="solMintNft" style="cursor: pointer;">{{t('home.sure')}}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Program } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { walletService } from "@/utils/wallet";
import {
  PROGRAM_ID,
  MASTER_EDITION_INFO,
  SYSVAR_INSTRUCTIONS,
  DATA_SEED,
  POINT_SEED,
  TOKEN_METADATA_PROGRAM_ID,
  METADATA_INFO,
  MASTER_METADATA,
  MINT_NFT_AMOUNT,
  TOKEN_MINT,
  EDITION_MARKER_SEED,
  MINT_INFO,
} from "@/utils/constants";
import BN from "bn.js";
import { IDL } from "@/idl/idl";
import {
  showToast,
  showLoadingToast,
  closeToast,
  showSuccessToast,
} from "vant";
import $apis from "@/networks/apis";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const value1 = ref("");
const value2 = ref("");
const loading = ref(false);
const status = ref("");
const tokenBalance = ref(0);
const walletAddress = ref("");
const balance = ref(0);
const wallet = ref<any>(null);
const fragment = ref(0);
const connected = ref(false);
const vseison = ref("");

// 获取代币余额
const updateTokenBalance = async () => {
  try {
    if (!walletService.wallet?.publicKey) return;
    tokenBalance.value = await walletService.getTokenBalance(
      walletService.wallet.publicKey,
      MASTER_EDITION_INFO
    );
  } catch (error) {
    console.error("Error updating token balance:", error);
    tokenBalance.value = 0;
  }
};

// mintNft 功能
const solMintNft = async () => {
  if (value2.value == 0 || value2.value == "")
    return showToast(t('pool.quantity'));
  const amount = new BN(100 * value2.value);

  try {
    if (!walletService.wallet) {
      await walletService.connectWallet();
      if (!walletService.wallet) {
        throw new Error("请先连接钱包");
      }
    }

    loading.value = true;
    showLoadingToast({
      message: "Mint NFT...",
      forbidClick: true,
    });

    const provider = walletService.getProvider(walletService.wallet);
    if (!provider) {
      throw new Error("未找到钱包提供者");
    }

    // Get token account using the connected wallet
    const tokenAccount = await walletService.getUserTokenAccount(
      MASTER_EDITION_INFO
    );
    const userTokenAccount = await walletService.getUserTokenAccount(MINT_INFO);

    const program = new Program(IDL, PROGRAM_ID, provider);

    // 获取 PDA 账户
    const [pdaAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from(DATA_SEED), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    // 获取 adminPDA 账户
    const [adminPad] = PublicKey.findProgramAddressSync(
      [Buffer.from("adminGlobal")],
      program.programId
    );
    console.log("adminPDA", adminPad.toString());

    // // 获取 adminPDA 账户数据
    try {
      const accountData = await program.account.admin.fetch(adminPad);
      console.log("PDA Account Data:", JSON.stringify(accountData, null, 2));
      vseison.value = JSON.parse(
        JSON.stringify(accountData, null, 2)
      ).editionNumber;
    } catch (error) {
      console.log("PDA account data not found or error:", error);
    }

    // 获取 Point PDA
    const [pointPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from(POINT_SEED)],
      program.programId
    );
    // 生成 editionMarkerpda PDA
    const [editionMarkerpda] = PublicKey.findProgramAddressSync(
      [Buffer.from(EDITION_MARKER_SEED)],
      program.programId
    );
    // 检查 PDA 账户是否存在
    const accountInfo = await walletService
      .getConnection()
      .getAccountInfo(pdaAccount);

    // 构建交易指令
    const instructions = [];

    // 如果 PDA 账户不存在，添加初始化指令
    if (!accountInfo) {
      instructions.push(
        await program.methods
          .initUserData()
          .accounts({
            user: provider.wallet.publicKey,
            pdaAccount: pdaAccount,
            systemProgram: SystemProgram.programId,
          })
          .instruction()
      );
    }

    try {
      // 生成 Metadata PDA
      const [editionMetadata] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          MASTER_EDITION_INFO.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      );
      // 生成 Edition PDA
      const [edition] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          MASTER_EDITION_INFO.toBuffer(),
          Buffer.from("edition"),
        ],
        TOKEN_METADATA_PROGRAM_ID
      );
      // 添加 mintNft 指令
      const tx = await program.methods
        .mintNft(new BN(vseison.value), amount)
        .accounts({
          pdaAccount: pdaAccount,
          metaplexTokenMetadata: TOKEN_METADATA_PROGRAM_ID,
          editionMetadata: editionMetadata,
          edition: edition,
          editionMint: MASTER_EDITION_INFO,
          editionTokenAccountOwner: provider.wallet.publicKey,
          editionTokenAccount: tokenAccount.address,
          editionMintAuthority: provider.wallet.publicKey,
          masterEdition: MASTER_EDITION_INFO,
          editionMarkerPda: editionMarkerpda,
          payer: provider.wallet.publicKey,
          masterTokenAccountOwner: provider.wallet.publicKey,
          masterTokenAccount: tokenAccount.address,
          masterMetadata: MASTER_METADATA,
          updateAuthority: pointPDA,
          splTokenProgram: TOKEN_PROGRAM_ID,
          splAtaProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          sysvarInstructions: SYSVAR_INSTRUCTIONS,
          systemProgram: SystemProgram.programId,
          tokenMint: MINT_INFO,
          // userTokenAccount: tokenAccount.address,
          userTokenAccount: userTokenAccount.address,
          adminData: adminPad,
        })
        .instruction();

      // 创建交易
      const transaction = new Transaction();
      transaction.add(tx);
      transaction.recentBlockhash = (
        await walletService.getConnection().getLatestBlockhash()
      ).blockhash;
      transaction.feePayer = provider.wallet.publicKey;

      // 发送交易
      const signature = await provider.wallet.signTransaction(transaction);
      // 打印交易签名
      console.log("Transaction Signature", signature);

      status.value = `Mint NFT 成功！交易ID: ${signature}`;
      showSuccessToast("Mint NFT success！");
      getInfo();
    } catch (error) {
      console.error("Mint NFT error:", error);
      if (error instanceof Error) {
        status.value = `错误: ${error.message}`;
        showToast(error.message);
      } else {
        status.value = "发生未知错误";
        showToast(t('pool.err'));
      }
    }
  } catch (error) {
    console.error("Mint NFT error:", error);
    if (!walletService.isUserRejection(error)) {
      showToast(error instanceof Error ? error.message : "Mint NFT fail");
    }
  } finally {
    loading.value = false;
    closeToast();
  }
};
// 更新钱包信息
const updateWalletInfo = async () => {
  if (!wallet.value?.publicKey) return;
  try {
    walletAddress.value = wallet.value.publicKey.toString();
    // balance.value = await walletService.getSolBalance(wallet.value.publicKey);
    if (walletAddress.value.length > 0) {
      // getaddress();
      getInfo();
    }
    tokenBalance.value = await walletService.getTokenBalance(
      wallet.value.publicKey
    );
  } catch (error) {
    console.error("获取钱包信息失败:", error);
  }
};
//查询用户信息
const getInfo = () => {
  $apis
    .getUserinfo({ address: walletAddress.value })
    .then((res) => {
      if (res.code == 200) {
        console.log("res>>>用户信息", res);
        fragment.value = res.data.all_point;
        balance.value = res.data.node_success;
      }
    })
    .catch((err) => {
      console.log("err>>>用户信息", err);
    });
};

// 组件挂载时初始化钱包连接
onMounted(async () => {
  try {
    const phantomWallet = walletService.getPhantomWallet();
    if (phantomWallet?.isConnected) {
      await phantomWallet.disconnect();
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    await walletService.connectWallet();
    await updateTokenBalance();
  } catch (error) {
    console.error("Wallet initialization error:", error);
  }
  // 设置钱包回调
  walletService.setCallbacks({
    onConnect: async (connectedWallet) => {
      console.log("钱包已连接");
      wallet.value = connectedWallet;
      connected.value = true;
      await updateWalletInfo();
    },
    onDisconnect: () => {
      console.log("钱包已断开连接");
      walletAddress.value = "";
      balance.value = 0;
      fragment.value = 0;
      tokenBalance.value = 0;
    },
  });

  // 初始化钱包监听
  walletService.initWalletListeners();
});

// 组件卸载时清理
onUnmounted(() => {
  const phantomWallet = walletService.getPhantomWallet();
  if (phantomWallet?.isConnected) {
    phantomWallet.disconnect();
  }
  walletService.cleanup();
});
</script>
<style lang="less" scoped>
@import url("@/assets/less/global.less");
.pool {
  height: auto;
  position: relative;
  overflow: hidden;
  padding-bottom: 70px;
  background: linear-gradient(135deg, #271844 0%, #0d0d0d 55%, #261842 100%);
  .biaoti {
    width: 204px;
    height: 34px;
    font-family: SimHei, SimHei;
    font-weight: 400;
    font-size: 34px;
    color: #ffffff;
    margin: 4% auto;
  }
  .inpt {
    width: 70%;
    height: 76px;
    margin: -2% auto;
    padding-bottom: 8%;
    display: flex;
    justify-content: space-between;
    .van-cell {
      width: 60%;
      height: 76px;
      background: #261d36;
      border: 1px solid #8a3dff;
      color: #ffffff;
      font-size: 18px;
      border-radius: 10px;
    }
    ::v-deep .van-field__control {
      color: #ffffff;
    }
    .btn {
      width: 35%;
      height: 76px;
      border: 1px solid #928f8f;
      color: #ffffff;
      font-size: 18px;
      line-height: 76px;
      text-align: center;
      border-radius: 10px;
    }
  }
  .info {
    width: 70%;
    min-height: 119px;
    height: auto;
    border-radius: 5px;
    border: 1px solid #8a3dff;
    margin: 0 auto;
    padding: 1% 2%;
    box-sizing: border-box;
    border-radius: 8px;
    background: linear-gradient(152deg, #261840 0%, #1e1430 47%, #1f1534 100%);
    span {
      color: #ffffff;
      font-size: 18px;
    }
    div {
      color: #ffffff;
      font-size: 18px;
      margin-top: 2%;
      span {
        color: #813dff;
      }
    }
  }
  .synthesis {
    width: 70%;
    height: 800px;
    display: flex;
    justify-content: space-between;
    margin: 2% auto;
    .left {
      width: 65%;
      height: 100%;
      background: url("../../assets/img/he.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      .left_btn {
        width: 30%;
        height: 73px;
        background: url("../../assets/img/btn.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 740px auto;
        img {
          width: 25px;
          height: 44px;
        }
        span {
          margin-left: 5px;
          color: #ffffff;
          font-size: 24px;
        }
      }
    }
    .right {
      width: 32%;
      height: 100%;
      background-color: #261d36;
      border-radius: 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 2%;
      box-sizing: border-box;
      img {
        width: 74px;
        height: 101px;
      }
      .num {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 30px;
        .sui {
          font-size: 41px;
          color: #ffffff;
        }
        .content {
          font-size: 24px;
          color: #b1b1b1;
          margin-top: 10px;
        }
      }
      .inpt_bi {
        width: 100%;
        height: 76px;
      }
      .van-cell {
        width: 90%;
        height: 76px;
        background: #181126;
        color: #b1b1b1;
        font-size: 18px;
        border-radius: 10px;
        margin: 20px auto;
      }
      ::v-deep .van-field__control {
        color: #ffffff;
      }
      .huan {
        width: 42px;
        height: 58px;
        margin-top: 30px;
      }
      .huo {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 15%;
        img {
          width: 112px;
          height: 63px;
        }
        span {
          font-size: 24px;
          color: #b1b1b1;
          margin-top: 20px;
        }
      }
      .sure {
        width: 90%;
        height: 76px;
        color: #ffffff;
        font-size: 30px;
        line-height: 76px;
        text-align: center;
        background: linear-gradient(to bottom, #703dff, #813dff);
        margin-top: 30px;
        border-radius: 48px;
      }
    }
  }
}
@media (max-width: 450px) {
  .pool {
    height: auto;
    position: relative;
    overflow: hidden;
    padding-bottom: 70px;
    .biaoti {
      display: none;
    }
    .inpt {
      width: 92%;
      height: 73px;
      margin: 8% auto;
      .van-cell {
        width: 73%;
        height: 100%;
        border-radius: 8px;
        font-size: 14px;
      }
      .btn {
        width: 25%;
        height: 40px;
        line-height: 40px;
        border-radius: 8px;
        font-size: 14px;
      }
    }
    .info {
      width: 92%;
      min-height: 74px;
      height: auto;
      border-radius: 5px;
      margin: -8% auto;
      span {
        font-size: 14px;
        word-wrap: break-word;
        word-break: break-all;
      }
      div {
        margin-top: 5px;
        font-size: 14px;
      }
    }
    .synthesis {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 98%;
      .left {
        width: 100%;
        height: 312px;
        .left_btn {
          width: 50%;
          height: 52px;
          margin-top: 278px;
          padding: 0 15%;
          img {
            width: 25px;
            height: 28px;
          }
          span {
            font-size: 20px;
          }
        }
      }
      .right {
        width: 94%;
        height: 499px;
        margin-top: 8%;
        img {
          width: 33px;
          height: 58px;
        }
        .num {
          margin-top: 10px;
          .sui {
            font-size: 20px;
          }
          .content {
            font-size: 18px;
            margin-top: 5px;
          }
        }
        .inpt_bi {
          width: 100%;
          height: 65px;
        }
        .van-cell {
          width: 95%;
          height: 65px;
          font-size: 16px;
        }
        .huan {
          width: 28px;
          height: 38px;
          margin-top: 30px;
        }
        .huo {
          margin-top: 20px;
          img {
            width: 78px;
            height: 55px;
          }
          span {
            font-size: 18px;
            margin-top: 10px;
          }
        }
        .sure {
          width: 95%;
          height: 48px;
          font-size: 24px;
          color: white;
          line-height: 48px;
          text-align: center;
          margin-top: 10px;
        }
      }
    }
  }
}
</style>
