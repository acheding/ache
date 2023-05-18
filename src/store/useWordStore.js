import { defineStore } from 'pinia'

const useUserStore = defineStore('useWordStore', {
  state: () => {
    return {
      word: '',
    }
  },
  actions: {
    setWord(word) {
      this.word = word
    },
    clearWord() {
      this.word = ''
    },
  },
})
export default useUserStore
