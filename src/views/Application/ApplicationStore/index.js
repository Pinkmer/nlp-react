/**
 * application
 */

import React from 'react'
import { Row, Col, Card, Avatar, PageHeader, Button, Popconfirm, Tooltip, Spin, Input, message, Menu, Dropdown } from 'antd'
import { DeleteOutlined, EditOutlined, CheckOutlined, FilterTwoTone } from '@ant-design/icons'
import Add from '../../../components/public/addModel'
import APPLICATIONAPI from '../../../api/applicationApi'
import QueueAnim from 'rc-queue-anim'
import AppAvatar from '../../../assets/机器人.png'
import { handleAxios, getStorageUserId } from '../../../utils/commons'
import { connect } from 'react-redux'

class Application extends React.Component {
    inputRef = React.createRef()
    
    constructor(props){
        super(props);
        this.state = {
            title: '',
            appStoreList: [],
            editActive: '',
            editName: '',
            editCurrent: {},
            addVisible: false,
            cardLoading: false,
            btnLoading: false,
            currentSort: 'desc'
        }
    }2

    componentDidMount(){
        this.getApplication()
        // 面包屑设置
        const titleList = [{
            key: this.props.match.path,
            title: '机器人'
        }]
        this.props.changeBreadList(titleList)
    }

    /**
     * 获取机器人库列表
     */
    getApplication = async () =>{
        this.setState({ cardLoading: true })
        const userId = getStorageUserId()
        if (!userId) {
            this.props.history.push('/login')
            return
        }
        let data = {
            userId: userId
          }
        const res = await APPLICATIONAPI.getApplicationStore(data)
        const resData = handleAxios.handleRes(res)
        if (resData) {
            if(resData.length === 0) {
                message.info('暂无数据 您可以点击新建！')
            }
            this.setState({
                appStoreList: resData,
                cardLoading: false
            })
        } else {
            this.setState({ cardLoading: false })
        }
    }

    /**
     * 查看应用配置
     */
    viewApp = (item) => {
        if (this.state.editActive === '') {
            const viewRouter = "/robot/" + item.id + '/' + item.name
            this.props.history.push(viewRouter)
        }
    }

    /**
     * 机器人删除
     */
    handleDeleteApp = async (id)=>{
        const userId = getStorageUserId()
        if (!userId) {
            this.props.history.push('/login')
            return
        }
        let data = {
            userId: userId,
            applicationId: id
          }
          const res = await APPLICATIONAPI.deleteApplicationStore(data)
          handleAxios.handleRes(res)
          // 删除后更新列表
          this.getApplication()
    }

    /**
     * 修改名称
     */
    handleEditApp = (item, index)=>{
        this.setState({
            editActive: index,
            editName: item.name,
            editCurrent: {...item}
        }, () => {
            this.inputRef.current.focus()
        })
    }

    /**
     * 提交修改名称
     */
    handleSaveApp = async () => {
        const list = [...this.state.appStoreList]
        const editCard = this.state.editCurrent
        const index = this.state.editActive
        const item = list[index]
        const currentInput = this.inputRef.current.state.value
        const userId = getStorageUserId()
        if (!userId) {
            this.props.history.push('/login')
            return
        }
        let data = {
            userId: userId,
            name: currentInput,
            applicationId: editCard.id,
            version: editCard.version
        }
        const res = await APPLICATIONAPI.updateApplicationStore(data)
        handleAxios.handleRes(res)
        editCard.name = currentInput
        list.splice(index, 1, { ...item, ...editCard })
        this.setState({
            editActive: '',
            appStoreList: list
        })
    }

    /**
     * 新建
     */
    showAddModal = () => {
        this.setState({
            title: '新建机器人',
            addVisible: true,
        });
    }

    /**
     * 提交新建
     */
    submitAdd = async value => {
        this.setState({ btnLoading: true })
        const userId = getStorageUserId()
        if (!userId) {
            this.props.history.push('/login')
            return
        }
            let data = {
                userId: userId,
                name: value.name,
                description: '新增application',
            }
            const res = await APPLICATIONAPI.addApplicationStore(data)
            handleAxios.handleRes(res)
            this.setState({
                btnLoading: false,
                addVisible: false
            })
            // 更新列表
            this.getApplication()
    }

    /**
     * 取消新建
     */
    handleCancle = () => {
        this.setState({ addVisible: false })
    }

