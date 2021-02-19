/**
 * intention
 */

import React from 'react'
import { Row, Col, Card, Avatar,PageHeader, Button, Input, Popconfirm, Tooltip, message, Spin, Menu, Dropdown, Divider } from 'antd'
import { DeleteOutlined, CopyOutlined, FilterTwoTone } from '@ant-design/icons'
import View from '../../../components/intention/viewModel'
import Add from '../../../components/public/addModel'
import INTENTIONAPI from '../../../api/intentionApi'
import QueueAnim from 'rc-queue-anim'
import SIntentionAvatar from '../../../assets/内置意图.png'
import MIntentionAvatar from '../../../assets/模板意图.png'
import { handleAxios, getStorageUserId } from '../../../utils/commons'
import { connect } from 'react-redux'

class Intention extends React.Component {
    formRef = React.createRef()
    inputRef = React.createRef()

    constructor(props){
        super(props);
        this.state = {
            title: '',
            viewName: '',
            grammars: '',
            intentionSystemList: [],
            intentionModelList: [],
            currentCopy: '',
            editActive: false,
            addVisible: false,
            cardLoading: true,
            btnLoading: false,
            currentList: 'all'
        }
    }

    componentDidMount() {
        this.getIntention()
        // 面包屑设置
        const titleList = [{
            key: this.props.match.path,
            title: '意图管理'
        }]
        this.props.changeBreadList(titleList)
    }

    /**
     * 获取意图库列表
     */
    getIntention = async () =>{
        this.setState({ cardLoading: true })
        const userId = getStorageUserId()
        if (!userId) {
            this.props.history.push('/login')
            return
        }
        // let data = {
        //     userId: userId
        // }
        // const res = await INTENTIONAPI.getIntentionStore(data)
        // const resData = handleAxios.handleRes(res)
        // if (resData) {
        //     if(resData.length === 0) {
        //         message.info('暂无数据 您可以点击新建！')
        //     }
        //     this.setState({
        //         intentionStoreList: resData,
        //         cardLoading: false
        //     })
        // } else {
        //     this.setState({ cardLoading: false })
        // }
        let data = [
            {
                id: 1,
                name: 'TEST1'
            },
            {
                id: 2,
                name: 'TEST2'
            }
        ]
        let datas = [
            {
                id: 1,
                name: '模块1'
            },
            {
                id: 2,
                name: '模块2'
            }
        ]
        this.setState({
            intentionSystemList: data,
            intentionModelList: datas,
            cardLoading: false
        })
    }

    /**
     * 查看意图
     */
    viewIntention = async (item) => {
        const userId = getStorageUserId()
        if (!userId) {
            this.props.history.push('/login')
            return
        }
        // let data = {
        //     userId: userId,
        //     id: item.id
        // }
        // const res = await INTENTIONAPI.viewIntentionDetial(data)
        // const resData = handleAxios.handleRes(res)
        // if (resData) {
        //     if(resData.length === 0) {
        //         message.info('暂无数据 您可以点击新建！')
        //     }
        //     this.setState({
        //         viewName: item.name,
        //         grammars: resData.grammars
        //    })
        // }
        console.log('触发了')
        this.setState({
            viewName: '模板1',
            intentionType: 'system',
            grammars: 'import <lexicon.apps>;\nimport <lexicon.AppList>;\n<敬语> = 请|请帮我|帮我|我需要|需要|我想要|想要|麻烦|帮忙|麻烦给我|麻烦为我|麻烦帮我|请给我|给我|请为我|为我|请替我|替我|我要|请同我|同我|麻烦同我|唔该|唔该同我|唔该帮我;\n<app> = <ANY><ANY>+;\npublic <appList> = <lexicon.AppList>;\npublic <name> = <apps>|<app>|/1.1/<appList>;\npublic <open> = 打开|开开|开|开启|开一下|启动|进入;\npublic <close> = 关闭|关|关了|关一下|关掉|关上|退出|结束|关咗佢|闩咗佢|闩下|闩|闩咗|关咗;\n<action> = <open>|<close>;\n\n<sentence1> = [<敬语>]<action><name>[好不好|行不行|可不可以|好唔好|得唔得|可唔可以];\n<sentence2> = [能不能|可不可以|可唔可以][<敬语>]<action><name>;\n<sentence3> =[<敬语>][把|将|帮我把|帮我将]<name>[给我|同我]<action>[一下];\n\npublic <TASK> = <sentence1>|<sentence2>|<sentence3>;',
            editVisible: true
        })
    }

