/**
 * content-config-基本信息
 */

import React from 'react'
import { Form, Input, Divider, message } from 'antd'
import { ApiTwoTone } from '@ant-design/icons'

export default class BaseConfig extends React.Component{
    baseRef = React.createRef()

    constructor(props){
        super(props);
        this.state = {
            name: '',
            description: ''
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.baseRef.current.setFieldsValue({
            name: nextProps.name,
        })
        if (this.props.config !== nextProps.config){
            const config = JSON.stringify(nextProps.config)
            const propsConfig = JSON.parse(config)
            if (config === '{}') {
                this.baseRef.current.setFieldsValue({
                    description: ''
                })
            } else { 
                this.baseRef.current.setFieldsValue({
                    description: propsConfig.description
                })
            }
        }
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
        return (
            <div id={"anchor-base"}>
                <Divider orientation="left" plain>
                    <ApiTwoTone /><span style={{color: "#1890ff"}}> 基本信息</span>
                </Divider>
                <Form
                 labelCol={{
                    span: 3,
                  }}
                  wrapperCol={{
                    span: 15,
                  }}
                  layout="horizontal"
                  ref={this.baseRef}>
                    <Form.Item
                    label="名称"
                    name="name"
                    style={{width: "65%"}}
                    rules={[
                        {required: true,message: '请输入名称'},
                    ]}>
                        <Input placeholder="请输入内容源名称，支持中、英、数字和下划线" />
                    </Form.Item>
                    <Form.Item
                    label="描述"
                    name="description"
                    style={{width: "65%"}}>
                        <Input.TextArea placeholder="请输入描述，支持中、英、数字和下划线" />
                    </Form.Item>
                </Form>
            </div>
        )
    }
}