import request from "./request";

const $apis = {
  /**
   * 登录
   * @param {string} address 钱包地址
   * @param {string} inviteCode 推荐码
   */
  login: ({ address, inviteCode }) =>
    request.post("/api/common/user_login", {
      address,
      inviteCode,
    }),

  /**
   * 提现
   * @param {string} number 提现数量
   */
  withdrawal: ({ number }) =>
    request.post("/api/krypton_gold/Withdrawal", { number }),

  /**
   *用户资产明细
   */
  assetsList: () => request.get("/api/krypton_gold/assets_list"),

  /**
   * 用户投资
   * @param {string} number 充币数量
   */
  deposite: ({strategy_id ,number }) =>
    request.post("/api/krypton_gold/deposite", { strategy_id,number }),

  /**
   *  用户撤回充币
   * @param {string} number 撤出充币的数量
   */
  withdrawCapital: ({ number }) =>
    request.post("/api/krypton_gold/withdrawCapital", { number }),
//结算
  // jiesuan: ({ number }) =>
  //   request.post("/api/krypton_gold/settleCapital", { number }),

  /**
   * 个人资料
   */
  userInfo: () => request.get("/api/krypton_gold/user_info"),

  /**
   * 团队资料
   */
  teamInformation: () => request.get("/api/krypton_gold/team_information"),

  /**
   * 充值
   * @param {string} number 充值数量
   */
  recharge: ({ number ,flag}) =>
    request.post("/api/krypton_gold/recharge", { number,flag }),

  /**
   * 充值回调
   * @param {string} order_no 订单号
   * @param {string} hash
   */
  paymentVoucher: ({ order_no, hash}) =>
    request.post("/api/krypton_gold/payment_voucher", { order_no, hash}),

  /**
   * 用户资产面板
   */
  capitalOverview: () => request.get("/api/krypton_gold/capitalOverview"),
  /**
   * 趋势图
   */
  config: ()=>request.get("/api/common/config"),
  /**
   * 切换网络信息
   */
  chains: ()=>request.get("/api/common/chains"),
  /**
   * 质押记录
   */
  strategy: ()=>request.get("/api/krypton_gold/user_strategy_list"),
  
  /**
   * 策略池
   */

  krypton: ()=>request.get("/api/krypton_gold/strategy_list"),
};
export default $apis;
