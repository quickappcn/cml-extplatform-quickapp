import index  from './index/mutations'

export default {
  ...index,
  changeLogin(state, payload) {
      state.login = payload
  }
}
