export const setCookie = (userInfo) => {
  let expTime = new Date()
  expTime.setTime(expTime.getTime() + 2 * 60 * 60 * 1000)
  document.cookie = 'user=' + userInfo.user + '=' + userInfo.pwd + ';expires=' + expTime.toUTCString()
}
export const clearCookie = () => {
  let expTime = new Date()
  expTime.setTime(expTime.getTime() - 1)
  document.cookie = 'user=' + ';expires=' + expTime.toUTCString()
}
