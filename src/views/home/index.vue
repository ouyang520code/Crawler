<template>
  <div class="home">
    <div class="images"></div>
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
      <span>地址：{{ walletAddress }}</span>
      <div>NFT：{{ balance }}<span style="margin-left: 10px">已产生</span></div>
    </div>
    <div class="product">
      <div class="pro_left" v-if="finish">
        <div ref="threeJsContainer" class="three-js-container"></div>
        <div class="my-class-name">
          <div class="address">
            <span>坐标信息：-6X+8</span>
            <span>哈希：LINK(超链接）</span>
          </div>
        </div>
      </div>
      <div v-else class="gress">
        <div class="gress_box">
          <img src="../../assets/img/gress.png" alt="" />
          <div class="bili" :style="{ width: gressWidth + '%' }">
            <span>{{ gressWidth }}%</span>
          </div>
        </div>
        <img src="../../assets/img/logo.png" alt="" />
      </div>
      <div class="pro_right">
        <span>爬虫工作</span>
        <div class="daibi">
          <van-field
            v-model="value2"
            placeholder="请输入代币"
            :center="true"
            type="number"
          />
          <div class="mint" @click="mitSure">确认</div>
        </div>
        <div class="ruzhu">
          <text>入住节点信息</text>
          <div class="miaoshu"></div>
          <div class="fenye">
            <img src="../../assets/img/left.png" alt="" @click="reduce" />
            <spna style="color: #813dff; font-size: 16px">
              {{ number }} / 页</spna
            >
            <img src="../../assets/img/right.png" alt="" @click="add" />
          </div>
        </div>
        <div class="sui">
          当前产生的NFT碎片：<span>800</span>
          <img src="../../assets/img/zhuan.png" alt="" />
        </div>
        <div class="linqu">
          <img src="../../assets/img/zhuan.png" alt="" />
          领取碎片
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as THREE from "three";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { showToast } from "vant";
import SolanaService from "@/networks/solana/wallet";

const value1 = ref("");
const value2 = ref<any>("");
const threeJsContainer = ref<HTMLElement | null>(null);
const connected = ref(false);
const walletAddress = ref("");
const balance = ref(0);
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const finish = ref(false);
let gressWidth = ref<any>(0);
const number = ref(1);

let scene: THREE.Scene;
let camera: THREE.OrthographicCamera;
let renderer: THREE.WebGLRenderer;
let gridGroup: THREE.Group;
const gridSize = 32;
const gridSpacing = 10;
const gridWidth = gridSize * gridSpacing;
const originalColors = new Map<THREE.Mesh, THREE.MeshBasicMaterial>();

const add = () => {
  number.value += 1;
};
const reduce = () => {
  if (number.value == 1) return 1;
  number.value -= 1;
};

const initThreeJs = () => {
  // 创建场景
  scene = new THREE.Scene();
  scene.background = null;

  // 创建相机
  camera = new THREE.OrthographicCamera(
    -gridWidth / 2,
    gridWidth / 2,
    gridWidth / 2,
    -gridWidth / 2,
    1,
    1000
  );
  camera.position.set(0, 0, 50);
  camera.lookAt(scene.position);

  // 创建渲染器
  const elments = document.querySelector(".pro_left") as HTMLElement;
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(elments.clientWidth, elments.clientHeight);
  renderer.setClearColor(0x000000, 0);
  threeJsContainer.value?.appendChild(renderer.domElement);

  // 创建格子组
  gridGroup = new THREE.Group();
  scene.add(gridGroup);

  // 创建格子
  createGrid();

  // 添加鼠标事件监听
  window.addEventListener("click", onCanvasClick);

  // 添加窗口尺寸变化监听
  window.addEventListener("resize", onWindowResize);

  // 渲染场景
  animate();
};

const createGrid = () => {
  // 创建平面材质，设置为透明
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.0,
  });
  // 创建线条材质
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

  // 遍历创建格子平面和边框
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      // 创建平面
      const planeGeometry = new THREE.PlaneGeometry(gridSpacing, gridSpacing);
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.position.x = j * gridSpacing - gridWidth / 2 + gridSpacing / 2;
      plane.position.y = -(i * gridSpacing - gridWidth / 2 + gridSpacing / 2);
      plane.position.z = 0.1; // 确保平面在线条之上
      plane.name = "plane";
      gridGroup.add(plane);
      originalColors.set(plane, plane.material.clone());

      // 创建边框线条
      const lineGeometry = new THREE.EdgesGeometry(planeGeometry);
      const line = new THREE.LineSegments(lineGeometry, lineMaterial);
      line.position.copy(plane.position); // 使用与平面相同的坐标
      gridGroup.add(line);
    }
  }
};
const onCanvasClick = (event: MouseEvent) => {
  const rect = renderer.domElement.getBoundingClientRect();
  const mouse = new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1
  );

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(gridGroup.children);
  if (intersects.length > 0) {
    const intersect = intersects[0];
    const x = intersect.point.x + gridWidth / 2;
    const y = -intersect.point.y + gridWidth / 2;
    const column = Math.floor(x / gridSpacing);
    const row = Math.floor(y / gridSpacing);
    console.log(`格子坐标: (${row},${column})`);

    const screenX =
      rect.left + column * gridSpacing - (rect.width - gridWidth) / 2;
    const screenY =
      rect.top + row * gridSpacing - (rect.height - gridWidth) / 2;
    console.log(`点击格子的左下角屏幕坐标: (${screenX},${screenY})`);
    console.log(
      `点击格子的中心屏幕坐标: (${screenX + gridSpacing / 2},${
        screenY + gridSpacing / 2
      })`
    );
    // 恢复所有格子的颜色
    originalColors.forEach((material, mesh) => {
      mesh.material = material;
    });
    if (intersect.object.name === "plane") {
      // 点击的格子修改颜色
      const plane = intersect.object as THREE.Mesh;
      plane.material = new THREE.MeshBasicMaterial({
        color: "#813DFF",
      });
    }
    // 生成dom定位
    const domElement = document.querySelector(".my-class-name") as HTMLElement;
    domElement.style.display = "block";
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    domElement.style.left = `${event.clientX + scrollX}}px`;
    domElement.style.top = `${event.clientY + scrollY}px`;
    setTimeout(() => {
      domElement.style.display = "none";
    }, 1500);
  }
};

