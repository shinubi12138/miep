import React from 'react'
import { Menu, Icon,Switch,Breadcrumb  } from 'antd';
import { /*Route,*/Switch as SWT } from 'dva/router';
import { Layout } from 'antd';
import { connect } from 'dva';
// import Shop from '../routes/Shop/Shop'
import Authorized from './../utils/Authorized'
import { getRoutes } from './../utils/utils'

const SubMenu = Menu.SubMenu;
const { Footer, Sider, Content } = Layout;
const { AuthorizedRoute } = Authorized


@connect(({user,loading}) =>({
  user,
  loading:loading.effects['user/info']
}))
class BasicLayout extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      collapsed: false,
      theme: 'dark',
      current: '1',
      userInfo:[],
    }
  }
 
  componentDidMount(){
    this.props.dispatch({
      type: 'user/info',
      callback: (data) => {
        this.userInfoUnit(data)
      }
    })
  }

  userInfoUnit= (data) =>{  
    if(data.status===3){
      this.props.history.push('/login')
    }else{
      this.setState({userInfo:data.data})
    }
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  changeTheme = (value) => {
    this.setState({
      theme: value ? 'dark' : 'light',
    });
  }

  handleClick = (e) => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  }

  render() {
    const {match,routerData} =this.props;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        {/* 侧边栏 */}
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
          theme={this.state.theme}
        >
            <Menu
            defaultSelectedKeys={['2']}
            defaultOpenKeys={['sub1','sub2','sub3']}
            mode="inline"
            inlineCollapsed={this.state.collapsed}
            theme={this.state.theme}
            onClick={this.handleClick}
            selectedKeys={[this.state.current]}
          >
            {/* 影藏和出现的按钮 */}
            <Menu.Item key="0" onClick={this.toggleCollapsed}>
              <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
              <span>收起来...</span>
            </Menu.Item>

            {/* 主题切换按钮 */}
            <Menu.Item key="1">
              <Icon type="bg-colors" />
              <span><Switch
                checked={this.state.theme === 'dark'}
                onChange={this.changeTheme}
                checkedChildren="开灯"
                unCheckedChildren="关灯"
              /></span>
            </Menu.Item>

            {/* 用户基本信息 */}
            <Menu.Item key="2">
              <Icon type="user"  spin="true" />
              <span>欢迎你：{this.state.userInfo.us_name}</span>
            </Menu.Item>

            {/* 店铺基本信息 */}
            <Menu.Item key="3" onClick={()=>{this.props.history.push('/shop')}}>
              <Icon type="shop" />
              <span>我收藏的店铺</span>
            </Menu.Item>


            <SubMenu key="sub1" title={<span><Icon type="mail" /><span>Navigation One</span></span>}>
              <Menu.Item key="5">Option 5</Menu.Item>
              <Menu.Item key="6">Option 6</Menu.Item>
              <Menu.Item key="7">Option 7</Menu.Item>
              <Menu.Item key="8">Option 8</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>Navigation Two</span></span>}>
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
              <SubMenu key="sub3" title="Submenu">
                <Menu.Item key="11">Option 11</Menu.Item>
                <Menu.Item key="12">Option 12</Menu.Item>
              </SubMenu>
            </SubMenu>
          </Menu>
      
        </Sider>
      

       {/* 主视图  */}
       <Layout>
        {/* <Header style={{ background: '#00b38a', padding: 0 }} /> */}
        <Content style={{ margin: '0 16px' }}>
          
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>



           <SWT>
              {
                getRoutes(match.path, routerData).map(item => (
                  <AuthorizedRoute
                    key={item.key}
                    path={item.path}
                    exact={item.exact}
                    component={item.component}
                    authority={item.authority}
                    redirectPath="/exception/403"
                  />
                ))
              }
              {/* <Redirect from="/" to="/check/list" exact /> */}
            </SWT>
            {/* <Route path="/shop" exact render={props=>(<Shop userid={this.state.userInfo.us_id}/>)} />    */}
        
        </Content>

        <Footer style={{ textAlign: 'center' }}>
          MIE PLATFORM ©2018 Created by DanielXiao 
        </Footer>

      </Layout>
    </Layout>   
    );
  }
}
export default BasicLayout


