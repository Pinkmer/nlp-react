/**
 * chat-config-info
 * 信息配置
 */

import React from 'react'
import { Button, Form, Input, Select, InputNumber } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import CONTENTAPI from '../../api/contentApi'
import { handleAxios, getStorageUserId } from '../../utils/commons'

export default class Chat extends React.Component {
    infoformRef = React.createRef()

    constructor(props){
        super(props)
        this.state = {
            contentList: [],
            selectValue: '',
            config: {},
        }
    }

    componentDidMount() {
        this.getContentList()
        
    }
    
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.config !== nextProps.config){
            const config = JSON.stringify(nextProps.config)
            const propsConfig = JSON.parse(config)
            if (propsConfig) {
                this.setState({
                    config: propsConfig
                }, () => {
                    this.onInitDate()
                })
            }
        }
    }

    /**
     * 获取内容源列表
     */
    getContentList = async() => {
        const userId = getStorageUserId()
        if (!userId) {
            this.props.history.push('/login')
            return
        }
        let data = {
            userId: userId,
            applicationId: this.props.appId
        }
        const res = await CONTENTAPI.getContentStore(data)
        const resData = handleAxios.handleRes(res)
        if (resData) {
            if(resData.length > 0) {
                this.setState({
                    contentList: resData,
                })
            }
        }
    }

    /**
     * 初始化数据
     */
    onInitDate = () => {
        let currentConfig = JSON.parse(this.state.config)
        this.infoformRef.current.setFieldsValue({
            chatTimes: currentConfig.chatTimes,
            chatContentTypeId:  currentConfig.chatContentTypeId,
            exitHint:  currentConfig.exitHint
        })
        
        console.log(this.infoformRef.current.getFieldValue)
    }

    /**
     * 完成并保存
     */
    saveSubmit = values => {
        this.props.saveSubmit(values)
    }


    render() {
        const options = this.state.contentList.map(item => 
            <Select.Option key={item.id} value={item.id} >{item.name}</Select.Option>
        )
        return (
            <div className="info-config">
                <Form
                ref={this.infoformRef}
                onFinish={this.saveSubmit}>
                    <Form.Item
                        name="chatTimes"
                        label="闲聊次数">
                        <InputNumber min={1} max={10} onChange={this.onChangeChatTimes} className="chatTime-input" />
                    </Form.Item>
                    <Form.Item
                    name="chatContentTypeId"
                    label="内容源配置">
                        <Select
                            showSearch
                            placeholder="选择内容源"
                            defaultActiveFirstOption={false}
                            optionFilterProp="children"
                            onSelect={this.selectChange}
                            notFoundContent={'请先配置内容源'}
                            style={{ width: '80%' }}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }>
                            {options}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="退出提示语">
                        <Form.List name="exitHint">
                            {(hints, { add, remove }) => {
                            return (
                                <div>
                                {hints.map((hint, index) => (
                                    <Form.Item
                                    required={false}
                                    key={hint.key}
                                    >
                                    <Form.Item
                                        {...hint}
                                        validateTrigger={['onChange', 'onBlur']}
                                        rules={[
                                        {
                                            required: true,
                                            whitespace: true,
                                            message: "请输入退出提示语 或删除此输入框",
                                        },
                                        ]}
                                        noStyle
                                    >
                                        <Input placeholder="passenger name" style={{ width: '80%' }} />
                                    </Form.Item>
                                    {hints.length > 0 ? (
                                        <MinusCircleOutlined
                                        className="dynamic-delete-button"
                                        style={{ margin: '0 8px' }}
                                        onClick={() => {
                                            remove(hint.name);
                                        }}
                                        />
                                    ) : null}
                                    </Form.Item>
                                ))}
                                <Form.Item>
                                    <Button
                                    type="dashed"
                                    onClick={() => {
                                        add();
                                    }}
                                    style={{ width: '80%' }}
                                    >
                                    <PlusOutlined /> Add hint
                                    </Button>
                                </Form.Item>
                                </div>
                            );
                            }}
                        </Form.List>
                    </Form.Item>
                    <Form.Item style={{ textAlign: 'right' }}>
                        <Button type="primary" htmlType="submit">
                        保存更新
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}