    /**
     * 意图删除
     */
    handleDeleteIntention = async (id)=>{
        const userId = getStorageUserId()
        if (!userId) {
            this.props.history.push('/login')
            return
        }
        let data = {
            userId: userId,
            intentionId: id
          }
          const res = await INTENTIONAPI.deleteIntentionStore(data)
          handleAxios.handleRes(res)
          // 删除后更新列表
          this.getIntention()
    }


    /**
     * 意图复制
     */
    handleCopyIntention = (id)=>{
        this.setState({ 
            addVisible: true,
            title: '复制意图',
            currentCopy: id
        })
    }

    /**
     * 意图新建
     */
    showAddModal = e => {
        const type = e.key
        console.log(type)
        if (type === 'system') {
            this.setState({
                addVisible: true,
                title: '新建内置意图',
            })
        } else {
            this.setState({
                addVisible: true,
                title: '新建模板意图',
            })
        }
    }

    /**
     * 取消新建/复制
     */
    handleCancle = () => {
        this.setState({
            addVisible: false
        })
    }

    /**
     * 取消预览
     */
    handleCancleView = () => {
        this.setState({
            editVisible: false
        })
    }

    /**
     * 提交新建
     */
    submitAdd = async value => {
        const userId = getStorageUserId()
        if (!userId) {
            this.props.history.push('/login')
            return
        }
        this.setState({ btnLoading: true })
        if (this.state.title === '新建意图') {
            // let data = {
            //     userId: userId,
            //     name: value.name,
            //     description: '',
            // }
            // const res = await INTENTIONAPI.addIntention(data)
            // handleAxios.handleRes(res)
            // this.setState({
            //     btnLoading: false,
            //     addVisible: false,
            // })
            // 更新列表
            this.getIntention()
        } else {
            // let data = {
            //     userId: userId,
            //     name: value.name,
            //     skillId: this.state.currentCopy,
            //     description: '',
            // }
            // const res = await INTENTIONAPI.copyIntention(data)
            // handleAxios.handleRes(res)
            // this.setState({
            //     btnLoading: false,
            //     addVisible: false,
            //     currentCopy: ''
            // })
            // 更新列表
            this.getIntention()
        }
    }

    /**
     * 搜索--------------
     */
    searchList = async value => {
        if (value) {
            this.setState({ cardLoading: true })
            const userId = getStorageUserId()
            if (!userId) {
                this.props.history.push('/login')
                return
            }
            const searchName = value.replace(/\s+/g, '')
            let data = {
                userId: userId,
                name: searchName
            }
            const res = await INTENTIONAPI.searchIntentionStore(data)
            const resData = handleAxios.handleRes(res)
            if (resData) {
                if(resData.length === 0) {
                    message.info('暂无数据 您可以点击新建！')
                }
                this.setState({
                    intentionStoreList: resData,
                    cardLoading: false
                })
            } else {
                this.setState({ cardLoading: false })
            }
        } else {
            this.getIntention()
        }
    }

    /**
     * 筛选列表
     */
    filterList = e => {
        const sort = e.key
        this.setState({
            currentList: sort
        })
    }

    /**
     * 提交保存
     */
    onSaveEdit = e => {
        console.log(e)
    }



