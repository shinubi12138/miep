import React from 'react';
import { Button,Row,Col,Input,notification,Steps,Table,Card,Tabs, Form, Icon,Divider,Progress ,BackTop   } from 'antd';
import styles from './Shop.less'
import { connect } from 'dva';

const Step = Steps.Step;
const { Meta } = Card;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;


  const data = [{
    key: '1',
    name: 'John Brown',
    money: '￥300,000.00',
    address: 'New York No. 1 Lake Park',
    action:'<Button>fdf</Button>'
  }, {
    key: '2',
    name: 'Jim Green',
    money: '￥1,256,000.00',
    address: 'London No. 1 Lake Park',
  }, {
    key: '3',
    name: 'Joe Black',
    money: '￥120,000.00',
    address: 'Sidney No. 1 Lake Park',
  }];

  const dataOfShopDetail = [{
    key: '1',
    basicInfos:'sddsadsaad',
    hotRate: '￥300,000.00',
    updateTime: 'New York No. 1 Lake Park',
    monthSoild:'<Button>fdf</Button>',
    action:'dfdffd'
  }];



@connect(({shop,loading}) =>({
    shop,
    loading:loading.effects['shop/list'] || loading.effects['shop/addstore'] ||  loading.effects['shop/deleteStore']  || 
    loading.effects['shop/getCommodityList']  
}))
class Shop extends React.Component {
    constructor(props){
        super(props);
        this.state={
            userid:'',
            shopList:[],

            shopDetailID:'',  //店铺细节展示的店铺ID
            shopDetails:[],
            shopDetailPage:0,

            shop_link:'',   //添加店铺的连接
            shop_id:'',     //添加店铺的id
            shop_note:'',     //添加店铺备注

            
            processPercent:0, //进度条的进度
            totalProcess:0,
            currentProcess:0,
        };
    }

    componentDidMount=()=>{ 
        this.props.dispatch({
            type:'shop/list',
            callback:(data)=>this.shopListCallBack(data)
        })
    }

    shopListCallBack=(data)=>{
        if(data&& data.status===1){
            this.setState({shopList:data.data});
            this.shopListTableDateFormat();
        }else{
            const args = {
                message: '网络异常',
                description: '请重新刷新页！！！',
                duration: 2,
                };
                notification.open(args);
                return null;
        }
    }

    //状态变化处理器
    stateChangeHandler=(key,value)=>{
        this.setState({[key]:value});
    }

    //上方的进度条进度的位置
    getValidateProcess=()=>{
        if(this.state.userid===undefined)
        {
            return 0;
        }else
        {
            if(this.state.shopList===undefined || this.state.shopList.length===0)
            {
                return 1;
            }
            return 2;
        }
    }

    //将shoplist转换成table格式的shoplist
    shopListTableDateFormat=()=>{
        const data=[];
        data.push( this.state.shopList.map((item,i)=>{
             return {
                key:i,
                name:item.name,
                list:[],
                info:item.time,
                action:item.dp_id,
            }
        }))
        return data;
    }

    //添加店铺
    addShop = (e) => {
        e.preventDefault();
        if(!(this.state.shop_link||this.state.shop_id)){
            const args = {
                message: '输入提示',
                description: '店铺链接和店铺ID至少输入一个！！！',
                duration: 4,
                };
                notification.open(args);
                return null;
        }else{
            if(!this.state.shop_note){
                const args = {
                    message: '输入提示',
                    description: '请输入店铺的备注！！！',
                    duration: 4,
                    };
                    notification.open(args);
                    return null;
            }else{
                if(!this.state.shop_link){
                    this.addShopRequest(2,this.state.shop_id,this.state.shop_link,this.state.shop_note)
                    console.log("店铺ID")
                }else{
                    this.addShopRequest(1,this.state.shop_id,this.state.shop_link,this.state.shop_note)
                    console.log("店铺链接")
                }
            }
        }
    }

    //添加店铺的网络请求
    addShopRequest=(type,id,url,name)=>{
        const payload={type:type,id:id,url:url,name:name}
        this.props.dispatch({
            type:'shop/addstore',
            payload:payload,
            callback:(payload,data)=>this.addShopRequestCallBack(payload,data)
        })
    }

