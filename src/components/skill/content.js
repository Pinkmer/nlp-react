/**
 * task-config-内容源
 */

import React from 'react'
import { Divider, Form, Tooltip, Select, message } from 'antd'
import { BulbTwoTone } from '@ant-design/icons'
import CONTENTAPI from '../../api/contentApi'
import { handleAxios, getStorageUserId } from '../../utils/commons'

export default class ContentConfig extends React.Component{
    contentRef = React.createRef()

    constructor(props){
        super(props);
        this.state = {
            contentList: [],
            contentConfig: '',
        }
    }
    componentDidMount() {
        this.getContentList()
    }

    
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.config !== nextProps.config){
            const config = JSON.stringify(nextProps.config)
            const propsConfig = JSON.parse(config)
            if (config === '{}') {
                this.setState({
                    contentConfig: ''
                })
            } else { 
                this.setState({
                    contentConfig: propsConfig.content
                }, () => {
                    this.onInitDate()
                })
            }
        }
    }

    /**
     * 编辑状态下初始化数据
     */
    onInitDate = () => {
        const currentContent =  this.state.contentConfig
        this.contentRef.current.setFieldsValue({
            content: currentContent
        })
    }

    /**
     * 获取内容源
     */
    getContentList = async() => {
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
            const noneContent = { id: -1, name: '不使用内容源' }
            resData.push(noneContent)
            this.setState({
                contentList: resData
            })
        }
    }


    /**
     * 获取此表单数据数据
     */
    getContentValidate = async () => {
        try {
            const contentConfig = await this.contentRef.current.validateFields()
            return contentConfig
        } catch {
            message.warning('内容源不为空')
            throw new Error()
        }
    }


    render() {
        const options = this.state.contentList.map(skill => 
            <Select.Option key={skill.id} value={skill.id}>{skill.name}</Select.Option>
        )
        const initialValue = {
            content: -1
        }
        return (
            <div id={"anchor-content"}>
            <Divider orientation="left" plain>
                <Tooltip placement="right" title="查询访问的资源，如用户问“今天天气怎么样”时，需要查询的天气相关信息的数据资源。" >
                    <BulbTwoTone /><span style={{color: "#1890ff"}}> 内容源配置</span>
                </Tooltip>
            </Divider>
            
            <Form
            ref={this.contentRef}
            initialValues={initialValue}>
                <Form.Item
                label="内容源配置"
                style={{width: "60%"}}
                name="content"
                rules={[
                    {required: true,message: '请输入内容源'},
                ]}>
                    <Select
                        showSearch
                        placeholder="选择内容源"
                        defaultActiveFirstOption={false}
                        optionFilterProp="children"
                        notFoundContent={'请先配置内容源'}
                        style={{ width: '80%' }}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }>
                        {options}
                    </Select>
                </Form.Item>
            </Form>
            </div>
        )
    }
}