<template>
  <div class="home">
    <div class="images"></div>
    <div class="inpt">
      <van-field
          v-model="value1"
          label=""
          left-icon="search"
          :placeholder="t('home.input')"
          :center="true"
      />
      <div class="btn" @click="queryaddress" style="cursor: pointer">
        {{ t("home.sure") }}
      </div>
    </div>
    <div class="info">
      <span>{{ t("home.address") }}：{{ walletAddress }}</span>
      <div>
        NFT：{{
          balance
        }}<span style="margin-left: 10px">{{
          balance > 0 ? t("home.production") : t("home.ispro")
        }}</span>
      </div>
    </div>
    <div class="product">
      <div class="pro_left" v-if="finish">
        <div ref="threeJsContainer" class="three-js-container"></div>
        <div class="my-class-name">
          <div class="address">
            <span>{{ t("home.Coordinate") }}：{{ zuobiao }}</span>
            <span>{{ t("home.hash") }}：{{ hanshu }}</span>
          </div>
        </div>
      </div>
      <div v-else class="gress">
        <div class="gress_box" v-if="show">
          <img src="../../assets/img/gress.png" alt=""/>
          <div class="bili" :style="{ width: gressWidth + '%' }">
            <span>{{ gressWidth }}%</span>
          </div>
        </div>
        <img src="../../assets/img/logo.png" alt=""/>
      </div>
      <div class="pro_right">
        <span>{{ t("home.gongzuo") }}</span>
        <div class="daibi">
          <van-field
              v-model="inputAmount"
              :placeholder="t('home.token')"
              :center="true"
          />
          <div class="mint" @click="buyNode">{{ t("home.sure") }}</div>
        </div>
        <div class="ruzhu">
          <text>{{ t("home.node") }}</text>
          <div class="miaoshu">
            <span
                v-for="(item, index) in coordinate"
                :key="index"
                style="font-size: 16px; cursor: pointer"
                @click="worm(item)"
            >{{ t("home.zuobiao") }}：{{ item.x }} + {{ item.y }}</span
            >
          </div>
          <div class="fenye">
            <img src="../../assets/img/left.png" alt="" @click="reduce"/>
            <spna style="color: #813dff; font-size: 16px">
              {{ number }} / {{ t("home.page") }}
            </spna>
            <img src="../../assets/img/right.png" alt="" @click="add"/>
          </div>
        </div>
        <div class="sui">
          {{ t("home.fragments") }}：<span>{{ fragment }}</span>
          <img src="../../assets/img/zhuan.png" alt=""/>
        </div>
        <div class="linqu" @click="receivePoint">
          <img src="../../assets/img/zhuan.png" alt=""/>
          {{ t("home.Collect") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted, nextTick} from "vue";
import * as THREE from "three";
import {
  Connection,
  clusterApiUrl,
  PublicKey,
  SystemProgram,
  Transaction,
  Keypair,
} from "@solana/web3.js";
import {Program, AnchorProvider, Idl} from "@project-serum/anchor";
import {walletService} from "@/utils/wallet";
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";

import {
  PROGRAM_ID,
  TOKEN_MINT,
  RECEIVER,
  DATA_SEED,
  METADATA_INFO,
  MASTER_EDITION_INFO,
  MINT_INFO,
  TOKEN_METADATA_PROGRAM_ID,
  SYSVAR_INSTRUCTIONS,
} from "@/utils/constants";
import BN from "bn.js";
import {IDL} from "@/idl/idl";
import $apis from "@/networks/apis";
import {showLoadingToast, closeToast, showToast} from "vant";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
// 添加 window.solana 类型声明
declare global {
  interface Window {
    solana?: any;
  }
}

// 添加 THREE.js 类型扩展
declare module "three" {
  interface Object3D {
    material?: THREE.Material;
    geometry?: THREE.BufferGeometry;
  }
}
// 状态变量
const value1 = ref("");
const value2 = ref("");
const threeJsContainer = ref<HTMLElement | null>(null);
const connected = ref(false);
const walletAddress = ref("");
const balance = ref(0);
const connection = new Connection(clusterApiUrl("devnet"));
const finish = ref(false);
const gressWidth = ref(0);
const number = ref(1);
const wallet = ref<any>(null);
const inputAmount = ref("");
const loading = ref(false);
const status = ref("");
const walletBalance = ref(0);
const tokenBalance = ref(0);
const coordinate = ref([]);
const fragment = ref(0);
const hanshu = ref("");
const zuobiao = ref("");
const show = ref(false);
const isflag = ref(true)

// THREE.js 相关变量声明
let scene: THREE.Scene & { position: THREE.Vector3 };
let camera: THREE.OrthographicCamera & { position: THREE.Vector3 };
let renderer: THREE.WebGLRenderer;
let gridGroup: THREE.Group;
let matrix = [];
const gridSize = 32;
let count = 1;
const gridSpacing = 10;
const gridWidth = gridSize * gridSpacing;
const originalColors = new Map<THREE.Mesh, THREE.MeshBasicMaterial>();

// 添加 PDA 账户获取函数
const getPdaAccount = (walletPubkey: PublicKey, programId: PublicKey) => {
  const [pdaAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from(DATA_SEED), walletPubkey.toBuffer()],
      programId
  );

  return pdaAccount;
};
// 添加 THREE.js 相关函数
const createGrid = () => {
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.0,
  });

  const lineMaterial = new THREE.LineBasicMaterial({color: 0xffffff});
  // 遍历创建格子平面和边框
  for (let i = 0; i < gridSize; i++) {
    matrix[i] = [];
    for (let j = 0; j < gridSize; j++) {
      matrix[i][j] = count++;
      // 创建平面
      const planeGeometry = new THREE.PlaneGeometry(gridSpacing, gridSpacing);
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.position.x = j * gridSpacing - gridWidth / 2 + gridSpacing / 2;
      plane.position.y = -(i * gridSpacing - gridWidth / 2 + gridSpacing / 2);
      plane.position.z = 0.1; // 确保平面在线条之上
      plane.name = `plane=${matrix[i][j]}-${i}-${j}`;
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
        })`,
        intersect
    );
    // 恢复所有格子的颜色
    originalColors.forEach((material, mesh) => {
      // mesh.material = material;
      // if (mesh.name.includes('active')) {
      //   mesh.name = mesh.name.split('active').join('');
      // }
    });
    // 查找符合指定条件的网格修改材质
    const targetPlane = gridGroup.children.find((child) =>
        child.name.includes(`active`)
    );
    if (targetPlane && intersect.object.name === targetPlane.name) {
      // 生成dom定位
      const domElement = document.querySelector(
          ".my-class-name"
      ) as HTMLElement;
      if (domElement) {
        domElement.style.display = "block";
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;
        domElement.style.left = `${event.clientX + scrollX}px`;
        domElement.style.top = `${event.clientY + scrollY}px`;
        const items = JSON.parse(localStorage.getItem("item"));
        console.log("items>>>", items);
        hanshu.value = items.tx.substring(0, 4) + "....." + items.tx.slice(-4);
        zuobiao.value = items.x + "+" + items.y;
        setTimeout(() => {
          domElement.style.display = "none";
        }, 1500);
      }
      // const plane = intersect.object as THREE.Mesh;
      // plane.material = new THREE.MeshBasicMaterial({
      //   color: "#813DFF",
      // });
    }
  }
};

const onWindowResize = () => {
  if (camera && renderer) {
    camera.left = -gridWidth / 2;
    camera.right = gridWidth / 2;
    camera.top = gridWidth / 2;
    camera.bottom = -gridWidth / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
};

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};
const updateGridColor = (item: any) => {
  if (threeJsContainer.value && gridGroup.children.length) {
    // 查找符合指定条件的网格修改材质
    const targetPlane = gridGroup.children.find((child) =>
        child.name.includes(`plane=${item.x}`)
    );
    if (targetPlane) {
      targetPlane.material = new THREE.MeshBasicMaterial({
        color: "#813DFF",
      });
      targetPlane.name = targetPlane.name + "active";
    }
  }
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
    }
    tokenBalance.value = await walletService.getTokenBalance(
        wallet.value.publicKey
    );
    console.log("tokenBalance:", tokenBalance.value);
  } catch (error) {
    console.error("获取钱包信息失败:", error);
  }
};

// 连接钱包
const connectWallet = async () => {
  try {
    const connectedWallet = await walletService.connectWallet();
    if (connectedWallet) {
      wallet.value = connectedWallet;
      connected.value = true;
      await updateWalletInfo();
      return connectedWallet.publicKey;
    }
    return null;
  } catch (error) {
    if (walletService.isUserRejection(error)) {
      console.log("用户取消了连接请求");
      return null;
    }
    console.error("连接钱包失败:", error);
    throw error;
  }
};

// 获取 Provider
const getProvider = () => {
  if (!wallet.value) return null

  return walletService.getProvider(wallet.value);
};

const getProgram = (provider) => {
  return new Program(IDL as unknown as Idl, PROGRAM_ID, provider);
}

// 购买节点
const buyNode = async () => {
  try {
    if (!wallet.value) {
      await connectWallet();
      if (!wallet.value) {
        throw new Error("请先连接钱包");
      }
    }

    loading.value = true;
    status.value = "交易处理中...";
    showLoadingToast({
      message: status.value,
      forbidClick: true,
    });
    const provider = getProvider();
    if (!provider) {
      showToast(t("home.provider"));
      throw new Error("未找到钱包提供者");
    }

    // 检查代币余额
    const currentTokenBalance = await walletService.getTokenBalance(
        provider.wallet.publicKey
    );
    if (currentTokenBalance < Number(inputAmount.value)) {
      showToast(t("home.balance"));
      throw new Error(
          `代币余额不足。当前余额: ${currentTokenBalance}，需要: ${inputAmount.value}`
      );
    }

    const program = new Program(IDL as unknown as Idl, PROGRAM_ID, provider);

    // 获取 PDA 账户
    const pdaAccount = getPdaAccount(
        provider.wallet.publicKey,
        program.programId
    );

    // 获取用户的代币账户
    const userTokenAccount = await getAssociatedTokenAddress(
        TOKEN_MINT,
        provider.wallet.publicKey
    );

    // 构建交易指令
    const instructions = [];

    // 检查 PDA 账户是否存在
    const accountInfo = await connection.getAccountInfo(pdaAccount);

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

    const baseAmount = Number(inputAmount.value * 100);
    const multiplier = new BN(1_000_000_00);
    const amountBN = new BN(baseAmount).mul(multiplier);

    instructions.push(
        await program.methods
            .buyNode(amountBN)
            .accounts({
              userTokenAccount: userTokenAccount,
              tokenMint: TOKEN_MINT,
              burnAuthority: provider.wallet.publicKey,
              tokenProgram: TOKEN_PROGRAM_ID,
              systemProgram: SystemProgram.programId,
              pdaAccount: pdaAccount,
              receiver: RECEIVER,
            })
            .instruction()
    );

    const tx = await provider.sendAndConfirm(
        new Transaction().add(...instructions)
    );

    console.log(`交易成功！交易ID: ${tx}`);
    closeToast();
    await updateWalletInfo();
    $apis
        .queryTx({txId: tx})
        .then((res) => {
          showLoadingToast({
            message: t("home.success"),
            mask: true,
          });
          if (res.code == 200) {
            getchaxun(tx);
          } else {
            showToast(res.error);
          }
        })
        .catch((err) => {
          showToast(t("home.fail"));
          console.log("err>>>", err);
        });
    inputAmount.value = "";
  } catch (error: any) {
    console.error("Error:", error);
    if (!walletService.isUserRejection(error)) {
      console.log(`错误: ${error.message}`);
    }
  } finally {
    loading.value = false;
    status.value = "";
  }
};
//查询用户信息
const getInfo = () => {
  $apis
      .getUserinfo({address: walletAddress.value})
      .then((res) => {
        if (res.code == 200) {
          console.log("res>>>用户信息", res);
          const provider = getProvider();
          const program = getProgram(provider);
          try {

            const pdaAccount = getPdaAccount(
                provider.wallet.publicKey,
                program.programId
            );
            program.account.dataAccount.fetch(pdaAccount).then((accountData) => {
              console.log("PDA Account Data:", JSON.stringify(accountData, null, 2));
              let num = JSON.parse(JSON.stringify(accountData, null, 2));
              let amount = parseInt(num.amount, 16);
              console.log("data:", num, amount, res.data.point)

              // if (amount <= 0) return showToast(t("home.linqu"));
              if (res.data.point > amount) {
                fragment.value = res.data.point;
              } else {
                fragment.value = amount;
              }

            });

          } catch (error) {
            console.log("PDA account data not found or error:", error);
          }
          balance.value = parseInt((res.data.node_success * 1024) / 100);
        }
      })
      .catch((err) => {
        console.log("err>>>用户信息", err);
      });
};
// 查询tx坐标
const getchaxun = (tx) => {
  $apis
      .chaxun({txId: tx})
      .then((res) => {
        showLoadingToast({
          message: t("home.qidong"),
          mask: true,
        });
        if (res.code == 200) {
          closeToast();
          coordinate.value = res.data;
          console.log("res>>>", res);

          // is_use.value = res.data[0].is_use
          // getProduce(is_use.value)
          console.log("res>>>", res);
        }
      })
      .catch((err) => {
        closeToast;
        console.log("err>>", err);
      });
};
//利用地址查询存在的坐标
const getaddress = () => {
  $apis
      .getAddressdinate({
        address: walletAddress.value,
        page: number.value,
        limit: 10,
      })
      .then((res) => {
        if (res.code == 200) {
          console.log("res地址查询坐标>>>", res);
          coordinate.value = res.data;
        } else {
          showToast(t("home.fail"));
          console.log("res失败>>", res);
        }
      })
      .catch((err) => {
        showToast(t("home.fail"));
        console.log("err地址查询坐标>>>", err);
      });
};
// 查询确认
const queryaddress = () => {
  if (value1.value == "") return showToast(t("home.inaddress"));
  if (value1.value != walletAddress.value)
    return showToast(t("home.sureadress"));
  getaddress();
};
//利用坐标查询哈希数据
const getcore = (item) => {
  $apis
      .gethax({x: item.x, y: item.y})
      .then((res) => {
        if (res.code == 200) {
          console.log("res哈希", res);
        } else {
          showToast(res.error);
          console.log("res哈希数据》》》", res);
        }
      })
      .catch((err) => {
        console.log("哈希查询》》》", err);
      });
};
// 点击查询坐标
const worm = (item) => {
  if (finish.value == false) {
    show.value = true;
    updateProgress(item);
  } else {
    finish.value = false;
    show.value = true;
    gressWidth.value = 0;
    updateProgress(item);
  }
};
// 进度条
const updateProgress = (item) => {
  localStorage.setItem("item", JSON.stringify(item));
  const interval = setInterval(() => {
    gressWidth.value += 1; // 更新响应式数据
    if (gressWidth.value >= 100) {
      finish.value = true;
      clearInterval(interval);
      nextTick(() => {
        initThreeJs();
        setTimeout(() => {
          updateGridColor(item);
        }, 1000);
      });
      // updateGridColor(45)
    }
  }, 100);
};

// Mint Point 功能
const solMintPoint = async () => {
  try {
    if (!wallet.value) {
      await connectWallet();
      if (!wallet.value) {
        isflag.value = true
        throw new Error(t("home.wallet"));
      }
    }
    loading.value = true;
    status.value = "正在 Mint Point...";
    const provider = getProvider();
    if (!provider) {
      isflag.value = true
      throw new Error("未找到钱包提供者");
    }
    const userTokenAccount = await walletService.getUserTokenAccount(MINT_INFO);
    // Get token account using the connected wallet
    // const userTokenAccount = await getOrCreateAssociatedTokenAccount(
    //     walletService.getConnection(),
    //     {publicKey: walletService.wallet.publicKey, secretKey: walletService.wallet.secretKey}, // payer
    //     MINT_INFO, // mint
    //     walletService.wallet.publicKey, // 用户的公钥
    //     false,
    //     "confirmed"
    // );
    const program = new Program(IDL as unknown as Idl, PROGRAM_ID, provider);

    // 获取 PDA 账户，使用与 buyNode 相同的方式
    const pdaAccount = getPdaAccount(
        provider.wallet.publicKey,
        program.programId
    );
    console.log("PDA account:", pdaAccount.toString());
    // 获取 PDA 账户数据
    try {
      const accountData = await program.account.dataAccount.fetch(pdaAccount);
      console.log("PDA Account Data:", JSON.stringify(accountData, null, 2));
      let num = JSON.parse(JSON.stringify(accountData, null, 2));
      if (num.amount <= 0){
        isflag.value = true
        return showToast(t("home.linqu"));
      } 
      // fragment.value = fragment.value + num.amount * 1;
    } catch (error) {
      isflag.value = true
      console.log("PDA account data not found or error:", error);
    }
    // 获取 Point PDA
    const [pointPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("POINT"), program.programId.toBuffer()],
        program.programId
    );
    console.log("Point PDA:", pointPDA.toString());
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
    // 添加 Mint Point 指令
    try {
      const tx = await program.methods
          .mintPoint()
          .accounts({
            form: provider.wallet.publicKey,
            user: provider.wallet.publicKey,
            pdaAccount: pdaAccount,
            tokenInfo: userTokenAccount.address,
            tokenOwnerInfo: provider.wallet.publicKey,
            // metadataInfo: METADATA_INFO,
            metadataInfo: new PublicKey(
                "55uh8C2y2MKoMpkkPQVHc8EymQ822M1eeYurTim1g5v4"
            ),
            masterEditionInfo: MASTER_EDITION_INFO,
            tokenMetadataProgramInfo: TOKEN_METADATA_PROGRAM_ID,
            // mintInfo: MINT_INFO,
            mintInfo: new PublicKey(
                "3gQVUrzb5qWFsNppMWMVMPMaRkpDBqtH5RZHYaokoBdE"
            ),
            updateAuthorityInfo: pointPDA,
            payerInfo: provider.wallet.publicKey,
            systemProgramInfo: new PublicKey("11111111111111111111111111111111"),
            sysvarInstructionsInfo: SYSVAR_INSTRUCTIONS,
            splTokenProgramInfo: TOKEN_PROGRAM_ID,
            splAtaProgramInfo: ASSOCIATED_TOKEN_PROGRAM_ID,
          })
          .rpc({
            commitment: "confirmed",
          });
      getInfo();
      isflag.value = true
      // .instruction();
      // 创建交易
      // const transaction = new Transaction();
      // transaction.add(tx);
      // transaction.recentBlockhash = (
      //   await walletService.getConnection().getLatestBlockhash()
      // ).blockhash;
      // transaction.feePayer = provider.wallet.publicKey;
      // // 发送交易
      // const signature = await provider.wallet.signTransaction(transaction);

      // 打印交易签名
      // console.log("Transaction Signature", signature);

      // status.value = `Mint Point 成功！交易ID: ${signature}`;
    } catch (error) {
      isflag.value = true
      console.error("Mint Point error:", error);
      if (error instanceof Error) {
        isflag.value = true
        status.value = `错误: ${error.message}`;
        showToast(error.message);
      } else {
        isflag.value = true
        status.value = "发生未知错误";
        showToast("发生未知错误");
      }
    } finally {
      isflag.value = true
      loading.value = false;
    }
  } catch (error) {
    isflag.value = true
    console.error("Mint Point error:", error);
    if (error instanceof Error) {
      isflag.value = true
      status.value = `错误: ${error.message}`;
      showToast(error.message);
    } else {
      isflag.value = true
      status.value = "发生未知错误";
      showToast("发生未知错误");
    }
  } finally {
    isflag.value = true
    loading.value = false;
  }
};

// 组件挂载
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
      connected.value = false;
      walletAddress.value = "";
      balance.value = 0;
      wallet.value = null;
      fragment.value = 0;
      tokenBalance.value = 0;
    },
  });

  // 初始化钱包监听
  walletService.initWalletListeners();

  // if (finish.value) {
  // initThreeJs();
  // }
});

// 组件卸载时清理
onUnmounted(() => {
  const phantomWallet = walletService.getPhantomWallet();
  if (phantomWallet?.isConnected) {
    phantomWallet.disconnect();
  }
  walletService.cleanup();
});

// 添加 THREE.js 初始化函数
const initThreeJs = () => {
  scene = new THREE.Scene() as THREE.Scene & { position: THREE.Vector3 };
  scene.background = null;

  camera = new THREE.OrthographicCamera(
      -gridWidth / 2,
      gridWidth / 2,
      gridWidth / 2,
      -gridWidth / 2,
      1,
      1000
  ) as THREE.OrthographicCamera & { position: THREE.Vector3 };

  camera.position.set(0, 0, 50);
  camera.lookAt(scene.position);

  const elements = document.querySelector(".pro_left") as HTMLElement;
  if (!elements) return;

  renderer = new THREE.WebGLRenderer({alpha: true});
  renderer.setSize(elements.clientWidth, elements.clientHeight);
  renderer.setClearColor(0x000000, 0);

  // if (threeJsContainer.value) {
  threeJsContainer.value.appendChild(renderer.domElement);
  // }

  gridGroup = new THREE.Group();
  scene.add(gridGroup);
  createGrid();

  window.addEventListener("click", onCanvasClick);
  window.addEventListener("resize", onWindowResize);

  animate();
};

// 其他函数保持不变...
const add = () => {
  number.value += 1;
  if (coordinate.value.length != 0) {
    getaddress();
  }
};

const reduce = () => {
  if (number.value === 1) return;
  number.value -= 1;
  if (coordinate.value.length != 0) {
    getaddress();
  }
};

// ... 其他 THREE.js 相关函数保持不变

const receivePoint = () => {
if(isflag.value){
    $apis
      .mintPoint({address: walletAddress.value})
      .then((res: any) => {
        isflag.value = false
        if (res.code == 200) {
          // 调用 mintPoint 函数
        } else {
          // showToast(res.error);
        }
        setTimeout(() => {
          showLoadingToast({
            mask: true
          })
          solMintPoint();
        }, 3000);
      })
      .catch((err) => {
        // showToast(err.message)
        console.log("err>>", err);
      });
}else{
  console.log(22);
  
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
    min-height: 119px;
    height: auto;
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
      background: linear-gradient(146deg,
      #261840 0%,
      #261840 0%,
      #1e1430 51%,
      #261840 100%);
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
          display: flex;
          flex-direction: column;
          padding: 2% 2%;
          box-sizing: border-box;
          overflow: auto;
          color: #ffffff;
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
        justify-content: center;
        align-items: center;
        color: white;
        margin-top: 15px;
        border-radius: 48px;
        font-size: 18px;
        cursor: pointer;

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
      min-height: 78px;
      height: auto;
      border-radius: 5px;
      margin: 34% auto;

      span {
        word-wrap: break-word;
        word-break: break-all;
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
