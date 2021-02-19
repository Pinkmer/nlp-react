/**
 * content-config-URL
 */

import React from 'react'
import { Form, Input, Divider, Radio, message } from 'antd'
import { ApiTwoTone } from '@ant-design/icons'

export default class UrlConfig extends React.Component{
    urlRef = React.createRef()

    constructor(props){
        super(props);
        this.state = {}
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.config !== nextProps.config){
            const config = JSON.stringify(nextProps.config)
            const propsConfig = JSON.parse(config)
            if (config === '{}') {
                this.urlRef.current.setFieldsValue({
                    scheme: propsConfig.scheme,
                    method: propsConfig.method,
                    link: '',
                    header: ''
                })
            } else { 
                this.urlRef.current.setFieldsValue({
                    scheme: propsConfig.scheme,
                    method: propsConfig.method,
                    link: propsConfig.link,
                    header: propsConfig.header
                })
            }
        }
    }
    
    /**
     * 校验后 获取此表单数据数据
     */
    getUrlValidate = async () => {
        try { 
            const urlConfig = await this.urlRef.current.validateFields()
            if (urlConfig) {
                return urlConfig
            }
        } catch {
            message.warning('URL配置不为空')
            throw new Error()
        }
    }

    render() {
        const initialValue = {
            scheme: 'http',
            method: 'post'
        }
        return (
            <div id={"anchor-url"}>
            <Divider orientation="left" plain>
                <ApiTwoTone /><span style={{color: "#1890ff"}}> URL配置</span>
            </Divider>
            <Form
              labelCol={{
                span: 3,
              }}
              wrapperCol={{
                span: 15,
              }}
              layout="horizontal"
              ref={this.urlRef}
              initialValues={initialValue}>
                <Form.Item
                label="协议"
                name="scheme"
                style={{width: "65%"}}
                rules={[
                    {required: true,message: '请选择协议'},
                ]}>
                    <Radio.Group>
                        <Radio.Button value="http">HTTP</Radio.Button>
                        <Radio.Button value="https">HTTPS</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                label="URL"
                name="link"
                style={{width: "65%"}}
                rules={[
                    {required: true,message: '请输入URL'},
                ]}>
                    <Input placeholder="内容源地址" />
                </Form.Item>
                <Form.Item
                label="请求方式"
                name="method"
                style={{width: "65%"}}
                rules={[
                    {required: true,message: '请选择请求方式'},
                ]}>
                    <Radio.Group>
                        <Radio.Button value="get">GET</Radio.Button>
                        <Radio.Button value="post">POST</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                label="HTTP Header"
                name="header"
                style={{width: "65%"}}>
                    <Input.TextArea placeholder="请输入内容" />
                </Form.Item>
            </Form>
        </div>
        )
    }
}