    //添加店铺的网络请求回调，和重试
    addShopRequestCallBack=(payload,data)=>{
        if(data && data.status===1){
            const args = {
                message: '店铺操作',
                description: '添加店铺成功！！！请刷新网页',
                duration: 2,
                };
                notification.open(args);
                return null;
        }else{
            console.log('failed')
            const args = {
                message: '失败提示',
                description: '网络异常，正在重试！！！',
                duration: 2,
                };
                notification.open(args);
            this.addShopRequest({...payload})
        }
    }

    //删除店铺
    deleteShop=(text)=>{
        this.deleteShopRequest(text)
    }

    //删除店铺的网络请求
    deleteShopRequest=(dp_id)=>{
        const payload={dp_id:dp_id}
        this.props.dispatch({
            type:'shop/deleteStore',
            payload:payload,
            callback:(payload,data)=>this.deleteShopRequestCallBack(payload,data)
        })
    }

    //删除店铺的网络回调
    deleteShopRequestCallBack=(payload,data)=>{
        if(data && data.status===1){
            const args = {
                message: '店铺操作',
                description: '店铺成功移除！！！',
                duration: 2,
                };
                notification.open(args);

        let array=[];//移除state中已经被删除的店铺
        for(let i=0;i<this.state.shopList.length;++i){
            if(payload.dp_id!==this.state.shopList[i].dp_id){
                array.push(this.state.shopList[i])
            }
        }//移除state中已经被删除的店铺
        this.setState({shopList:array})
        
        return null;
        }else{
            console.log('failed')
            const args = {
                message: '失败提示',
                description: '网络异常，正在重试！！！',
                duration: 2,
                };
                notification.open(args);
            this.deleteShopRequest({...payload})
        }
    }

    jumpToShopByID=(text)=>{
        const win=window.open('about:blank');
        win.location.href = 'https://haohuo.jinritemai.com/views/shop/index?id='+text;
    }

    jumpToGoodsByID=(text)=>{
        const win=window.open('about:blank');
        win.location.href = 'https://haohuo.jinritemai.com/views/product/item2?id='+text;
    }

    //获取店铺信息
    moreShopDetailByID=(shop_id)=>{
        this.setState({shopDetailID:shop_id});
        this.props.dispatch({
            type:'shop/getCommodityList',
            payload:{dp_id:shop_id,page:this.state.shopDetailPage},
            callback:(data,payload)=>this.getCommodityListCallBack(data,payload)
        })
    }

    //获取店铺信息回调
    getCommodityListCallBack=(data,payload)=>{
        if(data){
            const total=data.total_count
            const page=data.page+1
            const pageSize=data.page_size
            const array=[]
            for(let i=0;i<data.goods_infos.length;++i){//15天内的所有衣服  有销量的 多了的话网页太卡
                const time=Date.parse(new Date(data.goods_infos[i].mtime))+86400000*15
                if(time>Date.parse(new Date())
                //  && data.goods_infos[i].month_sell_num>0
                 ){
                    array.push(data.goods_infos[i])
                }
            }
            if(total>=page*pageSize){//数据没有获取完
                this.props.dispatch({
                    type:'shop/getCommodityList',
                    payload:{dp_id:payload.dp_id,page:page},
                    callback:(data,payload)=>this.getCommodityListCallBack(data,payload)
                })
                if(page===1)//第一次请求的回调需要清空上次的缓存
                {
                    this.setState({shopDetails:array,
                        processPercent:Math.floor(page*pageSize*100/total)
                        ,totalProcess:total,
                        currentProcess:page*pageSize}) 
                }else{
                    this.setState({shopDetails:this.state.shopDetails.concat(array),
                        processPercent:Math.floor(page*pageSize*100/total)
                        ,totalProcess:total,
                        currentProcess:page*pageSize})
                }
                
            }else{
                this.setState({shopDetailPage:0,
                    processPercent:Math.floor(page*pageSize*100/total)
                        ,totalProcess:total,
                        currentProcess:page*pageSize
                })
            }

            

        }else{//失败的话需要重试请求
            console.log('sdsaasdasdasds')
            this.props.dispatch({
                type:'shop/getCommodityList',
                payload:{dp_id:payload.dp_id,page:payload.page},
                callback:(data,payload)=>this.getCommodityListCallBack(data,payload)
            })
        }
    }

