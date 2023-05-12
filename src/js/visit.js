import time from '../utils/time'
import axios from 'axios'
class VISIT {
  getVisitInfo() {
    let device = {}

    let userAgent = window.navigator.userAgent.toLowerCase()

    const getOs = () => {
      let osInfo = userAgent.match(/\bwindows nt ([0-9.]+)/) // Windows
      if (osInfo) {
        device.os = 'Windows'
        device.osVersion = 'Win ' + osInfo[1]
        device.platForm = 'PC'
      } else if ((osInfo = userAgent.match(/\bmac os x ([0-9._]+)/))) {
        // Mac
        device.os = 'Mac'
        device.osVersion = 'IOS ' + osInfo[1].replace(/_/g, '.')
        device.platForm = 'PC'
      } else if ((osInfo = userAgent.match(/\bcpu iphone os ([0-9._]+)/))) {
        // iPhone
        device.os = 'iPhone'
        device.osVersion = 'IOS ' + osInfo[1].replace(/_/g, '.')
        device.platForm = 'Mobile'
      } else if ((osInfo = userAgent.match(/\bcpu os ([0-9._]+)/))) {
        // iPad
        device.os = 'iPad'
        device.osVersion = 'IOS ' + osInfo[1].replace(/_/g, '.')
        device.platForm = 'Tablet'
      } else if ((osInfo = userAgent.match(/\bandroid ([0-9.]+)/))) {
        // Android
        if (userAgent.indexOf('mobile') !== -1) {
          // Android Phone
          device.os = 'Android Phone'
          device.osVersion = 'Android ' + osInfo[1]
          device.platForm = 'Mobile'
        } else {
          // Android Tablet
          device.os = 'Android Tablet'
          device.osVersion = 'Android ' + osInfo[1]
          device.platForm = 'Tablet'
        }
      } else if (userAgent.indexOf('linux') !== -1) {
        device.os = 'Linux'
        device.osVersion = 'Linux'
        device.platForm = 'PC'
      }
      return device
    }

    const properties = async () => {
      getOs()
      return [
        time.format(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        device.os + '，' + device.osVersion + '，' + device.platForm,
        window.screen.width + ' * ' + window.screen.height,
        userAgent,
        Date.now(),
      ]
    }
    return properties()
  }
}

const visit = new VISIT()
export default visit
