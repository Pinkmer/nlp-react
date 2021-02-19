/**
 * task-config-语义槽处理
 */

import React from 'react'
import { Form, Input, Radio, message } from 'antd'
import CodeMirror from '../codeMirror/index'

export default class SlotMergeConfig extends React.Component{
    slotMergeRef = React.createRef()

    constructor(props){
        super(props);
        this.state = {
            slotMergeConfig: '',
            slotMergeType: '',
            busJSCode: ''
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.config !== nextProps.config){
            const config = JSON.stringify(nextProps.config)
            const propsConfig = JSON.parse(config)
            if (config === '{}') {
                this.setState({
                    slotMergeConfig: '',
                    slotMergeType: 'none'
                })
            } else { 
                this.setState({
                    slotMergeConfig: propsConfig.slotMerge,
                    slotMergeType: propsConfig.slotMergeType,
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
        const currentSlotMerge =  this.state.slotMergeConfig
        const currentSlotMergeType = this.state.slotMergeType
        if (currentSlotMergeType === 'none' || currentSlotMergeType === 'simple') {
            this.slotMergeRef.current.setFieldsValue({
                slotMergeType: currentSlotMergeType
            })
        } else if (currentSlotMergeType === 'script') {
            this.slotMergeRef.current.setFieldsValue({
                slotMergeType: currentSlotMergeType,
                scriptSlotMerge: currentSlotMerge,
            })
            this.setState({
                busJSCode: currentSlotMerge
            })
        } else if (currentSlotMergeType === 'web') {
            this.slotMergeRef.current.setFieldsValue({
                slotMergeType: currentSlotMergeType,
                webSlotMerge: currentSlotMerge,
            })
        }
    }

    /**
     * 切换类型
     */
    onChangeslotMergeType = e => {
        this.setState({
            slotMergeType: e.target.value,
        })
    }
    
    /**
     * 获取处理此表单数据数据
     */
    getSlotMergesValidate = async () => {
        try {
            const slotMerges = await this.slotMergeRef.current.validateFields()
            if (slotMerges.slotMergeType === 'none' || slotMerges.slotMergeType === 'simple') {
                const slotMergeConfigs = {
                    slotMergeType: slotMerges.slotMergeType,
                    slotMerge: ''
                }
                return slotMergeConfigs
            } else if (slotMerges.slotMergeType === 'script') {
                const js = this.refs.slotMergeCode.pushPropsValue()
                if (js === '' || js === null || js === undefined) {
                    throw new Error()
                } else {
                    const slotMergeConfigs = {
                        slotMergeType: slotMerges.slotMergeType,
                        slotMerge: js
                    }
                    return slotMergeConfigs
                }
            } else if (slotMerges.slotMergeType === 'web') {
                if (slotMerges.webSlotMerge === undefined) {
                    throw new Error()
                } else {
                    const slotMergeConfigs = {
                        slotMergeType: slotMerges.slotMergeType,
                        slotMerge: slotMerges.webSlotMerge
                    }
                    return slotMergeConfigs
                }
            }
        } catch {
            message.warning('语义槽处理不为空')
            throw new Error()
        }
    }



    render() {
        const {busJSCode, slotMergeType} = this.state
        const initialValue = {
            slotMergeType: 'none'
        }
        return (
            <div id={"anchor-slotMerge"}>
                <Form
                ref={this.slotMergeRef}
                initialValues={initialValue}>
                    <Form.Item label="语义槽处理" name="slotMergeType">
                        <Radio.Group onChange={this.onChangeslotMergeType}>
                            <Radio.Button value="none">不处理</Radio.Button>
                            <Radio.Button value="simple">继承历史</Radio.Button>
                            <Radio.Button value="script">自定义脚本</Radio.Button>
                            <Radio.Button value="web">远程调用</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    {slotMergeType === 'script' ? (
                        <Form.Item
                        label="JS脚本"
                        name="scriptSlotMerge"
                        rules={[
                            {required: true,message: '请输入JS脚本'},
                        ]}>
                            <CodeMirror ref="slotMergeCode" busJSCode={busJSCode} />
                        </Form.Item>
                    ) : null}
                    {slotMergeType === 'web' ? (
                        <Form.Item
                        label="调用链接"
                        name="webSlotMerge"
                        rules={[
                            {required: true,message: '请输入调用链接'},
                        ]}>
                            <Input addonBefore="http://" style={{ width: '60%' }}/>
                        </Form.Item>
                    ) : null}
                </Form>
            </div>
        )
    }
            
}