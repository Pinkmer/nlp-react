/**
 * content-list
 */

import React, { useContext, useState, useEffect, useRef } from 'react'
import { PageHeader, Button, Table, message, Popconfirm, Form, Input } from 'antd'
import Add from '../../../components/public/addModel'
import CONTENTAPI from '../../../api/contentApi'
import QueueAnim from 'rc-queue-anim'
import { handleAxios, getStorageUserId, setStorage } from '../../../utils/commons'
import { connect } from 'react-redux'

const EditableContext = React.createContext()

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}
const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false)
    const inputRef = useRef()
    const form = useContext(EditableContext)
    useEffect(() => {
      if (editing) {
        inputRef.current.focus()
      }
    }, [editing])
  
    const toggleEdit = () => {
      setEditing(!editing)
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      })
    }
  
    const save = async e => {
      try {
        const values = await form.validateFields()
        toggleEdit()
        handleSave({ ...record, ...values })
      } catch (errInfo) {
          message.warning('修改失败', errInfo)
      }
    }
  
    let childNode = children
  
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} 必须填`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onDoubleClick={toggleEdit}
        >
          {children}
        </div>
      )
    }
  
    return <td {...restProps}>{childNode}</td>
  }

class ContentList extends React.Component {
    constructor(props){
        super(props)
        this.columns = [
          {
            title: 'ID',
            key: 'id',
            dataIndex: 'id',
            width: '15%'
          },
          {
            title: '内容源',
            key: 'name',
            dataIndex: 'name',
            render: (name, record) => {
              return (
              <Button type="link" onClick={() => this.viewContent(record)}>{name}</Button>
              )
            },
            editable: true
          },
          {
            title: '操作',
            key: 'operator',
            render: (record) =>
            this.state.contentList.length >= 1 ? (
                <Popconfirm title="确定删除吗？" onConfirm={() => this.deleteContentInfo(record.id)}>
                    <Button>Delete</Button>
                </Popconfirm>
            ) : null,
            width: '15%'
          },
        ]
        this.state = {
            title: '',
            contentList: [],
            editModel: false,
            addVisible: false,
            cardLoading: false,
            btnLoading: false,
        }
    }

    componentDidMount(){
        this.getContentInfo()
        // 面包屑设置
        let hasBread = this.props.breadList
        hasBread.splice(1)
        const currentBread = {
          key: this.props.match.url,
          title: this.props.match.params.contentName
        }
        hasBread.push(currentBread)
        this.props.changeBreadList(hasBread)
    }
    
    /**
     * 获取列表数据
     */
    getContentInfo = async () =>{
        this.setState({ tableLoading: true })
        const userId = getStorageUserId()
        if (!userId) {
            this.props.history.push('/login')
            return
        }
        let data = {
            userId: userId,
            contentTypeId: this.props.match.params.contentId
          }
        const res = await CONTENTAPI.getContentInfo(data)
        const resData = handleAxios.handleRes(res)
        if (resData) {
            if(resData.length === 0) {
                message.info('暂无数据 您可以点击新建！')
            }
            this.setState({
              contentList: resData,
              tableLoading: false
            })
        } else {
            this.setState({ tableLoading: false })
        }
    }


    /**
     * 删除内容源
     */
    deleteContentInfo = async (id) => {
      const userId = getStorageUserId()
      if (!userId) {
          this.props.history.push('/login')
          return
      }
        let data = {
            userId: userId,
            contentId: id
          }
          const res = await CONTENTAPI.deleteContentInfo(data)
          handleAxios.handleRes(res)
          // 删除后更新列表
          this.getContentInfo()
    }

    /**
     * 点击跳转查看详情
     */
    viewContent = (record)=>{
      setStorage('contentConfigType', 'edit')
      setStorage('contentConfigId', record.id)
      setStorage('contentConfigName', record.name)
        this.props.history.push({
          pathname:'/content-config/' + this.props.match.params.contentId
        })
      }
    
    /**
     * 新建内容源
     */
    showAddModal = () => {
        this.setState({
            title: '内容源名称',
            addVisible: true,
        })
    }


    /**
     * 提交新建
     */
    submitAdd = values => {
      setStorage('contentConfigType', 'add')
      setStorage('contentConfigName', values.name)
        this.props.history.push({
          pathname:'/content-config/' + this.props.match.params.contentId
        })
    }

    /**
     * 弹窗取消
     */
    handleCancle = () => {
        this.setState({ addVisible: false })
    }

    /**
     * 行内编辑
     */
    handleSave = async row => {
      const userId = getStorageUserId()
      if (!userId) {
          this.props.history.push('/login')
          return
      }
      let data = {
          userId: userId,
          name: row.name,
          contentId: row.id,
          version: row.version
      }
      const res = await CONTENTAPI.updateContentConfigName(data)
      handleAxios.handleRes(res)
      const newData = [...this.state.contentList]
      const index = newData.findIndex(item => row.id === item.id)
      const item = newData[index]
      newData.splice(index, 1, { ...item, ...row })
      this.setState({
        contentList: newData,
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
            contentTypeId: this.props.match.params.contentId,
            name: searchName
          }
        const res = await CONTENTAPI.searchContentInfo(data)
        const resData = handleAxios.handleRes(res)
        if (resData) {
            if(resData.length === 0) {
                message.info('暂无数据 您可以点击新建！')
            }
            this.setState({
              contentList: resData,
              tableLoading: false
            })
        } else {
            this.setState({ tableLoading: false })
        }
      } else {
          this.getContentInfo()
      }
  }

    render() {
        const {
          title,
          addVisible,
          btnLoading,
          contentList,
          tableLoading
        } = this.state
        const components = {
          body: {
            row: EditableRow,
            cell: EditableCell,
          }
        }
        const columns = this.columns.map(col => {
          if (!col.editable) {
            return col
          }
    
          return {
            ...col,
            onCell: record => ({
              record,
              editable: col.editable,
              dataIndex: col.dataIndex,
              title: col.title,
              handleSave: this.handleSave,
            })
          }
       })
        return (
            <div className="content-list">
              {/* 页头 */}
                <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title="内容源详情"
                subTitle={this.props.match.params.contentName}
                extra={[
                    <Input.Search
                        key="search"
                        allowClear
                        placeholder="输入搜索内容"
                        onSearch={value => this.searchList(value)}
                        className="search_style"
                    />,
                    <Button key="add" type="primary" onClick={this.showAddModal}>添加内容源</Button>
                ]}
                ></PageHeader>
                {/* 列表 */}
                <QueueAnim type="right">
                  <Table
                    key={record => record.id}
                    rowKey={record => record.id}
                    components={components}
                    rowClassName={() => 'editable-row'}
                    size="small"
                    loading={tableLoading}
                    pagination={false}
                    dataSource={contentList}
                    columns={columns}>
                  </Table>
                </QueueAnim>

                {/* 新建-弹窗 */}
                <Add title={title} addVisible={addVisible} btnLoading={btnLoading} submitAdd={this.submitAdd} handleCancle={this.handleCancle} />
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

export default connect(mapStateToProps, mapDispatchToProps)(ContentList)