import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    user:{}
  }),
  actions: {
    setToken(token){
      this.token = token
    },
    setuserInfo(user){
      this.user=user
    }
  },
  persist: true
})