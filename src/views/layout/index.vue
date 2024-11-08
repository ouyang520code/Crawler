<template>
  <div class="daohang">
    <!-- pc -->
    <div class="pc_nav">
      <div class="pc_box">
        <div class="pc_right">
          <div class="pc_logo">
            <img src="../../assets/img/cong.png" alt="" />
            <span>Reptile</span>
          </div>
          <span
            :class="index === flag ? 'pc_home' : 'txt'"
            v-for="(item, index) in home"
            @click="select2(index, item)"
            >{{ item.title }}</span
          >
        </div>
        <div class="pc_left">
          <div class="pc_lang" @click="changeloca">
            <img src="../../assets/img/loca.png" alt="" class="jia" />
            <span>{{t("navbar.loca")}}</span>
            <img src="../../assets/img/xia.png" alt="" class="xia" />
          </div>
          <div class="qian">
            <button @click="connectWallet" v-if="!connected">{{t("navbar.link")}}</button>
            <button @click="disconnectWallet" v-else>{{t("navbar.discount")}}</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 移动端导航 -->
    <div class="yi_nav">
      <div class="phone_nav">
        <div class="nav_right">
          <img
            src="../../assets/img/jia.png"
            alt=""
            style="width: 80px; height: 80px"
            @click="showpu"
          />
          <img
            src="../../assets/img/cong.png"
            alt=""
            style="width: 28px; height: 28px"
          />
          <span>Reptile</span>
        </div>
        <div class="content">{{ names }}</div>
        <div class="nav_left">
          <button @click="connectWallet" v-if="!connected">{{t("navbar.link")}}</button>
          <button @click="disconnectWallet" v-else>{{t("navbar.discount")}}</button>
        </div>
      </div>
      <div class="pop_nav" v-if="show">
        <span
          v-for="(item, index) in home"
          :key="index"
          :style="{ color: flag == index ? 'white' : '' }"
          @click="select(index, item)"
          >{{ item.title }}</span
        >
      </div>
    </div>
    <router-view></router-view>
    <div class="footer">
      <div class="pc_footer">
        <div class="footer_right">
          <div class="footer_logo">
            <img src="../../assets/img/cong.png" alt="" />
            <span>Reptile</span>
          </div>
          <text>https://www.iconfont.cn/search/inde</text>
          <div class="footer_box">
            <img src="../../assets/img/poto.png" alt="" />
            <img src="../../assets/img/foin.png" alt="" />
            <img src="../../assets/img//xiang.png" alt="" />
            <img src="../../assets/img/feiji.png" alt="" />
          </div>
        </div>
        <div class="footer_left">
          <div
            v-for="(item, index) in home"
            :key="index"
            class="jump"
            @click="goback(item.name)"
          >
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted,computed } from "vue";
import { useRouter,useRoute } from "vue-router";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const names = ref(t("navbar.information"));
const home =  computed(()=>[
  {
    name: "home",
    title: t("navbar.home"),
  },
  {
    name: "pool",
    title: t("navbar.pool"),
  },
  {
    name: "detail",
    title: t("navbar.data"),
  },
]);
const show = ref(false);
// const flag = ref(0);
const router = useRouter();
const { locale } = useI18n();
const isloca = ref(false)
const route = useRoute();

const flag = computed(() => {
  return home.value.findIndex((item) => item.name === route.name);
});

const changeloca=()=>{
  isloca.value = !isloca.value
locale.value = isloca.value==true?"zh":'en';
}

const showpu = () => {
  show.value = !show.value;
};
const select = (index, item) => {
  flag.value = index;
  show.value = !show.value;
  names.value = item.title;
  goback(item.name);
};
const select2 = (index, item) => {
  flag.value = index;
  names.value = item.title;
  goback(item.name);
};
const goback = (url) => {
  router.push({
    name: url,
  });
};

const connected = ref(false);

const connectWallet = async () => {
  try {
    if (!window.solana || !window.solana.isPhantom) {
      window.open("https://phantom.app/", "_blank");
      return;
    }
    const response = await window.solana.connect();
    console.log("Connected with Public Key:", response.publicKey);
    connected.value = true;
  } catch (error) {
    console.error("Failed to connect wallet:", error);
  }
};
const disconnectWallet = async () => {
  try {
    if (window.solana) {
      await window.solana.disconnect();
      connected.value = false;
    }
  } catch (error) {
    console.error("Failed to disconnect wallet:", error);
  }
};

onMounted(() => {
  if (window.solana?.isPhantom) {
    window.solana
      .connect({ onlyIfTrusted: true })
      .then(() => {
        connected.value = true;
      })
      .catch(() => {
        connected.value = false;
      });
  }
});
</script>