    /**
     * 搜索
     */
    searchList = async value => {
        if (value) {
            this.setState({ cardLoading: true })
            const userId = getStorageUserId()
            if (!userId) {
                this.props.history.push('/login')
                return
            }
            let data = {
                userId: userId,
                name: value
            }
            const res = await APPLICATIONAPI.searchAppStore(data)
            const resData = handleAxios.handleRes(res)
            if (resData) {
                if(resData.length === 0) {
                    message.info('暂无数据 您可以点击新建！')
                }
                this.setState({
                    appStoreList: resData,
                    cardLoading: false
                })
            } else {
                this.setState({ cardLoading: false })
            }
        } else {
            this.getApplication()
        }
    }

        /**
     * 排序
     */
    filterList = e => {
        const sort = e.key
        let list = this.state.appStoreList
        this.setState({
            currentSort: sort
        })
        function compare(property){
            return function(a,b){
              var val1 = a[property]
              var val2 = b[property]
              if (val1 < val2) {
                return -1
               } else if (val1 > val2) {
                return 1
               } else {
                return 0
               }
            }
        }
        if (sort === 'desc') {
            list.sort(compare('id'))
        } else if (sort === 'asc') {
            list.sort(compare('id'))
            list.reverse()
        } else if (sort === 'byname') {
            list.sort(compare('name'))
        }
        this.setState({
            appStoreList: list
        })
    }

    render() {
        const {
            title,
            addVisible,
            cardLoading,
            editActive,
            editName,
            btnLoading
        } = this.state
        const filterMenu = (
            <Menu onClick={this.filterList}>
                <Menu.Item key="desc" disabled={this.state.currentSort==='desc'}>降序</Menu.Item>
                <Menu.Item key="asc" disabled={this.state.currentSort==='asc'}>升序</Menu.Item>
                <Menu.Item key="byname" disabled={this.state.currentSort==='byname'}>按名称</Menu.Item>
            </Menu>
        )
        return (
            <div className="app-store">
                {/* 页头 */}
                <PageHeader
                ghost={false}
                title="机器人库"
                subTitle="应用机器人"
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
                            <FilterTwoTone />排序
                        </Button>
                    </Dropdown>,
                    <Button key="add" type="primary" onClick={this.showAddModal}>新建机器人</Button>,
                ]}
                ></PageHeader>
                <Spin spinning={cardLoading}>
                    <Row>
                        {/* 卡片列表 */}
                        {this.state.appStoreList.map((item, index)=>{
                            return <Col span={4} key={item.id}>
                                <QueueAnim type="right">
                                    <Card
                                        key={item.id}
                                        hoverable="true"
                                        style={{ margin: '10px' }}
                                        actions={[
                                            <Tooltip placement="bottom" title={editActive === index ?'提交修改':'修改名称'}>
                                                {editActive === index ?(
                                                    <CheckOutlined key="edit" onClick={this.handleSaveApp} />
                                                ) : (<EditOutlined key="edit" onClick={() =>{this.handleEditApp(item, index)}} />)
                                                }
                                            </Tooltip>,
                                            <Popconfirm title="确定删除吗？" onConfirm={() =>{this.handleDeleteApp(item.id)}}>
                                                <Tooltip placement="bottom" title="删除"><DeleteOutlined key="delete" /></Tooltip>
                                            </Popconfirm>,
                                        ]}>
                                            <Card.Meta
                                            onClick={() =>{this.viewApp(item)}}
                                            avatar={<Avatar src={AppAvatar} />}
                                            title={
                                                editActive === index ?(
                                                    <Input ref={this.inputRef} defaultValue={editName} onPressEnter={this.handleSaveApp} />
                                                ):item.name}
                                            description={item.id}
                                            />
                                        </Card>
                                    </QueueAnim>
                                </Col>
                            })
                        }
                    </Row>
                </Spin>

                {/* 新建-弹窗 */}
                <Add title={title} addVisible={addVisible} btnLoading={btnLoading} submitAdd={this.submitAdd} handleCancle={this.handleCancle} />,
            </div>
        );
    }
}
//把state里的数据映射到props里，可以通过Props使用
// react-redux
const mapStateToProps = state => {
    return {
        breadList: state.breadList
    }
}

const dispatchTOProps = dispatch => {
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


export default connect(mapStateToProps, dispatchTOProps)(Application)