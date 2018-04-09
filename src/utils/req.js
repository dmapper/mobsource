import qs from 'qs'

export default class req {
  static get = (url, data) =>
    fetch(`${url}${data ? `?${qs.stringify(data)}` : ''}`).then(res => {
      if (res.status >= 200 && res.status <= 304) {
        return res.json()
      } else {
        return res
      }
    }).catch(error => console.log(error))
  static send = (url, method, data, json) =>
    fetch(url, {
      method,
      headers: {
        'Content-Type': `application/${json ? 'json;charset=UTF-8' : 'x-www-form-urlencoded;charset=UTF-8'}`
      },
      body: (json ? JSON.stringify(data) : qs.stringify(data))
    }).then(res => {
      if (res.status >= 200 && res.status < 300) {
        return res.text().then(text => {
          let result
          if (res.headers.get('content-type') && res.headers.get('content-type').indexOf('octet-stream') === -1) {
            result = text === '' ? '' : JSON.parse(text)
          } else {
            result = text === '' ? '' : text
          }
          return result
        })
      } else {
        return res
      }
    }).catch(error => console.log(error))
  static post = (url, data, json) => this.send(url, 'POST', data, json)
  static put = (url, data) => this.send(url, 'PUT', data)
  static remove = url => this.send(url, 'DELETE')
}
