/**
 * task-config-下一轮对话
 */

import React from 'react'
import { Divider, Form, InputNumber, Button, Select, Switch, Space, Tooltip, message  } from 'antd'
import { MinusCircleOutlined, PlusOutlined, BulbTwoTone } from '@ant-design/icons'
import SKILLAPI from '../../api/skillApi'
import { handleAxios, getStorageUserId } from '../../utils/commons'

export default class GotoConfig extends React.Component{
    gototRef = React.createRef()

    constructor(props){
        super(props);
        this.state = {
            gotoConfig: [],
            gotoEnd: false,
            skillList: [],
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.config !== nextProps.config){
            const config = JSON.stringify(nextProps.config)
            const propsConfig = JSON.parse(config)
            if (config === '{}') {
                this.setState({
                    gotoConfig: [],
                    gotoEnd: false
                })
            } else { 
                this.setState({
                    gotoConfig: propsConfig.additional.gotos,
                    gotoEnd: propsConfig.additional.end,
                }, () => {
                    this.onInitDate()
                })
            }
        }
    }

    /**
     * 编辑状态下初始化数据
     */
    onInitDate = async() => {
        const currentGoto =  this.state.gotoConfig
        const newGoto = [...this.state.gotoConfig]
        if (currentGoto.length > 0) {
            for (let go in currentGoto) {
                const userId = getStorageUserId()
                if (!userId) {
                    this.props.history.push('/login')
                    return
                }
                let data = {
                    userId: userId,
                    taskId: currentGoto[go].goToId
                }
                const res = await SKILLAPI.searchSkillTaskById(data)
                const resData = handleAxios.handleRes(res)
                newGoto[go].goToName = resData.name + resData.id
            } 
        }
        this.gototRef.current.setFieldsValue({
            gotos: newGoto,
            gotoEnd: this.state.gotoEnd
        })
    }

    /**
     * 改变是否结束
     */
    onChangeIsEnd = value => {
        if (value) {
            this.setState({
                gotoEnd: value
            }, () => {
                this.gototRef.current.setFieldsValue({
                    gotos: [],
                    gotoEnd: this.state.gotoEnd
                })
            })
        } else {
            this.setState({
                gotoEnd: value
            }, () => {
                this.gototRef.current.setFieldsValue({
                    gotoEnd: this.state.gotoEnd
                })
            })
        }
        
    }


    /**
     * 搜索下轮技能
     */
    selectSearchSkill = async value => {
        if (value) {
            const userId = getStorageUserId()
            if (!userId) {
                this.props.history.push('/login')
                return
            }
            let data = {
                userId: userId,
                name: value
            }
            const res = await SKILLAPI.searchSkillTask(data)
            const resData = handleAxios.handleRes(res)
            if (resData.length > 0) {
                const newSkill = [...resData]
                for (let skill in resData) {
                    newSkill[skill].newName =  newSkill[skill].name + newSkill[skill].id
                }
                this.setState({
                    skillList: [...newSkill]
                })
            }
        }
        
    }

    /**
     * 选择下轮技能
     */
    selectChangeSkill = value => {
        const gotoArr = this.gototRef.current.getFieldValue()
        const indexId = gotoArr.gotos.filter(item => {
            return item.goToId === value
        })
        console.log(gotoArr)
        if(indexId.length > 0) {
            message.warning('请勿添加已有对话')
        } else {
            const goToValue = gotoArr.gotos.find(item => {
                return item.goToName === value
            })
            const newGoto = this.state.skillList.find(item => {
                return item.id === goToValue.goToName
            })
            const addGoto = {
                goToId: newGoto.id,
                goToName: newGoto.newName,
                lifecycle: 3,
                default: true
            }
            const newGotoArr = [...gotoArr.gotos]
            for (let i in newGotoArr) {
                if(newGotoArr[i].goToName === value ) {
                    newGotoArr[i] = addGoto
                }
            }
            this.gototRef.current.setFieldsValue({
                gotos: [...newGotoArr]
            })
        }
    }


    /**
     * 获取处理此表单数据数据
     */
    getGotoValidate = async () => {
        try {
            const goto = await this.gototRef.current.validateFields()
            if (goto.gotos === undefined || goto.gotoEnd === undefined) {
                return {gotos: [],gotoEnd: false}
            } else {
                return goto
            }
        } catch {
            message.warning('下一轮对话不为空')
            throw new Error()
        }
    }


    render() {
        const {gotoEnd} = this.state
        const initialValue = {
            gotoEnd: false
        }
        const options = this.state.skillList.map(item => 
            <Select.Option key={item.id} value={item.id} >{item.newName}</Select.Option>
        )
        return (
            <div id={"anchor-goto"}>
                <Divider orientation="left" plain>
                    <Tooltip placement="right" title="完成该意图后，下一轮对话可能执行的意图" >
                        <BulbTwoTone /><span style={{color: "#1890ff"}}> 下一轮对话</span>
                    </Tooltip>    
                </Divider>
                
                <Form
                ref={this.gototRef}
                initialValues={initialValue}>
                    <Form.Item label="是否结束对话" name="gotoEnd" valuePropName='checked' >
                        <Switch checkedChildren="结束" unCheckedChildren="继续" onChange={this.onChangeIsEnd} />
                    </Form.Item>
                    {!gotoEnd ? (
                        <Form.Item label="下轮对话配置">
                            <Form.List name="gotos">
                            {(gotoList, { add, remove }) => {
                            return (
                                <div>
                                {gotoList.map(goto => (
                                    <Space key={goto.key} align="baseline">
                                        <Form.Item
                                            {...goto}
                                            name={[goto.name, 'goToName']}
                                            fieldKey={[goto.fieldKey, 'goToName']}
                                            label="任务"
                                            style={{width: "450px"}}
                                            rules={[
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: "输入任务 或删除此输入框",
                                            }]}>
                                            <Select
                                                showSearch
                                                allowClear
                                                value={this.state.selectValue}
                                                placeholder="输入搜索技能"
                                                defaultActiveFirstOption={false}
                                                optionFilterProp="children"
                                                onSearch={this.selectSearchSkill}
                                                onChange={this.selectChangeSkill}
                                                notFoundContent={'请先配置技能'}>
                                                {options}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            {...goto}
                                            name={[goto.name, 'lifecycle']}
                                            fieldKey={[goto.fieldKey, 'lifecycle']}
                                            label="生命周期"
                                            rules={[
                                            {
                                                required: true,
                                                message: "输入生命周期",
                                            }]}>
                                            <InputNumber min={1} max={10000} />
                                        </Form.Item>
                                        <Form.Item
                                            {...goto}
                                            name={[goto.name, 'default']}
                                            fieldKey={[goto.fieldKey, 'default']}
                                            label="默认发出"
                                            valuePropName='checked' >
                                            <Switch defaultChecked />
                                        </Form.Item>
                                        <MinusCircleOutlined
                                            onClick={() => {
                                            remove(goto.name)
                                            }}
                                        />
                                    </Space>
                                    ))}
                                    <Form.Item>
                                        <Button
                                        type="dashed"
                                        onClick={() => {
                                            add()
                                        }}
                                        block
                                        style={{ width: '60%' }}
                                        >
                                        <PlusOutlined /> Add Goto
                                        </Button>
                                    </Form.Item>
                                    </div>
                                )
                            }}
                            </Form.List>
                        </Form.Item>
                    ) : null}
                </Form>
            </div>
        )
    }
}