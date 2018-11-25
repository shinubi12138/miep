import React from 'react';
import { connect } from 'dva';
import styles from './Login.less';
import { Button,Row,Col,Input,notification } from 'antd';

@connect(({user,loading}) =>({
    user,
    loading:loading.effects['user/login']
}))

class Login extends React.Component {

    constructor(props){
        super(props)
        this.state={
            userName:'',
            passWord:'',
            info:'',
            status:0  //0等待输入并展示info    1登录成功  2 登陆中展示info
        }
        document.title="登录MIE";
    }

    submit=()=>{
        if(this.state.status===2)
        {
            const args = {
                message: '登录提示',
                description: '请勿发起多个登录！！！',
                duration: 4,
             };
              notification.open(args);
              return null;
        }
        if(this.state.userName.length===0)
        {
            const args = {
                message: '登录提示',
                description: '请输入你的用户名哟！！！',
                duration: 4,
             };
              notification.open(args);
              return null;
        }
        if(this.state.passWord.length===0){
            const args = {
                message: '登录提示',
                description: '千万不要忘记密码了哟！！！',
                duration: 4,
             };
              notification.open(args);
              return null;
        }
        this.setState({info:"登陆中...",status:2});
        this.props.dispatch({
            type:'user/login',
            payload:{userName:this.state.userName,passWord:this.state.passWord},
            callback:(data)=>this.infoCallBack(data)
        })
    }

    infoCallBack=(data)=>{
        if(data.status===0){
            this.setState({status:data.status,info:data.data})
        }
        else{
            this.setState({status:data.status,info:data.data})//这里是登录成功的界面   从这里进行跳转
            this.props.history.push('/')
        }
    }

    stateHandler=(key,value)=>{
        if(this.state.status===0){
            this.setState({[key]:value});
        }else if(this.state.status===2){
            const args = {
                message: '登录提示',
                description: '已经在验证账号和密码了，请耐心等待！',
                duration: 4,
             };
              notification.open(args);
        }else{
            const args = {
                message: '登录提示',
                description: '成功！欢迎使用MIE信息系统！',
                duration: 4,
             };
              notification.open(args);
        }
    }
    
    render(){
        const {userName,passWord,info,status}=this.state;

    return (
        <div className={styles.pageWraper}>
            <div className={styles.headWraper}>
                <h1><strong>MIE信息平台</strong></h1>
                <div>
                    <p>
                        欢迎你来到MIE信息平台，MIE将会为你提供最优质的数据，开始打造你的专属定制吧 !
                    </p>
                </div>
            </div>

            <div className={styles.info}>
                <Row>
                    <Col span={18}>
                        <div className={styles.basic_info}>
                            <h3>欢迎使用MIE</h3>
                            <p>请输入你的登录信息</p>
                            <p className={styles.infomation}>{this.info}{status!==1?info:''}</p>
                        </div>
                    </Col>
                    <Col span={6}>
                        <img  className={styles.roundIcon} alt="mie_icon"
                                src="https://mie999source-1256286965.cos.ap-chengdu.myqcloud.com/mie_icon/user/favicon.png" />
                    </Col>
                </Row>
                <div className={styles.input_info}>
                    <Input placeholder="Username..." size="large" 
                    onChange={(e)=>this.stateHandler('userName',e.target.value)}
                    className={styles.userInfo} value={userName}/>
                    <Input placeholder="Password..." size="large" 
                    onChange={(e)=>this.stateHandler('passWord',e.target.value)}
                    className={styles.userInfo} type="password" value={passWord}/>
                    <Button size="large" className={styles.submit} type="primary" onClick={()=>this.submit()}>登录</Button>
                </div>
                
            </div>

            <div className={styles.otherPatten}> 
                <Row className={styles.dis}>
                <h2 className={styles.thite}>其他登录方式</h2>
                </Row>
                <Row>
                    <Col span={6}><Button size="large" icon="qq" type="primary" className={styles.otherPattenButton}>QQ</Button></Col>
                    <Col span={6}><Button size="large" icon="wechat" type="primary" className={styles.otherPattenButton}>微信</Button></Col>
                    <Col span={6}><Button size="large" icon="alipay-circle" type="primary" className={styles.otherPattenButton}>支付宝</Button></Col>
                    <Col span={6}><Button size="large" icon="phone" type="primary" className={styles.otherPattenButton}>手机验证</Button></Col>
                </Row>
            </div>

        </div>
    );
    }
}


export default Login
