/**
 * skill
 */

import React from 'react'
import { Row, Col, Card, Avatar,PageHeader, Button, Input, Popconfirm, Tooltip, message, Spin, Menu, Dropdown } from 'antd'
import { EditOutlined, DeleteOutlined, CopyOutlined, CheckOutlined, FilterTwoTone } from '@ant-design/icons'
import Add from '../../../components/public/addModel'
import SKILLAPI from '../../../api/skillApi'
import QueueAnim from 'rc-queue-anim'
import SkillAvatar from '../../../assets/技能.png'
import { handleAxios, getStorageUserId } from '../../../utils/commons'
import { connect } from 'react-redux'

class Skill extends React.Component {
    formRef = React.createRef()
    inputRef = React.createRef()

    constructor(props){
        super(props);
        this.state = {
            title: '',
            skillStoreList: [],
            currentCopy: '',
            editActive: '',
            editName: '',
            editCurrent: {},
            addVisible: false,
            cardLoading: true,
            btnLoading: false,
            currentSort: 'desc'
        }
    }

    componentDidMount() {
        this.getSkill()
        // 面包屑设置
        const titleList = [{
            key: this.props.match.path,
            title: '技能管理'
        }]
        this.props.changeBreadList(titleList)
    }

    /**
     * 获取技能库列表
     */
    getSkill = async () =>{
        this.setState({ cardLoading: true })
        const userId = getStorageUserId()
        if (!userId) {
            this.props.history.push('/login')
            return
        }
        let data = {
            userId: userId
        }
        const res = await SKILLAPI.getSkillStore(data)
        const resData = handleAxios.handleRes(res)
        if (resData) {
            if(resData.length === 0) {
                message.info('暂无数据 您可以点击新建！')
            }
            this.setState({
                skillStoreList: resData,
                cardLoading: false
            })
        } else {
            this.setState({ cardLoading: false })
        }
    }

    /**
     * 查看技能
     */
    viewSkill = (item) => {
        if (this.state.editActive === '') {
            this.props.history.push({pathname: "/task/" + item.id + '/' + item.name})
        }
    }

    /**
     * 技能删除
     */
    handleDeleteSkill = async (id)=>{
        const userId = getStorageUserId()
        if (!userId) {
            this.props.history.push('/login')
            return
        }
        let data = {
            userId: userId,
            skillId: id
          }
          const res = await SKILLAPI.deleteSkillStore(data)
          handleAxios.handleRes(res)
          // 删除后更新列表
          this.getSkill()
    }

    /**
     * 技能修改名称
     */
    handleEditSkill = (item, index)=>{
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
    handleSaveSkill = async () => {
        const list = [...this.state.skillStoreList]
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
            skillId: editCard.id,
            version: editCard.version
        }
        const res = await SKILLAPI.renameSkillStore(data)
        handleAxios.handleRes(res)
        editCard.name = currentInput
        list.splice(index, 1, { ...item, ...editCard })
        this.setState({
            editActive: '',
            skillStoreList: list
        })
    }

    /**
     * 技能复制
     */
    handleCopySkill = (id)=>{
        this.setState({ 
            addVisible: true,
            title: '复制技能库',
            currentCopy: id
        })
    }

    /**
     * 技能新建
     */
    showAddModal = () => {
        this.setState({
            addVisible: true,
            title: '新建技能库',
        })
    }

    /**
     * 取消新建/复制
     */
    handleCancle = () => {
        this.setState({ addVisible: false })
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
        if (this.state.title === '新建技能库') {
            let data = {
                userId: userId,
                name: value.name,
                description: '新增Skill',
            }
            const res = await SKILLAPI.addSkillStore(data)
            handleAxios.handleRes(res)
            this.setState({
                btnLoading: false,
                addVisible: false,
            })
            // 更新列表
            this.getSkill()
        } else {
            let data = {
                userId: userId,
                name: value.name,
                skillId: this.state.currentCopy,
                description: '复制Skill',
            }
            const res = await SKILLAPI.copySkillStore(data)
            handleAxios.handleRes(res)
            this.setState({
                btnLoading: false,
                addVisible: false,
                currentCopy: ''
            })
            // 更新列表
            this.getSkill()
        }
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
            const res = await SKILLAPI.searchSkillStore(data)
            const resData = handleAxios.handleRes(res)
            if (resData) {
                if(resData.length === 0) {
                    message.info('暂无数据 您可以点击新建！')
                }
                this.setState({
                    skillStoreList: resData,
                    cardLoading: false
                })
            } else {
                this.setState({ cardLoading: false })
            }
        } else {
            this.getSkill()
        }
    }

    /**
     * 排序
     */
    filterList = e => {
        const sort = e.key
        let list = this.state.skillStoreList
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
            skillStoreList: list
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
            <div className="skill-store">
                {/* 页头 */}
                <PageHeader
                key="header"
                ghost={false}
                title="技能库"
                subTitle="技能库展示"
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
                    <Button key="add" type="primary" onClick={this.showAddModal}>新建技能库</Button>
                ]}
                ></PageHeader>
                <Spin spinning={cardLoading}>
                    <Row>
                        {/* 卡片列表 */}
                        {this.state.skillStoreList.map((item, index)=>{
                            return <Col span={4} key={item.id}>
                                <QueueAnim type="right">
                                    <Card
                                        key={item.id}
                                        hoverable="true"
                                        style={{ margin: "10px" }}
                                        actions={[
                                            <Tooltip placement="bottom" title="复制"><CopyOutlined key="copy" onClick={() =>{this.handleCopySkill(item.id)}} /></Tooltip>,
                                            <Tooltip placement="bottom" title={editActive === index ?'提交修改':'修改名称'}>
                                                {editActive === index ?(
                                                    <CheckOutlined key="edit" onClick={this.handleSaveSkill} />
                                                ) : (<EditOutlined key="edit" onClick={() =>{this.handleEditSkill(item, index)}} />)
                                                }
                                            </Tooltip>,
                                            <Popconfirm title="确定删除吗？" onConfirm={() =>{this.handleDeleteSkill(item.id)}}>
                                                <Tooltip placement="bottom" title="删除"><DeleteOutlined key="delete" /></Tooltip>
                                            </Popconfirm>,
                                        ]}>
                                            <Card.Meta
                                            onClick={() =>{this.viewSkill(item)}}
                                            avatar={<Avatar src={SkillAvatar} />}
                                            title={
                                                editActive === index ?(
                                                    <Input ref={this.inputRef} defaultValue={editName} onPressEnter={this.handleSaveSkill} />
                                                ):item.name}
                                            description={item.id}
                                            />
                                    </Card>
                                </QueueAnim>
                            </Col>
                        })}
                    </Row>
                </Spin>
                
                {/* 新建/复制-弹窗 */}
                <Add title={title} addVisible={addVisible} btnLoading={btnLoading} submitAdd={this.submitAdd} handleCancle={this.handleCancle} />,
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


export default connect(mapStateToProps, mapDispatchToProps)(Skill)