const onWindowResize = () => {
  camera.left = -gridWidth / 2;
  camera.right = gridWidth / 2;
  camera.top = gridWidth / 2;
  camera.bottom = -gridWidth / 2;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};
const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
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
const updateProgress = () => {
  const interval = setInterval(() => {
    gressWidth.value += 1; // 更新响应式数据
    console.log("bili", gressWidth.value);
    if (gressWidth.value >= 30) {
      clearInterval(interval);
    }
  }, 300);
};
// updateProgress();

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
  if (finish.value) {
    initThreeJs();
  }
});

// 购买节点
const mitSure = async () => {
  if (value2.value == "" || value2.value == 0)
    return showToast("请输入购买数量");
  try {
    const signature = await SolanaService.buyNode(walletAddress.value, 1); // 假设amount为1
    console.log("Transaction signature:", signature);
  } catch (error) {
    console.error("Error buying node:", error);
  }
};
</script>

<style lang="less" scoped>
@import url("@/assets/less/global.less");

.home {
  height: auto;
  position: relative;
  background: linear-gradient(135deg, #271844 0%, #0d0d0d 55%, #261842 100%);
  .images {
    width: 100%;
    height: 589px;
    background-image: url("../../assets/img/shou.png");
    background-repeat: no-repeat;
    background-size: 65% 200%;
    background-position: top;
  }
  .inpt {
    width: 50%;
    height: 76px;
    margin: -6% auto;
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
    margin: 5% auto;
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
  .product {
    width: 70%;
    height: 800px;
    display: flex;
    justify-content: space-between;
    margin: -2% auto;
    box-sizing: border-box;
    padding-bottom: 2%;
    .pro_left {
      width: 65%;
      height: 100%;
      border: 1px solid #8a3dff;
      overflow-y: scroll;
      .my-class-name {
        display: none;
        position: absolute;
        width: 220px;
        height: 110px;
        background: url("../../assets/img/hezi.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;

        .address {
          margin: 10px auto;
          display: flex;
          flex-direction: column;
          color: #ffffff;
          font-size: 14px;
          padding: 10% 15%;
        }
      }
    }
    .gress {
      width: 65%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 20px;
      .gress_box {
        width: 420px;
        height: 23px;
        background: #624f82;
        border-radius: 12px;
        position: relative;
        img {
          position: absolute;
          width: 100px;
          height: 70px;
          margin: -18px -18px;
        }
        .bili {
          height: 100%;
          background: linear-gradient(173deg, #7239b2 0%, #22f2eb 100%);
          box-shadow: inset 0px -3px 6px 1px rgba(0, 0, 0, 0.51);
          border-radius: 12px;
          span {
            position: absolute;
            color: white;
            line-height: 23px;
            font-size: 16px;
            text-align: center;
            margin-left: 45%;
          }
        }
      }
      img {
        width: 680px;
        height: 680px;
        margin-top: 5%;
      }
    }
    .pro_right {
      width: 32%;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 2% 2%;
      background: linear-gradient(
        146deg,
        #261840 0%,
        #261840 0%,
        #1e1430 51%,
        #261840 100%
      );
      border-radius: 15px;
      span {
        font-family: SimHei, SimHei;
        font-weight: 400;
        font-size: 24px;
        color: #ffffff;
      }
      .daibi {
        width: 100%;
        height: 100px;
        border-radius: 15px;
        border: 1px solid #8a3dff;
        margin: 14px auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2% 2%;
        .van-cell {
          background-color: #181126;
          width: 70%;
          border-radius: 12px;
        }
        ::v-deep .van-field__control {
          color: #ffffff;
        }
        .mint {
          width: 25%;
          height: 42px;
          border-radius: 15px 15px 15px 15px;
          border: 1px solid #8a3dff;
          color: #ffffff;
          text-align: center;
          line-height: 42px;
          cursor: pointer;
        }
      }
      .ruzhu {
        height: 420px;
        border-radius: 15px;
        border: 1px solid #8a3dff;
        padding: 4% 4%;
        box-sizing: border-box;
        text {
          font-size: 18px;
          color: #ffffff;
        }
        .miaoshu {
          width: 98%;
          height: 325px;
          margin: 10px auto;
          background: #181126;
          border-radius: 12px;
        }
        .fenye {
          width: 46%;
          margin: 10px auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          img {
            width: 19px;
            height: 22px;
          }
        }
      }
      .sui {
        height: 70px;
        border-radius: 15px 15px 15px 15px;
        border: 1px solid #8a3dff;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: #ffffff;
        font-size: 18px;
        padding-left: 4%;
        box-sizing: border-box;
        margin-top: 15px;
        span {
          color: #813dff;
        }
        img {
          width: 24px;
          height: 33px;
          margin-left: 10px;
        }
      }
      .linqu {
        height: 70px;
        background-color: #813dff;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: white;
        padding-left: 35%;
        margin-top: 15px;
        border-radius: 48px;
        font-size: 18px;
        img {
          width: 29px;
          height: 39px;
          margin-right: 10px;
        }
      }
    }
  }
  @media (max-width: 450px) {
    .images {
      width: 100%;
      height: 337px;
      background-image: url("../../assets/img/shou.png");
      background-repeat: no-repeat;
      background-size: 100% 130%;
      background-position: top;
    }
    .inpt {
      width: 95%;
      height: 73px;
      margin: -38% auto;

      .van-cell {
        height: 100%;
        border-radius: 8px;
        font-size: 14px;
      }
      .btn {
        width: 35%;
        height: 40px;
        line-height: 40px;
        border-radius: 8px;
        font-size: 14px;
      }
    }
    .info {
      width: 95%;
      height: 78px;
      border-radius: 5px;
      margin: 34% auto;
      span {
        font-size: 12px;
      }
      div {
        font-size: 14px;
      }
    }
    .product {
      width: 95%;
      height: 1000px;
      display: flex;
      flex-direction: column;
      margin: -28% auto;
      .pro_left {
        width: 100%;
        height: 600px;
        border: 1px solid #813dff;
        .my-class-name {
          display: none;
          position: absolute;
          width: 220px;
          height: 110px;
          background: url("../../assets/img/hezi.png");
          background-size: 100% 100%;
          background-repeat: no-repeat;
          .address {
            margin: 10px auto;
            display: flex;
            flex-direction: column;
            color: #ffffff;
            font-size: 14px;
            padding: 10% 15%;
          }
        }
      }
      .gress {
        width: 100%;
        height: 600px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 20px;
        .gress_box {
          width: 280px;
          height: 20px;
          background: #624f82;
          border-radius: 12px;
          position: relative;
          img {
            position: absolute;
            width: 70px;
            height: 50px;
            margin: -10px -15px;
          }
          .bili {
            height: 100%;
            background: linear-gradient(173deg, #7239b2 0%, #22f2eb 100%);
            box-shadow: inset 0px -3px 6px 1px rgba(0, 0, 0, 0.51);
            border-radius: 12px;
            span {
              position: absolute;
              color: white;
              line-height: 20px;
              font-size: 14px;
              text-align: center;
              margin-left: 45%;
            }
          }
        }
        img {
          width: 389px;
          height: 389px;
          margin-top: 5%;
        }
      }
      .pro_right {
        width: 100%;
        height: 580px;
        padding: 3% 4%;
        margin-top: 5%;
        span {
          font-size: 16px;
        }
        .daibi {
          width: 100%;
          height: 70px;
          .mint {
            font-size: 14px;
          }
        }
        .ruzhu {
          width: 100%;
          height: 244px;
          padding: 2% 4%;
          text {
            font-size: 16px;
          }
          .miaoshu {
            height: 168px;
          }
          .fenye {
            width: 46%;
            margin: 10px auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            img {
              width: 19px;
              height: 22px;
            }
          }
        }
        .sui {
          height: 56px;
          font-size: 16px;
          img {
            width: 19px;
            height: 22px;
            margin-left: 10px;
          }
        }
        .linqu {
          height: 56px;
          padding-left: 34%;
          font-size: 16px;
          img {
            width: 16px;
            height: 18px;
            margin-right: 10px;
          }
        }
      }
    }
  }
}
</style>
