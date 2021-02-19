/**
 * content-config-脚本处理
 */

import React from 'react'
import { Form, Input, Divider, Switch, Radio, message } from 'antd'
import { ApiTwoTone } from '@ant-design/icons'
import CodeMirror from '../codeMirror/index'

export default class MetionConfig extends React.Component{
    methodRef = React.createRef()

    constructor(props){
        super(props);
        this.state = {
            preTreatType: 'script',
            config: {},
            preTreatmentJSCode: '',
            postTreatmentJSCode: ''
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.config !== nextProps.config){
            const config = JSON.stringify(nextProps.config)
            const propsConfig = JSON.parse(config)
            if (config === '{}') {
                this.setState({
                    preTreatType: 'script'
                })
            } else { 
                this.setState({
                    preTreatType: propsConfig.preTreatType,
                    config: propsConfig
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
        const currentPreTreatType =  this.state.preTreatType
        const currentConfig =  this.state.config
        this.methodRef.current.setFieldsValue({
            available: currentConfig.available,
            param: currentConfig.param,
            postTreatment: currentConfig.postTreatment
        })
        this.setState({
            postTreatmentJSCode: currentConfig.postTreatment
        })
        if (currentPreTreatType === 'script') {
            this.methodRef.current.setFieldsValue({
                preTreatType: currentPreTreatType,
                preTreatment: currentConfig.preTreatment
            })
            this.setState({
                preTreatmentJSCode: currentConfig.preTreatment
            })
        } else if (currentPreTreatType === 'web') {
            this.methodRef.current.setFieldsValue({
                preTreatType: currentPreTreatType,
                preTreatWebUrl: currentConfig.preTreatWebUrl,
            })
        }
    }


    /**
     * 改变类型
     */
    onChangePreTreatType = e => {
        this.setState({
            preTreatType: e.target.value
        })
        this.methodRef.current.setFieldsValue({
            preTreatType: e.target.value
        })
    }

    /**
     * 获取处理此表单数据数据
     */
    getMethodValidate = async () => {
        try {
            const methods = await this.methodRef.current.validateFields()
            if (methods) {
                if (methods.preTreatType === 'script') {
                    const prejs = this.refs.preTreatmentCode.pushPropsValue()
                    const postjs = this.refs.postTreatmentCode.pushPropsValue()
                    if (prejs === '' || prejs === null || prejs === undefined) {
                        throw new Error()
                    } else {
                        const method = {
                            available: methods.available,
                            param: methods.param,
                            preTreatType: methods.preTreatType,
                            preTreatment: prejs,
                            preTreatWebUrl: '',
                            postTreatment: postjs,
                        }
                        return method
                    }
                } else if (methods.preTreatType === 'web') {
                    const postjs = this.refs.postTreatmentCode.pushPropsValue()
                    const method = {
                        available: methods.available,
                        param: methods.param,
                        preTreatType: methods.preTreatType,
                        preTreatment: '',
                        preTreatWebUrl: methods.preTreatWebUrl,
                        postTreatment: postjs
                    }
                    return method
                }
            }
        } catch {
            message.warning('处理方式不为空')
            throw new Error()
        }
    }


    render() {
        const {preTreatType, preTreatmentJSCode, postTreatmentJSCode} = this.state
        const initialValue = {
            available: false,
            preTreatType: 'script'
        }
        return (
            <div id={"anchor-metion"}>
                <Divider orientation="left" plain>
                    <ApiTwoTone /><span style={{color: "#1890ff"}}> 处理方式</span>
                </Divider>
                <Form
                 labelCol={{
                    span: 3,
                  }}
                  wrapperCol={{
                    span: 15,
                  }}
                  layout="horizontal"
                  ref={this.methodRef}
                  initialValues={initialValue}>
                    <Form.Item
                    label="是否可用"
                    name="available"
                    style={{ width: '65%' }}
                    valuePropName='checked'>
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                    </Form.Item>
                    <Form.Item
                    label="参数"
                    name="param"
                    style={{ width: '65%' }}>
                        <Input.TextArea placeholder="请输入描述，支持中、英、数字和下划线" />
                    </Form.Item>
                    <Form.Item
                    label="前处理方式"
                    name="preTreatType"
                    style={{ width: '65%' }}
                    rules={[
                        {required: true,message: '请选择处理方式'},
                    ]}>
                        <Radio.Group onChange={this.onChangePreTreatType}>
                            <Radio.Button value="script">自定义脚本</Radio.Button>
                            <Radio.Button value="web">远程调用</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    {preTreatType === 'script' ? (
                        <Form.Item
                        label="前处理脚本"
                        name="preTreatment"
                        style={{ width: '65%' }}>
                            <CodeMirror  ref="preTreatmentCode" busJSCode={preTreatmentJSCode} />
                        </Form.Item>
                    ) : 
                        <Form.Item
                        label="调用链接"
                        name="preTreatWebUrl"
                        style={{ width: '65%' }}
                        rules={[
                            {required: true,message: '请输入调用链接'},
                        ]}>
                            <Input addonBefore="http://" addonAfter=".com"/>
                        </Form.Item>
                    }
                    <Form.Item
                    label="后处理脚本"
                    name="postTreatment"
                    style={{ width: '65%' }}>
                        <CodeMirror ref="postTreatmentCode" busJSCode={postTreatmentJSCode}/>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}