/**
 * userDict-list
 */

import React from 'react'
import { PageHeader, Button, Table, Space, message, Popconfirm, Input } from 'antd'
import AddModel from '../../../components/dictionary/addModel'
import EditModel from '../../../components/dictionary/editModel'
import Upload from '../../../components/public/uploadModel'
import USERDICTAPI from '../../../api/userDictApi'
import { handleAxios, getStorageUserId } from '../../../utils/commons'
import {baseUrl} from '../../../config/config'
import { connect } from 'react-redux'

class UserDictList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userDictList: [],
            editDict: {},
            version: 0,
            pageNum: 1,
            pageSize: 10,
            total: 0,
            addVisible: false,
            editVisible: false,
            uploadVisible: false,
            btnLoading: false,
            tableLoading: false,
            uploading: false,
        }
    }
    componentDidMount(){
        this.getDictRule()
        // 面包屑设置
        let hasBread = this.props.breadList
        hasBread.splice(1)
        const currentBread = {
          key: this.props.match.url,
          title: this.props.match.params.userDictName
        }
        hasBread.push(currentBread)
        this.props.changeBreadList(hasBread)
    }
    
    /**
     * 获取词条列表
     */
    getDictRule = async () =>{
        this.setState({ tableLoading: true })
        const userId = getStorageUserId()
        if (!userId) {
            this.props.history.push('/login')
            return
        }
        let data = {
            userId: userId,
            dictionaryTypeId: this.props.match.params.userDictId,
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize,
          }
        const res = await USERDICTAPI.getDictRule(data)
        const resData = handleAxios.handleRes(res)
        if (resData) {
            if(resData.page.length > 0) {
                let list = resData.page
                list.forEach((item) => {
                    item.synonym = item.synonym.join(',')
                })
                this.setState({
                    userDictList: list,
                    total: resData.total,
                    tableLoading: false
                })
            } else {
                message.info('暂无数据 您可以点击新建！')
                this.setState({
                    userDictList: [],
                    total: 0,
                    tableLoading: false
                })
            }
        } else {
            this.setState({ tableLoading: false })
        }
    }

    /**
     * 删除词条
     */
    deleteDictRule = async (id) => {
        const userId = getStorageUserId()
        if (!userId) {
            this.props.history.push('/login')
            return
        }
        let data = {
            userId: userId,
            dictionaryId: id,
            dictionaryTypeId: this.props.match.params.userDictId,
          }
          const res = await USERDICTAPI.deleteDictRule(data)
          handleAxios.handleRes(res)
          // 删除后更新列表
          this.getDictRule()
    }

    /**
     * 词条新建
     */
    showAddModal = () => {
        this.setState({ addVisible: true })
    }

    /**
     * 提交新建
     */
    submitAdd = async value => {
        this.setState({ btnLoading: true })
        let addSynonym
        if (value.synonym) {
            addSynonym = value.synonym.split(',')
        } else {
            addSynonym = []
        }
        const userId = getStorageUserId()
        if (!userId) {
            this.props.history.push('/login')
            return
        }
        let data = {
            userId: userId,
            dictionaryTypeId: this.props.match.params.userDictId,
            keyword: value.keyword,
            synonym: addSynonym
        }
        const res = await USERDICTAPI.addDictRule(data)
        handleAxios.handleRes(res)
        this.setState({
            btnLoading: false,
            addVisible: false,
        })
        // 更新列表
        this.getDictRule()
    }

    /**
     * 词条编辑
     */
    showEditModal = async (id) => {
        const userId = getStorageUserId()
        if (!userId) {
            this.props.history.push('/login')
            return
        }
        let data = {
            userId: userId,
            dictionaryId: id,
        }
        const res = await USERDICTAPI.queryDictRule(data)
        const resData = handleAxios.handleRes(res)
        if (resData) {
            resData.synonym.join(',')
            this.setState({
                editDict: resData,
                version: resData.version,
                editVisible: true
            })
        }
    }

    /**
     * 提交编辑
     */
    submitEdit = async value => {
        this.setState({ btnLoading: true })
        let editSynonym
        if (value) {
            editSynonym =value.synonym.split(',')
        } else {
            editSynonym = []
        }
        const userId = getStorageUserId()
        if (!userId) {
            this.props.history.push('/login')
            return
        }
        let data = {
            userId: userId,
            dictionaryId: this.state.editDict.id,
            dictionaryTypeId: this.props.match.params.userDictId,
            keyword: value.keyword,
            synonym: editSynonym,
            version: this.state.version
        }
        const res = await USERDICTAPI.updateDictRule(data)
        handleAxios.handleRes(res)
        this.setState({
            btnLoading: false,
            editVisible: false,
            editDict: {},
            version: ''
        })
        // 更新列表
        this.getDictRule()
    }

    /**
     * 词条上传
     */
    showUploadModal = () => {
        this.setState({
            title: '上传词条',
            uploadVisible: true,
        })
    }

    /**
     * 提交上传
     */
    submitUpload = async value => {
        this.setState({uploading: true})
        const fileList = value
        const formData = new FormData()
        fileList.forEach(file => {
          formData.append('file', file)
          formData.append('userId', 4)
          formData.append('dictionaryTypeId', this.props.match.params.userDictId)
        })
        if (fileList[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            const res = await USERDICTAPI.uploadDictRule(formData)
            handleAxios.handleRes(res)
        } else {
            message.warning('请上传正确格式的文件')
        }
        this.setState({
            uploadVisible: false,
            uploading: false,
        })
        // 更新列表
        this.getDictRule()
    }

    /**
     * 取消新建/编辑/上传
     */
    handleCancle = () => {
        this.setState({
            addVisible: false,
            editVisible: false,
            uploadVisible: false,
        })
    }

    /**
     * 下载
     */
    downloadDict = async () => {
        window.location.href = baseUrl + 'api/v1/dictionary/rule/download?userId=' + 4 + '&typeId=' + this.props.match.params.userDictId
    }

    /**
     * 点击翻页
     */
    onChangePage = (page, pageSize) => {
        this.setState({
            pageNum: page,
            pageSize: pageSize
        }, () => {
            this.getDictRule()
        })
    }

    /**
     * 搜索
     */
    searchList = async value => {
        if (value) {
            this.setState({ tableLoading: true })
            const userId = getStorageUserId()
            if (!userId) {
                this.props.history.push('/login')
                return
            }
            const searchName = value.replace(/\s+/g, '')
            let data = {
                userId: userId,
                dictionaryTypeId: this.props.match.params.userDictId,
                pageNum: this.state.pageNum,
                pageSize: this.state.pageSize,
                keyword: searchName
            }
            const res = await USERDICTAPI.searchDictRule(data)
            const resData = handleAxios.handleRes(res)
            if (resData) {
                if(resData.page.length > 0) {
                    let list = resData.page
                    list.forEach((item) => {
                        item.synonym = item.synonym.join(',')
                    })
                    this.setState({
                        userDictList: list,
                        total: resData.total,
                        tableLoading: false
                    })
                } else {
                    message.info('暂无数据 您可以点击新建！')
                    this.setState({
                        userDictList: [],
                        total: 0,
                        tableLoading: false
                    })
                }
            } else {
                this.setState({ tableLoading: false })
            }
        } else {
            this.getDictRule()
        }
    }

    render() {
        const columns = [
            {
                title: 'ID',
                key: 'id',
                dataIndex: 'id',
            },
            {
                title: '标准词',
                key: 'keyword',
                dataIndex: 'keyword',
                width: '35%'
            },
            {
                title: '同义词（以英文逗号分隔）',
                key: 'synonym',
                dataIndex: 'synonym',
                width: '35%'
            },
            {
                title: '操作',
                key: 'operator',
                dataIndex: 'id',
                render: (id) => {
                    return (<Space size="middle">
                        <Button onClick={() => this.showEditModal(id)}>Edit</Button>
                        <Popconfirm title="确定删除吗？" onConfirm={() => this.deleteDictRule(id)}>
                            <Button>Delete</Button>
                        </Popconfirm>
                    </Space>)
                },
                width: '15%'
            }
        ]
        const {
         title,
         userDictList,
         addVisible,
         editVisible,
         editDict,
         total,
         uploadVisible,
         tableLoading,
         btnLoading,
         uploading
        } = this.state
        return (
            <div className="userDict-list">
                <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title="词条列表"
                subTitle={this.props.match.params.userDictName}
                extra={[
                    <Input.Search
                        key="search"
                        allowClear
                        placeholder="输入搜索内容"
                        onSearch={value => this.searchList(value)}
                        className="search_style"
                    />,
                    <Button key="add" type="primary" onClick={this.showAddModal}>添加词条</Button>,
                    <Button key="upload" type="primary" onClick={this.showUploadModal}>上传词条</Button>,
                    <Button key="download" type="primary" onClick={this.downloadDict}>下载词条</Button>,
                ]}
                ></PageHeader>

                {/* 列表 */}
                <Table
                    rowKey={record => record.id}
                    size="small"
                    loading={tableLoading}
                    dataSource={userDictList}
                    columns={columns}
                    pagination={{
                        total: total,
                        showTotal: total => `共 ${total} 条`,
                        showSizeChanger: false,
                        onChange: this.onChangePage,
                    }}>
                </Table>

                {/* 添加弹窗 */}
                <AddModel
                    addVisible={addVisible}
                    btnLoading={btnLoading}
                    submitAdd={this.submitAdd}
                    handleCancle={this.handleCancle}
                />,

                {/* 编辑弹窗 */}
                <EditModel
                    editVisible={editVisible}
                    editDict={editDict}
                    btnLoading={btnLoading}
                    submitEdit={this.submitEdit}
                    handleCancle={this.handleCancle}
                />,
                
                {/* 上传-弹窗 */}
                <Upload
                    title={title}
                    addVisible={uploadVisible}
                    uploading={uploading}
                    submitUpload={this.submitUpload}
                    handleCancle={this.handleCancle}
                />

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
  
  export default connect(mapStateToProps, mapDispatchToProps)(UserDictList)