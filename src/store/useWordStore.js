import { defineStore } from 'pinia'

const useWordStore = defineStore('useWordStore', {
  state: () => {
    return {
      collectWord: null,
    }
  },
  actions: {
    setWord(payload) {
      this.collectWord = payload
    },
    clearWord() {
      this.collectWord = null
    },
  },
})
export default useWordStore
