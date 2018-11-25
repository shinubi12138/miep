import React from 'react';
import { Route, Switch, routerRedux } from 'dva/router'
import dynamic from 'dva/dynamic'
import { LocaleProvider, Spin } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import styles from './index.css'
import { getRouterData } from './common/router'


const { ConnectedRouter } = routerRedux

dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />
})


export default function ({ history,app }) {
  const routerData = getRouterData(app)
  const login = routerData['/login'].component
  const BasicLayout = routerData['/'].component
  history.listen((location) => {
    if (location.action === 'POP') return
    window.scrollTo(0, 0)
  })

  return (
    // <Router history={history}>
  <LocaleProvider locale={zhCN}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact  path="/login"   component={login} />
        <Route  path="/" render={props => (<BasicLayout {...props} />)}/>
      </Switch>
    </ConnectedRouter>
  </LocaleProvider>
  );
}



