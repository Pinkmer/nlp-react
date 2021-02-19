/**
 * task-config-基本信息
 */

import React from 'react'
import { Form, Input, Switch, message } from 'antd'

export default class BaseConfig extends React.Component{
    baseRef = React.createRef()

    constructor(props){
        super(props);
        this.state = {}
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.baseRef.current.setFieldsValue({
            id: nextProps.id,
            name: nextProps.name,
            intention: nextProps.intention,
        })
        if(this.props.config !== nextProps.config) {
            const config = JSON.stringify(nextProps.config)
            const propsConfig = JSON.parse(config)
            if (config === '{}') {
                this.baseRef.current.setFieldsValue({
                    start: false
                })
            } else {
                this.baseRef.current.setFieldsValue({
                    start: propsConfig.additional.start
                })
            }
        }
    }

    /**
     * 编辑状态下设置初始数据
     */
    handleSetData = () => {
        this.setState({
            id: this.props.id,
            name: this.props.name,
            intention: this.props.intention
        })
        this.baseRef.current.setFieldsValue({
            id: this.props.id,
            name: this.props.name,
            intention: this.props.intention
        })
    }


    /**
     * 校验后 获取此表单数据数据
     */
    getBaseValidate = async () => {
        try {
            const base = await this.baseRef.current.validateFields()
            if (base) {
                return base
            }
        } catch {
            message.warning('基本信息不为空')
            throw new Error()
        }
    }

    

    render() {
        const initialValue = {
            start: true
        }
        return (
            <div id={"anchor-baseinfo"}>
                <Form
                layout="inline"
                ref={this.baseRef}
                style={{margin: "5px 48px"}}
                initialValues={initialValue}>
                    <Form.Item
                    name="id"
                    label="ID">
                        <Input disabled={true} />
                    </Form.Item>
                    <Form.Item
                    name="name"
                    label="名称"
                    rules={[
                        {required: true,message: '请输入名称'},
                    ]}>
                        <Input placeholder="请输入名称" />
                    </Form.Item>
                    <Form.Item
                    name="intention"
                    label="意图"
                    rules={[
                        {required: true,message: '请输入意图'},
                    ]}>
                        <Input placeholder="请输入意图" />
                    </Form.Item>
                    <Form.Item
                    label="对话入口"
                    name="start"
                    valuePropName='checked'>
                        <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked />
                    </Form.Item>
                </Form>
            </div>
        )
    }
}