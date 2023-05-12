class TRANSLATE {
  type(type) {
    if (type === 'vue') {
      return 'VUE'
    } else if (type === 'css') {
      return 'CSS'
    } else if (type === 'micro') {
      return '微前端'
    } else if (type === 'server') {
      return '服务器'
    } else if (type === 'all') {
      return '全部'
    } else return type
  }
}

const translate = new TRANSLATE()
export default translate
