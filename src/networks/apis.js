import { get } from "vant/lib/utils";
import request from "./request";

const $apis = {
  /**
   * 领取碎片
   * @param {string} address 钱包地址
   */
  mintPoint: ({ address }) =>
    request.get("/api/node/drawPoint?address=" + address),

  /**
   * 上传tx
   * @param {string} txId 交易哈希
   */
  queryTx: ({ txId }) => request.get("/api/tx?txId=" + txId),

  /**
   * 查询tx坐标
   * @param {string} txId 交易哈希
   */
  chaxun: ({ txId }) => request.get("/api/node/getTx?txId=" + txId),
  getAddressdinate:({address,page,limit})=>request.get("/api/node/address?address="+address+"&page="+page+"&limit="+limit),
  gethax:({x,y})=>request.get("/api/node/xy?x="+x+"&y="+y),
  getnodedata:({address, state, page,limit})=>request.get("/apl/node/data?address="+address+"&state="+state+"&page="+page+"&limit="+limit)
};
export default $apis;
