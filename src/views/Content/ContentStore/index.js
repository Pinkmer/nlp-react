/**
 * content
 */

import React from 'react'
import { Row, Col, Card, Avatar, PageHeader, Button, Popconfirm, Tooltip, Spin, Input, message, Menu, Dropdown } from 'antd'
import { EditOutlined, DeleteOutlined, CheckOutlined, FilterTwoTone } from '@ant-design/icons'
import Add from '../../../components/public/addModel'
import CONTENTAPI from '../../../api/contentApi'
import QueueAnim from 'rc-queue-anim'
import ContentAvatar from '../../../assets/内容源.png'
import { handleAxios, getStorageUserId } from '../../../utils/commons'
import { connect } from 'react-redux'

class Content extends React.Component {
    inputRef = React.createRef()

    constructor(props){
        super(props)
        this.state = {
            title: '',
            contentStoreList: [],
            editActive: '',
            editName: '',
            editCurrent: {},
            addVisible: false,
            cardLoading: false,
            btnLoading: false,
            currentSort: 'desc'
        }
    }
    componentDidMount(){
        this.getContent()
        const titleList = [{
            key: this.props.match.path,
            title: '内容源管理'
        }]
        this.props.changeBreadList(titleList)
    }

    /**
     *获取内容源库列表
     */
    getContent = async () =>{
        const userId = getStorageUserId()
        if (!userId) {
            this.props.history.push('/login')
            return
        }
        let data = {
            userId: userId
          }
        const res = await CONTENTAPI.getContentStore(data)
        const resData = handleAxios.handleRes(res)
        if (resData) {
            if(resData.length === 0) {
                message.info('暂无数据 您可以点击新建！')
            }
            this.setState({
                contentStoreList: resData,
                cardLoading: false
            })
        } else {
            this.setState({ cardLoading: false })
        }
    }

    /**
     * 删除词典
     */
    handleDeleteContent = async (id)=>{
        const userId = getStorageUserId()
        if (!userId) {
            this.props.history.push('/login')
            return
        }
        let data = {
            userId: userId,
            contentTypeId: id
          }
          const res = await CONTENTAPI.deleteContentStore(data)
          handleAxios.handleRes(res)
          // 删除后更新列表
          this.getContent()
    }

    /**
     * 查看词条
     */
    viewContent = (item) => {
        if (this.state.editActive === '') {
            const viewRouter = "/content-info/" + item.id + '/' + item.name
            this.props.history.push(viewRouter)
        }
    }

    /**
     * 修改名称
     */
    handleEditContent = (item, index)=>{
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
    handleSaveContent = async () => {
        const list = [...this.state.contentStoreList]
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
            contentTypeId: editCard.id,
            version: editCard.version
        }
        const res = await CONTENTAPI.updateContentStore(data)
        handleAxios.handleRes(res)
        editCard.name = currentInput
        list.splice(index, 1, { ...item, ...editCard })
        this.setState({
            editActive: '',
            contentStoreList: list
        })
    }

    /**
     * 新建词典
     */
    showAddModal = () => {
        this.setState({
            title: '新建内容源',
            addVisible: true,
        })
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
        }
        const res = await CONTENTAPI.addContentStore(data)
        handleAxios.handleRes(res)
        this.setState({
            btnLoading: false,
            addVisible: false
        })
        // 更新列表
        this.getContent()
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
            const searchName = value.replace(/\s+/g, '')
            let data = {
                userId: userId,
                name: searchName
            }
            const res = await CONTENTAPI.searchContentStore(data)
            const resData = handleAxios.handleRes(res)
            if (resData) {
                if(resData.length === 0) {
                    message.info('暂无数据 您可以点击新建！')
                }
                this.setState({
                    contentStoreList: resData,
                    cardLoading: false
                })
            } else {
                this.setState({ cardLoading: false })
            }
        } else {
            this.getContent()
        }
    }

    /**
     * 排序
     */
    filterList = e => {
        const sort = e.key
        let list = this.state.contentStoreList
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
            contentStoreList: list
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
            <div className="content-store">
                {/* 页头 */}
                <PageHeader
                ghost={false}
                title="内容源"
                subTitle="内容源库"
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
                    <Button key="add" type="primary" onClick={this.showAddModal}>添加内容源</Button>,
                ]}
                ></PageHeader>
                <Spin spinning={cardLoading}>
                    <Row>
                        {/* 卡片列表 */}
                        {this.state.contentStoreList.map((item, index)=>{
                            return <Col span={4} key={item.id}>
                                <QueueAnim type="right">
                                    <Card
                                        key={item.id}
                                        hoverable="true"
                                        style={{ margin: "10px" }}
                                        actions={[
                                            <Tooltip placement="bottom" title={editActive === index ?'提交修改':'修改名称'}>
                                                {editActive === index ?(
                                                    <CheckOutlined key="edit" onClick={this.handleSaveContent} />
                                                ) : (<EditOutlined key="edit" onClick={() =>{this.handleEditContent(item, index)}} />)
                                                }
                                            </Tooltip>,
                                            <Popconfirm title="确定删除吗？" onConfirm={() =>{this.handleDeleteContent(item.id)}}>
                                                <Tooltip placement="bottom" title="删除"><DeleteOutlined key="delete" /></Tooltip>
                                            </Popconfirm>,
                                            ]}>
                                            <Card.Meta
                                            onClick={() => {this.viewContent(item)}}
                                            avatar={<Avatar src={ContentAvatar} />}
                                            title={
                                                editActive === index ?(
                                                    <Input ref={this.inputRef} defaultValue={editName} onPressEnter={this.handleSaveContent} />
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
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(Content)