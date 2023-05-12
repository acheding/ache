class ANIMATION {
  exchange() {
    let swch = document.getElementById('switch')

    let container = document.querySelector('.container')

    swch.addEventListener('click', (e) => {
      //  swch.classList.toggle('switched'); //如果classList中存在给定的值，删除它，否则，添加它
      if (swch.classList.contains('switched')) {
        //确定元素中是否包含指定的类名，返回值为true 、false
        swch.classList.remove('switched') //移除已经存在的类名
        container.classList.add('fast')
      } else {
        swch.classList.add('switched') //添加新的类名，如已经存在，取消添加
        container.classList.remove('fast')
      }
    })
  }
}

const animation = new ANIMATION()
export default animation
