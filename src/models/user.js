import { login,getUserInfo } from '../services/user'
export default {
  namespace: 'user',
  state: {
    status: '',
    data:[],
  },

  subscriptions: {
    // setup({ dispatch }) { // eslint-disable-line
    //   dispatch({
    //     type: 'getUserInfo'
    //   })
    // },
  },

  effects: {

    *login({ payload ,callback}, { call, put }) {
      const { data } = yield call(login, payload)
      if (data) {
          yield put({
            type: 'changeLoginState',
            payload: {
              user: {
                ...data
              }
            }
          })
          callback(data);
      }
    },
    *info({_,callback}, { call, put }) {
      const { data } = yield call(getUserInfo)
      if (data) {
        yield put({
          type: 'changeLoginState',
          payload: {
            user: {
              ...data,
            }
          }
        })
        callback(data)
      }
    },
  },

  reducers: {
    changeLoginState(state, { payload }) {
      return { ...state, ...payload.user }
    },
    handleStateChange(state, { payload }) {
      return { ...state, ...payload }
    },
  },
};
