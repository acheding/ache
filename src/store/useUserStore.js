import { defineStore } from 'pinia'
import { setCookie, clearCookie } from '@/utils/storage'
import md5 from 'js-md5'
import axios from 'axios'

const useUserStore = defineStore('useUserStore', {
  state: () => {
    return {
      info: '',
      isAdmin: false,
    }
  },
  actions: {
    async login(form) {
      // console.log(md5(md5("123456") + md5(md5("1424834523"))));
      // console.log(md5('20220807001297216你好0121oRy8XTp__OybVNxX2Df9'));
      if (form) {
        let data = {
          user: form.user,
          pwd: md5(md5(form.pwd) + md5(md5('1424834523'))),
        }
        const rst = await axios.post('/ache/login', data)
        if (rst.data) {
          this.info = rst.data
          this.isAdmin = rst.data.role === 'admin'
          setCookie(data)
          axios.interceptors.request.use((config) => {
            config.headers['Authorization'] = data.user + '=' + data.pwd
            return config
          })
          return true
        } else {
          return false
        }
      } else {
        if (document.cookie) {
          let strcookie = document.cookie //获取cookie字符串
          let arrcookie = strcookie.split('; ') //分割
          for (let i = 0; i < arrcookie.length; i++) {
            //遍历匹配
            let arr = arrcookie[i].split('=')
            if (arr[0] === 'user') {
              let data = {
                user: arr[1],
                pwd: arr[2],
              }
              const rst = await axios.post('/ache/login', data)
              if (rst.data) {
                this.info = rst.data
                this.isAdmin = rst.data.role === 'admin'
                axios.interceptors.request.use((config) => {
                  config.headers['Authorization'] = data.user + '=' + data.pwd
                  return config
                })
                return true
              }
            }
          }
          return false
        } else {
          return false
        }
      }
    },

    exit() {
      this.info = ''
      this.isAdmin = false
      clearCookie()
      location.reload()
      return '退出成功！'
    },
  },
})
export default useUserStore
