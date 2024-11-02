<template>
  <div class="minxi">
    <div class="biaoti">爬虫信息查询</div>
    <div class="inpt">
      <van-field
        v-model="value1"
        left-icon="search"
        placeholder="请输入...."
        center="true"
      />
      <div class="btn">确认</div>
    </div>
    <div class="info">
      <span>地址：{{ walletAddress }}</span>
      <div>NFT：{{ balance }}<span style="margin-left: 10px">已产生</span></div>
    </div>
    <div class="water">
      <div class="head">ReptileSCAN</div>
      <div class="foote">
        <div class="box" v-for="(item, index) in 3" :key="index">
          <div class="box_head">
            <span>哈希</span>
            <span>坐标</span>
          </div>
          <div class="box_list">
            <div class="list" v-for="(item, inde) in 10" :key="index">
              <span>txn hash</span>
              <span>-6x+3</span>
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
          <span>哈希</span>
          <span>坐标</span>
        </div>
        <div class="liushui" v-for="(item, index) in 15" :key="index">
          <span>txn hash</span>
          <span>-6x+3</span>
        </div>
      </div>
    </div>
    <div class="pages">
      <div class="limit">
        <img src="../../assets/img/left.png" alt="" @click="reduce" />
        <span>{{ currentPage }} / 页</span>
        <img src="../../assets/img/right.png" alt="" @click="add" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { Connection, clusterApiUrl } from "@solana/web3.js";

const currentPage = ref(1);
const list = ref([]);
const connected = ref(false);
const walletAddress = ref("");
const balance = ref(0);
const connection = new Connection(clusterApiUrl("devnet"));

const add = () => {
  currentPage.value += 1;
};
const reduce = () => {
  if (currentPage.value == 1) return 1;
  currentPage.value -= 1;
};

const updateWalletInfo = async () => {
  if (window.solana?.publicKey) {
    try {
      const address = window.solana.publicKey.toString();
      walletAddress.value = address;
      const bal = await connection.getBalance(window.solana.publicKey);
      balance.value = bal / 1000000000; // Convert lamports to SOL
    } catch (error) {
      console.error("Error updating wallet info:", error);
    }
  }
};

onMounted(() => {
  const phantom = window.solana;
  if (phantom) {
    if (phantom.isConnected) {
      connected.value = true;
      updateWalletInfo();
    }

    phantom.on("connect", () => {
      connected.value = true;
      updateWalletInfo();
    });
    phantom.on("disconnect", () => {
      connected.value = false;
      walletAddress.value = "";
      localStorage.removeItem("address");
      balance.value = 0;
    });
  }
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
    }
  }
  .info {
    width: 70%;
    height: 119px;
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
      height: 74px;
      border-radius: 5px;
      margin: -14% auto;
      span {
        font-size: 14px;
      }
      div {
        margin-top: 5px;
        font-size: 14px;
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