<style lang="less" scoped>
.daohang {
  width: 100%;
  height: 100%;
  position: relative;
  .yi_nav {
    display: none;
  }
  .pc_nav {
    display: block;
    width: 100%;
    height: 75px;
    background: linear-gradient(101deg, #2e2143 0%, #4a2a81 47%, #2e2143 100%);
    box-shadow: 0px 3px 7px 1px rgba(0, 0, 0, 0.05);
    .pc_box {
      width: 80%;
      height: 100%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .pc_right {
        width: 40%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .pc_logo {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          img {
            width: 59px;
            height: 59px;
          }
          span {
            font-family: DengXian, DengXian;
            font-weight: bold;
            font-size: 20px;
            color: #ffffff;
            margin-left: 10px;
          }
        }
        .pc_home {
          background: #733dff;
          border-radius: 5px;
          color: #ffffff;
          line-height: 26px;
          text-align: center;
          font-size: 20px;
          padding: 5px 10px 5px 10px;
        }
        .txt {
          font-family: Segoe UI, Segoe UI;
          font-weight: 400;
          font-size: 20px;
          color: #ababab;
        }
      }
      .pc_left {
        width: 30%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .pc_lang {
          width: 80%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .jia {
            width: 22px;
            height: 22px;
          }
          span {
            font-family: Segoe UI, Segoe UI;
            font-weight: 400;
            font-size: 18px;
            color: #ffffff;
            margin-left: 15px;
            margin-right: 15px;
          }
          .xia {
            width: 14px;
            height: 9px;
          }
        }
        .qian {
          width: 146px;
          height: 34px;
          font-size: 18px;
          color: #ffffff;
          text-align: center;
          background: #733dff;
          border-radius: 48px;
          line-height: 34px;
          button {
            width: 100%;
            height: 100%;
            background: #733dff;
            color: white;
            border: none;
            border-radius: 48px;
            cursor: pointer;
          }
        }
      }
    }
  }
  .footer {
    display: block;
    width: 100%;
    height: 264px;
    background-image: url("../../assets/img/footer.png");
    background-size: 120% 240%;
    background-position: center;
    background-repeat: no-repeat;
    .pc_footer {
      width: 80%;
      height: 80%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .footer_right {
        display: flex;
        flex-direction: column;
        padding-top: 10px;
        .footer_logo {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          img {
            width: 86px;
            height: 86px;
          }
          span {
            font-weight: bold;
            font-size: 26px;
            color: #ffffff;
          }
        }
        text {
          font-weight: 400;
          font-size: 20px;
          color: #dcdcdc;
        }
        .footer_box {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          img {
            width: 40px;
            height: 37px;
          }
        }
      }
      .footer_left {
        width: 20%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .jump {
          cursor: pointer;
          color: #dcdcdc;
          font-size: 20px;
        }
      }
    }
  }
  @media (max-width: 450px) {
    .pc_nav {
      display: none;
    }
    .footer {
      display: none;
    }
    .yi_nav {
      display: block;
    }
    .phone_nav {
      width: 100%;
      height: 60px;
      padding: 5% 4%;
      margin: 0 auto;
      box-sizing: border-box;
      background: linear-gradient(
        135deg,
        #271844 0%,
        #0d0d0d 55%,
        #261842 100%
      );
      display: flex;
      justify-content: space-between;
      align-items: center;
      .nav_right {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        img {
          margin-left: -25px;
        }
        span {
          font-weight: bold;
          font-size: 14px;
          color: #ffffff;
        }
      }
      .content {
        height: 34px;
        font-family: SimHei, SimHei;
        font-weight: 400;
        font-size: 20px;
        color: #ffffff;
        line-height: 34px;
        margin-left: -20px;
      }
      .nav_left {
        width: 22%;
        height: 30px;
        font-size: 14px;
        background-color: #733dff;
        text-align: center;
        line-height: 30px;
        color: white;
        border-radius: 48px;
        button {
          width: 100%;
          height: 100%;
          background: #733dff;
          color: white;
          border: none;
          border-radius: 48px;
          cursor: pointer;
        }
      }
    }
    .pop_nav {
      width: 38%;
      height: auto;
      padding-top: 2%;
      padding-bottom: 4%;
      background: linear-gradient(360deg, #110f26 0%, #3c2b67 100%);
      border-radius: 16px;
      border: 1px solid #813dff;
      position: absolute;
      z-index: 10;
      left: 4%;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      span {
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 18px;
        color: #9f9f9f;
        margin-top: 10%;
      }
    }
  }
}
</style>