    render() {
        const {
            addVisible,
            cardLoading,
            title,
            viewName,
            grammars,
            intentionType,
            editVisible, 
            btnLoading,
            currentList
        } = this.state
        const filterMenu = (
            <Menu onClick={this.filterList}>
                <Menu.Item key="desc" disabled={this.state.currentList==='all'}>所有意图</Menu.Item>
                <Menu.Item key="asc" disabled={this.state.currentList==='system'}>内置意图</Menu.Item>
                <Menu.Item key="byname" disabled={this.state.currentList==='modle'}>模板意图</Menu.Item>
            </Menu>
        )
        const addMenu = (
            <Menu onClick={this.showAddModal}>
                <Menu.Item key="system">内置意图</Menu.Item>
                <Menu.Item key="modle">模板意图</Menu.Item>
            </Menu>
        )
        return (
            <div className="intention-store">
                {/* 页头 */}
                <PageHeader
                key="header"
                ghost={false}
                title="意图"
                subTitle="意图展示"
                extra={[
                    <Input.Search
                        key="search"
                        allowClear
                        placeholder="输入搜索内容"
                        onSearch={value => this.searchList(value)}
                        className="search_style"
                    />,
                    <Dropdown overlay={filterMenu}>
                        <Button>
                            <FilterTwoTone />筛选
                        </Button>
                    </Dropdown>,
                    <Dropdown overlay={addMenu}>
                        <Button type="primary">新建意图
                        </Button>
                    </Dropdown>,
                ]}
                ></PageHeader>
                <Spin spinning={cardLoading}>
                    {/* 模板意图 */}
                    {currentList === 'all' || currentList === 'modle' ? (
                    <>
                    <Divider orientation="left">
                        <Tooltip placement="right" title="在编辑Task时作为模板调用，调用后可编辑" >
                            <span style={{color: "rgba(0, 0, 0, 0.45)", fontSize: "15px"}}>模板意图</span>
                        </Tooltip>
                    </Divider>
                    <Row>
                        {/* 卡片列表 */}
                        {this.state.intentionModelList.map((item, index)=>{
                            return <Col span={4} key={item.id}>
                                <QueueAnim type="right">
                                    <Card
                                        key={item.id}
                                        hoverable="true"
                                        style={{ margin: "10px" }}
                                        actions={[
                                            <Tooltip placement="bottom" title="复制"><CopyOutlined key="copy" onClick={() =>{this.handleCopyIntention(item.id)}} /></Tooltip>,
                                            <Popconfirm title="确定删除吗？" onConfirm={() =>{this.handleDeleteIntention(item.id)}}>
                                                <Tooltip placement="bottom" title="删除"><DeleteOutlined key="delete" /></Tooltip>
                                            </Popconfirm>,
                                        ]}>
                                            <Card.Meta
                                            onClick={() =>{this.viewIntention(item)}}
                                            avatar={<Avatar src={MIntentionAvatar} />}
                                            title={item.name}
                                            description={item.id}
                                            />
                                    </Card>
                                </QueueAnim>
                            </Col>
                        })}
                    </Row>
                    </>) : null }
                    {/* 内置意图 */}
                    {currentList === 'all' || currentList === 'system' ? (
                    <>
                    <Divider orientation="left">
                        <Tooltip placement="right" title="可在编辑Task时作为内置源调用，不可随意修改" >
                        <span style={{color: "rgba(0, 0, 0, 0.45)", fontSize: "15px"}}>内置意图</span>
                        </Tooltip>
                    </Divider>
                    <Row>
                        {/* 卡片列表 */}
                        {this.state.intentionSystemList.map((item, index)=>{
                            return <Col span={4} key={item.id}>
                                <QueueAnim type="right">
                                    <Card
                                        key={item.id}
                                        hoverable="true"
                                        style={{ margin: "10px" }}
                                        actions={[
                                            <Tooltip placement="bottom" title="复制"><CopyOutlined key="copy" onClick={() =>{this.handleCopyIntention(item.id)}} /></Tooltip>,
                                            <Popconfirm title="确定删除吗？" onConfirm={() =>{this.handleDeleteIntention(item.id)}}>
                                                <Tooltip placement="bottom" title="删除"><DeleteOutlined key="delete" /></Tooltip>
                                            </Popconfirm>,
                                        ]}>
                                            <Card.Meta
                                            onClick={() =>{this.viewIntention(item)}}
                                            avatar={<Avatar src={SIntentionAvatar} />}
                                            title={item.name}
                                            description={item.id}
                                            />
                                    </Card>
                                </QueueAnim>
                            </Col>
                        })}
                    </Row>
                    </>) : null }
                </Spin>
                
                {/* 新建/复制-弹窗 */}
                <Add title={title} addVisible={addVisible} btnLoading={btnLoading} submitAdd={this.submitAdd} handleCancle={this.handleCancle} />

                {/* 预览弹窗 */}
                <View editVisible={editVisible} viewName={viewName} intentionType={intentionType} grammars={grammars} handleCancleView={this.handleCancleView} onSaveEdit={this.onSaveEdit} />

            </div>
        );
    }
}


// react-redux
const mapStateToProps = state => {
    return {
        breadList: state.breadList
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeBreadList(e) {
            let action = {
                type: 'changeBreadList',
                breadList: e
            }
            dispatch(action)
        },
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Intention)