<template>
  <div class="minxi">
    <div class="biaoti">{{t("pool.information")}}</div>
    <div class="inpt">
      <van-field
        v-model="value1"
        left-icon="search"
        :placeholder="t('home.input')"
        :center="true"
      />
      <div class="btn">{{ t("home.sure") }}</div>
    </div>
    <div class="info">
      <div>{{ t("home.address") }}：{{ walletAddress }}</div>
      <div class="nft_span">
        NFT：{{ createNftNum
        }}<span style="margin-left: 10px">{{
          createNftNum > 0 ? t("home.production") : t("home.ispro")
        }}</span>
      </div>
    </div>
    <div class="water">
      <div class="head">ReptileSCAN</div>
      <div class="foote">
        <div class="box" v-for="(item, index) in rows" :key="index">
          <div class="box_head">
            <span>{{ t("home.hash") }}</span>
            <span>{{ t("home.zuobiao") }}</span>
          </div>
          <div class="box_list">
            <div class="list" v-for="(items, index) in item" :key="index">
              <span @click="linkhash(items)" style="cursor: pointer;">{{ items.hash }}</span>
              <span>{{ items.x }} + {{ items.y }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 移动端流水 -->
    <div class="phone_list">
      <div style="font-size: 18px; color: #ffffff">ReptileSCAN</div>
      <div class="detail_list">
        <div class="phone_head">
          <span>{{ t("home.hash") }}</span>
          <span>{{ t("home.zuobiao") }}</span>
        </div>
        <div class="liushui" v-for="(item, index) in list" :key="index">
          <span @click="linkhash(item)">{{ item.hash }}</span>
          <span>{{ item.x }} + {{ item.y }}</span>
        </div>
      </div>
    </div>
    <div class="pages">
      <div class="limit">
        <img src="../../assets/img/left.png" alt="" @click="reduce" />
        <span>{{ currentPage }} / {{ count }}{{ t("home.page") }}</span>
        <img src="../../assets/img/right.png" alt="" @click="add" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import $apis from "@/networks/apis";
import { walletService } from "@/utils/wallet";
import { showToast } from "vant";
import { useI18n } from "vue-i18n";
import { MINT_INFO} from "@/utils/constants";

const { t } = useI18n();
const currentPage = ref(1);
const list = ref([]);
const tokenBalance = ref(0);
const walletAddress = ref("");
const balance = ref(0);
const wallet = ref<any>(null);
const fragment = ref(0);
const connected = ref(false);
const rows = ref([]);
const count = <any>ref("");
const pointBalance = ref(0);
const createNftNum = ref(0);


// 跳转超链接
const linkhash = (item)=>{
  const link = "https://solscan.io/account/" + item.tx;
  window.open(link, "_blank");
}
const add = () => {
  if (currentPage.value >= count.value) return showToast("It's already the last page");
  if (list.value.length == 0) return showToast("No more data available at the moment~");
  currentPage.value += 1;
  getaddress();
};
const reduce = () => {
  if (currentPage.value == 1) return 1;
  currentPage.value -= 1;
  getaddress();
};
//利用地址查询存在的坐标
const getaddress = () => {
  $apis
    .getAddressdinate({
      address: walletAddress.value,
      page: currentPage.value,
      limit: 30,
    })
    .then((res: any) => {
      if (res.code == 200) {
        let redcuo = res.data;
        if (redcuo.length == 0) return showToast(t('detail.emtype'));
        count.value = Math.ceil(res.count / 30);
        redcuo.forEach((item, index) => {
          item.hash = item.tx.substring(0, 4) + "......" + item.tx.slice(-4);
        });
        list.value = redcuo;
        console.log("res地址查询坐标>>>", list.value);
        rows.value = chunkedArray();
        console.log("rows>>>", rows.value);
      } else {
        showToast(t('detail.fial'));
        console.log("res失败>>", res);
      }
    })
    .catch((err) => {
      showToast(t('detail.fial'));
      console.log("err地址查询坐标>>>", err);
    });
};
//格式化数组
const chunkedArray = () => {
  // 初始化一个包含三个空数组的数组
  const groups = [[], [], []];
  // 填充这些数组
  list.value.forEach((item, index) => {
    const groupIndex = Math.floor(index / 10); // 每10个元素为一个组
    if (groupIndex < groups.length) {
      groups[groupIndex].push(item);
    }
  });
  return groups;
};
// 更新钱包信息
const updateWalletInfo = async () => {
  if (!wallet.value?.publicKey) return;
  try {
    walletAddress.value = wallet.value.publicKey.toString();
    // balance.value = await walletService.getSolBalance(wallet.value.publicKey);
    if (walletAddress.value.length > 0) {
      getaddress();
      getInfo();
      createNftNum.value = await walletService.fetchAllNft();

    }
    tokenBalance.value = await walletService.getTokenBalance(
      wallet.value.publicKey
    );
    pointBalance.value = await walletService.getTokenBalance(
      wallet.value.publicKey,
      MINT_INFO
    );
    balance.value = Math.floor(pointBalance.value / 100);
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
        // balance.value = parseInt((res.data.node_success * 1024) / 100);
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

    // await updateTokenBalance();
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
.minxi {
  height: auto;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  padding-bottom: 70px;
  background: linear-gradient(135deg, #271844 0%, #0d0d0d 55%, #261842 100%);
  .biaoti {
    width: 600px;
    height: 34px;
    font-family: SimHei, SimHei;
    font-weight: 400;
    font-size: 34px;
    color: #ffffff;
    margin: 4% auto;
    text-align: center;
  }
  .inpt {
    width: 70%;
    height: 76px;
    margin: -2% auto;
    padding-bottom: 8%;
    display: flex;
    justify-content: space-between;
    .van-cell {
      width: 75%;
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
      width: 23%;
      height: 76px;
      border: 1px solid #928f8f;
      color: #ffffff;
      font-size: 18px;
      line-height: 76px;
      text-align: center;
      border-radius: 10px;
      cursor: pointer;
    }
  }
  .info {
    width: 70%;
    min-height: 101px;
    height: auto;
    border-radius: 5px;
    border: 1px solid #8a3dff;
    margin: 0 auto;
    padding: 1% 2%;
    box-sizing: border-box;
    border-radius: 8px;
    background: linear-gradient(152deg, #261840 0%, #1e1430 47%, #1f1534 100%);

    div{
      color: #ffffff;
      font-size: 18px;
    }

    .nft_span {
      color: #ffffff;
      font-size: 18px;
      margin-top: 2%;
      span {
        color: #813dff;
      }
    }
  }
  .water {
    width: 70%;
    height: 765px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #4d337980;
    margin: 30px auto;
    border-radius: 15px;
    padding: 1% 2%;
    .head {
      font-size: 24px;
      color: #ffffff;
    }
    .foote {
      width: 100%;
      height: 696px;
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .box {
        width: 32%;
        height: 645px;
        background: #4a2a81;
        opacity: 0.46;
        color: #ffffff;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding: 2% 2%;
        .box_head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 26px;
        }
        .box_list {
          display: flex;
          flex-direction: column;
          margin-top: 20px;
          .list {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 20px;
            margin-top: 30px;
          }
        }
      }
    }
  }
  .phone_list {
    display: none;
  }
  .pages {
    width: 10%;
    height: 30px;
    margin: 20px auto;
    .limit {
      display: flex;
      justify-content: space-between;
      align-items: center;
      img {
        width: 38px;
        height: 42px;
      }
      span {
        color: #813dff;
        font-size: 20px;
      }
    }
  }
}
@media (max-width: 450px) {
  .minxi {
    height: auto;
    position: relative;
    overflow: hidden;
    .pages {
      display: none;
    }
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
      min-height: 68px;
      height: auto;
      padding: 2% 3% 2% 3%;
      box-sizing: border-box;
      border-radius: 5px;
      margin: -14% auto;
      div{
        font-size: 14px;
        word-wrap: break-word;
        word-break: break-all;
      }
      .nft_span {
        font-size: 14px;
        color: #ffffff;
        margin-top: 1%;
      span {
        color: #813dff;
      }
      }
    }
    .water {
      display: none;
    }
    .phone_list {
      display: block;
      width: 92%;
      height: auto;
      margin: 20% auto;
      .detail_list {
        width: 100%;
        height: auto;
        min-height: 350px;
        max-height: 750px;
        overflow-y: scroll;
        padding: 4% 5%;
        display: flex;
        flex-direction: column;
        background-color: #4a2a813f;
        border-radius: 15px;
        margin-top: 15px;
        .phone_head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 18px;
          color: #ffffff;
          border-bottom: 1px solid #625c68;
          padding: 2% 2% 2% 2%;
        }
        .liushui {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 18px;
          color: #ffffff;
          border-bottom: 1px solid #625c68;
          padding: 2% 2% 2% 2%;
          margin-top: 15px;
        }
      }
    }
  }
}
</style>
