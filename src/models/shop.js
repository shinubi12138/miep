import { getAllShop,addShop,deleteShop,getCommodityList} from '../services/shop'
export default {
  namespace: 'shop',
  state: {
    status: '',
    data:[],
  },

  subscriptions: {
    // setup({ dispatch }) { // eslint-disable-line
    //   dispatch({
    //     type: 'List'
    //   })
    // },
  },

  effects: {
    *list({_,callback}, { call, put }) {
      const { data } = yield call(getAllShop)
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
    *addstore({payload,callback}, { call, put }){
      const { data } = yield call(addShop,payload)
      if (data) {
        yield put({
          type: 'changeLoginState',
          payload: {
            user: {
              ...data,
            }
          }
        })
        callback(payload,data)
      }
    },
    *deleteStore({payload,callback}, { call, put }){
      const { data } = yield call(deleteShop,payload)
      if (data) {
        yield put({
          type: 'changeLoginState',
          payload: {
            user: {
              ...data,
            }
          }
        })
        callback(payload,data)
      }
    },
    *getCommodityList({payload,callback}, { call, put }){
      const { data } = yield call(getCommodityList,payload)
      if (data) {
        yield put({
          type: 'changeLoginState',
          payload: {
            user: {
              ...data,
            }
          }
        })
        callback(JSON.parse(data.data),payload)
      }
    }
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
