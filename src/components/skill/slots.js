/**
 * task-config-语义槽配置
 */

import React from 'react'
import { Button, Divider, Form, Input, Tooltip, Select, Space, message } from 'antd'
import { MinusCircleOutlined, PlusOutlined, BulbTwoTone } from '@ant-design/icons'

export default class SlotsConfig extends React.Component{
    slotRef = React.createRef()

    constructor(props){
        super(props);
        this.state = {
            slotConfig: []
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.config !== nextProps.config){
            const config = JSON.stringify(nextProps.config)
            const propsConfig = JSON.parse(config)
            if (config === '{}') {
                this.setState({
                    slotConfig: []
                })
            } else { 
                this.setState({
                    slotConfig: propsConfig.slots
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
        const currentSlot =  this.state.slotConfig
        this.slotRef.current.setFieldsValue({
            slots: currentSlot
        })
    }

    /**
     * 获取处理此表单数据数据
     */
    getSlotsValidate = async () => {
        try {
            const slots = await this.slotRef.current.validateFields()
            let obiItem = {
                necessary: false,
                question: '',
                questionCount: 0
            }
            let slotsConfig = []
            for (let i in slots.slots) {
                let item = slots.slots[i]
                let slot = {
                    ...item,
                    ...obiItem
                }
                slotsConfig.push(slot)
            }
            slots.slots = [...slotsConfig]
            return slots
        } catch (errorInfo) {
            message.warning('语义槽配置不为空')
            throw new Error()
        }
    }


    render() {
        return (
            <div id={"anchor-slots"}>
                <Divider orientation="left" plain>
                    <Tooltip placement="right" title="从用户说法中提取的关键字，一般和词库总是一起使用" >
                        <BulbTwoTone /><span style={{color: "#1890ff"}}> 语义槽配置</span>
                    </Tooltip>
                </Divider>
            
                <Form
                ref={this.slotRef}>
                    <Form.Item
                    label="语义槽配置">
                        <Form.List name="slots">
                        {(fields, { add, remove }) => {
                        return (
                            <div>
                            {fields.map(slots => (
                                <Space key={slots.key} align="baseline">
                                    <Form.Item
                                        {...slots}
                                        name={[slots.name, 'slotId']}
                                        fieldKey={[slots.fieldKey, 'slotId']}
                                        label="语义槽"
                                        rules={[
                                            {required: true,message: '请输入名称'},
                                        ]}>
                                        <Input placeholder="支持中、英、数字" />
                                    </Form.Item>
                                    <Form.Item
                                        {...slots}
                                        name={[slots.name, 'type']}
                                        fieldKey={[slots.fieldKey, 'type']}
                                        label="类型"
                                        rules={[
                                            {required: true, message: '请选择类型'},
                                        ]}>
                                        <Select
                                        style={{width:"225px"}}
                                        placeholder="选择类型">
                                            <Select.Option value="text">文本</Select.Option>
                                            <Select.Option value="date">日期(2006/1/2)</Select.Option>
                                            <Select.Option value="date_v2">日期v2(2006-01-02)</Select.Option>
                                            <Select.Option value="time">时间(15:04)</Select.Option>
                                            <Select.Option value="date_time">日期/时间(2006-01-02T15:04)</Select.Option>
                                            <Select.Option value="number">数字(123.45)</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        {...slots}
                                        name={[slots.name, 'defaultValue']}
                                        fieldKey={[slots.fieldKey, 'defaultValue']}
                                        label="默认值"
                                        rules={[
                                            {required: true,message: '请输入默认值'},
                                        ]}>
                                        <Input placeholder="支持中、英、数字" />
                                    </Form.Item>
                                    <MinusCircleOutlined
                                        onClick={() => {
                                        remove(slots.name);
                                        }}
                                    />
                                </Space>
                            ))}
                            <Form.Item>
                                <Button
                                type="dashed"
                                onClick={() => {
                                    add();
                                }}
                                block
                                style={{ width: '60%' }}
                                >
                                <PlusOutlined /> Add Slot
                                </Button>
                            </Form.Item>
                            </div>
                        );
                        }}
                        </Form.List>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}