
// 获取assets静态资源
const getAssetsFile = (url) => {
    return new URL(`../assets/img/${url}`, import.meta.url).href
  }
  const getAssetsFile2 = (url) => {
    return new URL(`../assets/icon/${url}`, import.meta.url).href
  }
  export default {
    getAssetsFile,
    getAssetsFile2
  }