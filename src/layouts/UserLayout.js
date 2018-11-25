import React from 'react'
import { Switch, Route, Redirect } from 'dva/router'
import { getRoutes } from './../utils/utils'

class UserLayout extends React.Component {
  render() {
    const { routerData, match } = this.props
    return (
      <Switch>
        {
          getRoutes(match.path, routerData).map(item => (
            <Route
              key={item.key}
              path={item.path}
              component={item.component}
              exact={item.exact}
            />
            )
          )
        }
        <Redirect from="/user" to="/user/login" exact />
      </Switch>
    )
  }
}

export default UserLayout
