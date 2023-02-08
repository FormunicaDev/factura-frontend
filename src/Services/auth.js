import axios from 'axios'
import jwt from 'jsonwebtoken'

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
  validDateLogin() {
    if (sessionStorage.getItem('tokenfafFormunica') === null) return false

    const token = sessionStorage.getItem('tokenfafFormunica')
    const decode = jwt.decode(token)
    const dateToken = decode.exp

    if (dateToken > Date.now) {
      sessionStorage.removeItem('tokenfafFormunica')
      localStorage.removeItem('userfafFormunica')
      this.$router.push('/')

      return false
    }

    return true
  },
  validateToken(token) {
    let data = []
    const obj = { token }
    axios.post('/api/globalUsuario/token', obj).then(res => {
      data = res.data
    }).catch(error => {
      data = error
    })

    return data
  },
}