    hideShopDetail=()=>{
        this.setState({shopDetailID:''});
    }

    shopDetailFormatToTable=()=>{
        const data=[];
        data.push( this.state.shopDetails.map((item,i)=>{
             return {
                key:i,
                name:item.sku_title,
                price:'￥'+item.sku_price+'元，佣金：'+item.cos_info.cos_fee+'元：佣金比例:'+item.cos_ratio,
                icon:item.figure,
                hotRate:item.hotrank,
                updateTime:item.mtime,
                monthSoild:item.month_sell_num,
                action:item.platform_sku_id,
            }
        }))
        return data;
    }

    render() {

        //店铺表格的数据格式
        const deleteShop=this.deleteShop;
        const jumpToShopByID=this.jumpToShopByID;
        const jumpToGoodsByID=this.jumpToGoodsByID;
        const moreShopDetailByID=this.moreShopDetailByID;

        const columns = [
            {
            title: '店铺名称',
            dataIndex: 'name',
          }, {
            title: '商品列表',
            dataIndex: 'list',
          }, {
            title: '店铺基本信息',
            dataIndex: 'info',
            render:(time)=>(
                <p>收藏的时间<br />{time}</p>
            ),
          },{
            title: '店铺操作',
            dataIndex: 'action',
            render: (text) => (
                <div>
                    <Button type="primary" onClick={()=>jumpToShopByID(text)} >跳转店铺</Button>
                <br />
                     <Button type="primary" onClick={()=>moreShopDetailByID(text)}  style={{'marginTop':'3px'}}>店铺细节</Button>
                <br />
                     <Button type="dashed" onClick={()=>deleteShop(text)}  style={{'marginTop':'3px'}}>删除店铺</Button>
                
                </div>
                
              ),
          }];

        const columsOfShopDetail=[
            {
            title: '名字',
            dataIndex: 'name',
          },{
            title: '价格',
            dataIndex: 'price',
          },{
            title: '图片',
            dataIndex: 'icon',
            render:(url)=>(
                <img src={url} className={styles.detailImg}/>
            )
          },{
            title: '热度',
            dataIndex: 'hotRate',
            sorter:(a, b) => a.hotRate - b.hotRate
          },{
            title: '上架时间',
            dataIndex: 'updateTime',
            sorter:(a, b) => Date.parse(new Date(a.updateTime))-Date.parse(new Date(b.updateTime))
          },{
            title: ' 月销量',
            dataIndex: 'monthSoild',
            sorter:(a, b) => a.monthSoild - b.monthSoild
          },{
            title: ' 操作',
            dataIndex: 'action',
            render:(id)=>(
                <div>
                    <Row>
                        <Col span={24}>
                            <Button type='primary' onClick={()=>{this.jumpToGoodsByID(id)}}>查看商品</Button>
                        </Col>
                    </Row>
                    <Row  style={{'marginTop':'8px'}}>
                        <Col span={24}>
                            <Button type='primary'>关注该商品</Button>
                        </Col>
                    </Row>
                </div>
            )
          }];
        
        
        let shopDetailFormat=this.shopDetailFormatToTable();
        if(!shopDetailFormat[0]){
            shopDetailFormat=dataOfShopDetail;
        }
        
        //店铺列表
        let shopList=this.shopListTableDateFormat()

        
        //最上面的数据加载进度条
        let validateProcessDiscription='wait'
        if(!shopList) 
        {
            shopList=data;
            validateProcessDiscription='error' 
        }else{
            validateProcessDiscription='finish'
        }
        const validateProcess=this.getValidateProcess()
        

        return (
            <div>
                <Row >
                    <Col span={24}>
                        <Steps current={validateProcess} status={validateProcessDiscription}>
                            <Step title="身份认证" icon={validateProcess===0?<Icon type="loading" />:""}  description="VIP登录权限认证." />
                            <Step title="店铺信息获取"  icon={validateProcess===1?<Icon type="loading" />:""}  description="获取店铺相关信息." />
                            <Step title="数据渲染"  icon={validateProcess===2?<Icon type="smile" />:""}   description="验证成功." />
                        </Steps>
                    </Col>
                </Row>
            
                <button onClick={()=>{console.log(this.state);
                console.log(Date.parse(new Date('2018-11-25 14:41:22')))
                console.log(Date.parse(new Date('2018-11-25 14:41:22'))+86400000*30)
                console.log(Date.parse(new Date()))
                }}>sdssd</button> 

                <Row className={styles.infoRow}>
                    <Col span={6}>
                        <Card
                            hoverable
                            style={{ width: 240}}
                            className={styles.cardCenter}
                            cover={<img alt="example" src="https://mie999source-1256286965.cos.ap-chengdu.myqcloud.com/mie_icon/user/sd.jpg" />}
                        >
                            <Meta
                            title="收藏的店铺"
                            description={shopList[0].length}
                            />
                        </Card>
                    </Col>

                    <Col span={18} >
                        <Row>
                            <Col span={24}>
                                <Tabs defaultActiveKey="1">
                                    <TabPane tab="操作步骤" key="1"><h5>你将按照以下步骤进行数据爬虫对比</h5>
                                                                        爬取商品->对比商品->更新数据库列表</TabPane>
                                    <TabPane tab="和老系统比较" key="2">用法差不多的，就是这个比较全面一点。</TabPane>
                                    <TabPane tab="**记住添加商品**" key="3">需要商品的信息对比的话，记得将指定的商品加入收藏夹里面</TabPane>
                                </Tabs>
                            </Col>
                        </Row>
                        <Row className={styles.addShopForm}> 
                            <Col span={24}>
                                <Form onSubmit={this.addShop}>
                                    <FormItem>
                                        <Input prefix={<Icon type="link" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="店铺链接" value={this.state.shop_link} onChange={(value)=>{this.stateChangeHandler('shop_link',value.target.value)}}/>
                                    </FormItem>
                                    <FormItem>
                                        <Input prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="店铺ID"  value={this.state.shop_id} onChange={(value)=>{this.stateChangeHandler('shop_id',value.target.value)}}/>
                                    </FormItem>
                                    <FormItem>
                                        <Input prefix={<Icon type="cloud" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="备注"  value={this.state.shop_note} onChange={(value)=>{this.stateChangeHandler('shop_note',value.target.value)}}/>
                                    </FormItem>
                                    <FormItem>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                    >
                                        添加店铺
                                    </Button>
                                    </FormItem>
                                </Form>
                            </Col>
                        </Row>        
                    </Col>

                </Row>
                

                <Divider  className={styles.tablesForm}>店铺列表</Divider>
                <Row className={this.state.processPercent===0? styles.hide:""} style={{'marginBottom':'50px'}}>
                    <Col span={6}>
                        <h3 className={styles.floatRight}>总共{this.state.totalProcess}已解析{this.state.currentProcess}个了</h3>
                    </Col>
                    <Col span={18} style={{'paddingRight':'70px'}}>
                         <Progress percent={this.state.processPercent} />
                    </Col>
                </Row>

                <Row className={styles.whiteBackground}>
                    <Col span={24}  className={this.state.shopDetailID.length===0?"": styles.hide}>
                    <Table
                        columns={columns}
                        dataSource={shopList[0]}
                        bordered
                        pagination={false}
                        title={() => 
                            <Row>
                                <Col span={8}><Button type="ghost">爬取商品</Button></Col>
                                <Col span={8}><Button type="ghost">对比商品</Button></Col>
                                <Col span={8}><Button type="ghost">更新数据库列表</Button></Col>
                                
                            </Row>}
                    />
                    </Col>

                    <Col span={24}   className={this.state.shopDetailID.length===0? styles.hide:""}>
                    <Table 
                        columns={columsOfShopDetail}
                        dataSource={shopDetailFormat[0]}
                        pagination={false}
                        title={() => 
                            <Row>
                                <Col span={6} style={{'paddingLeft':'50px'}}>
                                  <Button type="primary" onClick={()=>this.hideShopDetail()}>《《《返回</Button>
                                </Col>
                                <Col span={18} style={{'paddingLeft':'50px'}}>
                                  <h3>为防止网页卡死，该页面只展示15天内且有销量的数据。15天更新的商品数为:{this.state.shopDetails.length+1}</h3>
                                </Col>
                            </Row>}
                    />
                    </Col>
                </Row>

                <BackTop />
            </div>
        )
    }
}

export default Shop
