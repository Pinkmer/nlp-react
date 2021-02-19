/**
 * skill-task
 */

import React, { useContext, useState, useEffect, useRef } from 'react'
import { PageHeader, Button, Table, Switch, Popconfirm, message, Form, Input } from 'antd'
import AddTaskModel from '../../../components/skill/addModel'
import SKILLAPI from '../../../api/skillApi'
import QueueAnim from 'rc-queue-anim'
import { handleAxios, getStorageUserId, setStorage} from '../../../utils/commons'
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


class SkillList extends React.Component {

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
            title: '任务列表',
            key: 'name',
            dataIndex: 'name',
            render: (name, record) => {
              return (<Button type="link" onClick={() => this.viewTask(record)}>{name}</Button>)
            },
            editable: true,
          },
          {
            title: '意图',
            key: 'intention',
            dataIndex: 'intention',
            width: '25%',
          },
          {
            title: '对话开关',
            key: 'start',
            dataIndex: 'start',
            render: (start, record) => {
              return (
              <Switch checkedChildren="开" unCheckedChildren="关" checked={start} onChange={() => this.changeStartSwitch(start, record)} />
              )
            }
          },
          {
            title: '操作',
            key: 'operation',
            render: (record) =>
            this.state.taskList.length >= 1 ? (
                <Popconfirm title="确定删除吗？" onConfirm={() => this.deleteTask(record.id)}>
                    <Button>Delete</Button>
                </Popconfirm>
            ) : null,
            width: '15%'
          }
        ]
        this.state = {
            taskList: [], //列表数据
            addIntention: '', //新增输入意图
            addVisible: false, //新增窗口
            tableLoading: false,
        }
    }

    componentDidMount(){
        this.getTaskList()
        // 面包屑设置
        let hasBread = this.props.breadList
        hasBread.splice(1)
        const currentBread = {
          key: this.props.match.url,
          title: this.props.match.params.skillName
        }
        hasBread.push(currentBread)
        this.props.changeBreadList(hasBread)
    }

    /**
     * 获取列表数据
     */
    getTaskList = async () =>{
      this.setState({ tableLoading: true })
      const userId = getStorageUserId()
      if (!userId) {
          this.props.history.push('/login')
          return
      }
        let data = {
          userId: userId,
          skillId: this.props.match.params.skillId
        }
        const res = await SKILLAPI.getSkillTask(data)
        const resData = handleAxios.handleRes(res)
        if (resData) {
          if(resData.length === 0) {
              message.info('暂无数据 您可以点击新建！')
          }
          this.setState({
            taskList: resData,
            tableLoading: false
          })
      } else {
          this.setState({ tableLoading: false })
      }
    }

    /**
     * 删除单条task
     */
    deleteTask = async (id) => {
      const userId = getStorageUserId()
      if (!userId) {
          this.props.history.push('/login')
          return
      }
      let data = {
        userId: userId,
        taskId: id
      }
      const res = await SKILLAPI.deleteSkillTask(data)
      handleAxios.handleRes(res)
      this.getTaskList()
    }

    /**
     * 点击跳转查看详情
     */
    viewTask = (record)=>{
      setStorage('taskConfigType', 'edit')
      setStorage('taskConfigId', record.id)
      setStorage('taskConfigName', record.name)
      this.props.history.push({
        pathname:'/task-config/' + this.props.match.params.skillId
      })
    }
    
    /**
     * 点击新建显示弹窗
     */
    showAddModal = () => {
        this.setState({ addVisible: true })
    }

    /**
     * 弹窗提交新建
     */
    handleSubmit = values => {
      setStorage('taskConfigType', 'add')
      setStorage('taskConfigName', values.name)
      setStorage('taskConfigIntention', values.intention)
      this.props.history.push({
        pathname:'/task-config/' + this.props.match.params.skillId
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
      const list = [...this.state.taskList]
      const index = list.findIndex(item => row.id === item.id)
      const item = list[index]
      const userId = getStorageUserId()
      if (!userId) {
          this.props.history.push('/login')
          return
      }
      let data = {
          userId: userId,
          name: row.name,
          taskId: row.id,
          intention: row.intention,
          start: row.start,
          version: row.version
      }
      const res = await SKILLAPI.updateSkillTaskName(data)
      handleAxios.handleRes(res)
      list.splice(index, 1, { ...item, ...row })
      this.setState({
        taskList: list,
      })
    }

    /**
     * 行内改变对话开关
     */
    changeStartSwitch = async (start, record) => {
      const list = [...this.state.taskList]
      const index = list.findIndex(item => record.id === item.id)
      const item = list[index]
      record.start = !start
      const userId = getStorageUserId()
      if (!userId) {
          this.props.history.push('/login')
          return
      }
      let data = {
          userId: userId,
          name: record.name,
          taskId: record.id,
          intention: record.intention,
          start: !start,
          version: record.version
      }
      const res = await SKILLAPI.updateSkillTaskName(data)
      handleAxios.handleRes(res)
      list.splice(index, 1, { ...item, ...record })
      this.setState({
        taskList: list,
      })
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
              skillId: this.props.match.params.skillId,
              name: searchName
          }
          const res = await SKILLAPI.searchSkillTask(data)
          const resData = handleAxios.handleRes(res)
          if (resData) {
              if(resData.length === 0) {
                  message.info('暂无数据 您可以点击新建！')
              }
              this.setState({
                  taskList: resData,
                  cardLoading: false
              })
          } else {
              this.setState({ cardLoading: false })
          }
      } else {
          this.getTaskList()
      }
  }


    render() {
        const {
          taskList,
          addVisible,
          tableLoading
        } = this.state
        const components = {
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
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
            }),
          }
       })
        return (
            <div className="skill-list">
              {/* 页头 */}
                <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title= "任务列表"
                subTitle={ this.props.match.params.skillName}
                extra={[
                  <Input.Search
                    key="search"
                    allowClear
                    placeholder="输入搜索内容"
                    onSearch={value => this.searchList(value)}
                    className="search_style"
                  />,
                  <Button key="add" type="primary" onClick={this.showAddModal}>新建任务</Button>,
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
                    dataSource={taskList}
                    columns={columns}
                    pagination={false}>
                  </Table>
                </QueueAnim>

                {/* 弹窗 */}
                <AddTaskModel addVisible={addVisible} handleSubmit={this.handleSubmit} handleCancle={this.handleCancle} />
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

export default connect(mapStateToProps, mapDispatchToProps)(SkillList)