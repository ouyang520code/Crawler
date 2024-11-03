<template>
  <div class="pool">
    <div class="biaoti">爬虫信息查询</div>
    <div class="inpt">
      <van-field
        v-model="value1"
        label=""
        left-icon="search"
        placeholder="请输入...."
        center="true"
      />
      <div class="btn">确认</div>
    </div>
    <div class="info">
      <span>地址：点击撒娇大开杀戒啊大家撒科技</span>
      <div>NFT：<span>已产生</span></div>
    </div>
    <div class="synthesis">
      <div class="left">
        <div class="left_btn">
          <img src="../../assets/img/zhuan.png" alt="" />
          <span>122</span>
        </div>
      </div>
      <div class="right">
        <img src="../../assets/img/zhuan1.png" alt="" />
        <div class="num">
          <span class="sui">112</span>
          <span class="content">碎片数量</span>
        </div>
        <div class="inpt_bi">
          <van-field
            v-model="value2"
            placeholder="请输入代币输入合成数量"
            center="true"
          />
        </div>
        <img src="../../assets/img/huan.png" alt="" class="huan" />
        <div class="huo">
          <img src="../../assets/img/num.png" alt="" />
          <span>获得数量</span>
        </div>
        <div class="sure">确认</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";

const value1 = ref("");
const value2 = ref("")
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
        justify-content: flex-start;
        align-items: center;
        margin: 740px auto;
        padding: 0 11%;
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
      .inpt_bi{
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
      height: 74px;
      border-radius: 5px;
      margin: -8% auto;
      span {
        font-size: 14px;
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
        .inpt_bi{
          width: 100%;
          height: 65px;
        }
        .van-cell {
          width: 95%;
          height: 65px;
          font-size: 16px;
        }
        .huan{
          width: 28px;
          height: 38px;
          margin-top: 30px;
        }
        .huo{
          margin-top: 20px;
          img{
            width: 78px;
            height: 55px;
          }
          span{
            font-size: 18px;
            margin-top: 10px;
          }
        }
        .sure{
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
