/**
 * chat-config-skill
 */

import React from 'react'
import { Form, Select, Tag, Spin, message } from 'antd'
import { CheckCircleTwoTone } from '@ant-design/icons'
import APPLICATIONAPI from '../../api/applicationApi'
import SKILLAPI from '../../api/skillApi'
import { handleAxios, getStorageUserId } from '../../utils/commons'

export default class Chat extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            skillConfig: [],
            skillList: [],
            selectValue: '',
            skillLoading: false,
        }
    }
    componentDidMount(){
        this.getAppSkill()
    }

    /**
     * 获取已有技能配置
     */
    getAppSkill = async () =>{
        this.setState({skillLoading: true})
        const userId = getStorageUserId()
        if (!userId) {
            this.props.history.push('/login')
            return
        }
        let data = {
            userId: userId,
            applicationId: this.props.appId
        }
        const res = await APPLICATIONAPI.getApplicationSkill(data)
        const resData = handleAxios.handleRes(res)
        if (resData) {
            if(resData.length === 0) {
                message.info('暂无技能配置 您可以点击新建！')
            }
            this.setState({
                skillConfig: resData,
                skillLoading: false
            })
        }
    }
    
    /**
     * 获取技能列表
     */
    selectSkill = async () => {
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
                message.info('暂无技能配置 您可以点击新建！')
            }
            this.setState({
                skillList: resData
            })
        }
    }
    
    /**
     * 新增选择技能
     */
    changeSubmitAdd = async () => {
        if (this.state.selectValue) {
            const userId = getStorageUserId()
            if (!userId) {
                this.props.history.push('/login')
                return
            }
            let data = {
                userId: userId,
                applicationId: this.props.appId,
                skillId: this.state.selectValue
            }
            const res = await APPLICATIONAPI.addApplicationSkill(data)
            handleAxios.handleRes(res)
            this.setState({
                selectValue: ''
            }, () => {
                this.getAppSkill()
            })
            

        } else {
            message.warning('请选择 需新增的技能！')
        }
    }

    /**
     * 删除技能
     */
    removeSelect = async (id) => {
        const userId = getStorageUserId()
        if (!userId) {
            this.props.history.push('/login')
            return
        }
        let data = {
            userId: userId,
            applicationId: this.props.appId,
            skillId: id
        }
        const res = await APPLICATIONAPI.deleteApplicationSkill(data)
        handleAxios.handleRes(res)
    }

    /**
     * 选择技能赋值
     */
    selectChange = value => {
        this.setState({ selectValue: value})
    }
    
    render() {
        const options = this.state.skillList.map(skill => 
            <Select.Option key={skill.id}>{skill.name}</Select.Option>
        )
        const {skillConfig,skillLoading} = this.state
        return (
            <div className="app-skill">
                <Form name="dynamic_form_item">
                    <Form.Item label="配置技能">
                        <Spin spinning={skillLoading}>
                            {skillConfig.map((item)=>{
                                return <Tag
                                    key={item.id}
                                    color="processing"
                                    closable
                                    onClose={() => this.removeSelect(item.id)}
                                    className="skill-tag"
                                    >{item.name}
                                </Tag>
                            })}
                        </Spin>
                    </Form.Item>
                    <Form.Item label="新增技能">
                        <Select
                            showSearch
                            value={this.state.selectValue}
                            placeholder="选择技能"
                            defaultActiveFirstOption={false}
                            optionFilterProp="children"
                            onSelect={this.selectChange}
                            onFocus={this.selectSkill}
                            notFoundContent={'请先配置技能'}
                            style={{ width: '80%' }}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }>
                            {options}
                        </Select>
                        <CheckCircleTwoTone
                            twoToneColor="#52c41a"
                            className="dynamic-delete-button"
                            style={{ margin: '0 8px' }}
                            onClick={this.changeSubmitAdd}
                        />点击添加
                    </Form.Item>
                </Form>
            </div>
        )
    }
}