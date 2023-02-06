import axios from 'axios'

export default {
  async login(obj) {
    let data = []
    await axios.post('/api/globalUsuario', obj).then(res => {
      data = res.data
    }).catch(error => {
      data = error
    })

    return data
  },
}
