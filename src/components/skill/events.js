/**
 * task-config-事件
 */

import React from 'react'
import { Button, Divider, Form, Input, Tooltip, message } from 'antd'
import { MinusCircleOutlined, PlusOutlined, BulbTwoTone } from '@ant-design/icons'

export default class EventConfig extends React.Component{
    eventRef = React.createRef()

    constructor(props){
        super(props);
        this.state = {
            eventConfig: []
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.config !== nextProps.config){
            const config = JSON.stringify(nextProps.config)
            const propsConfig = JSON.parse(config)
            if (config === '{}') {
                this.setState({
                    eventConfig: []
                })
            } else { 
                this.setState({
                    eventConfig: propsConfig.events
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
        const currentEvent =  this.state.eventConfig
        this.eventRef.current.setFieldsValue({
            events: currentEvent
        })
    }

    /**
     * 获取此表单数据数据
     */
    getEventsValidate = async() => {
        try {
            const event = await this.eventRef.current.validateFields()
            if (event.events === undefined) {
                return {events: []}
            } else {
                return event
            }
        } catch {
            message.warning('事件语句不为空')
            throw new Error()
        }
    }


    render() {
        return (
            <div id={"anchor-events"}>
                <Divider orientation="left" plain>
                    <Tooltip placement="right" title="和语法类似，用于自定义触发当前用户意图的系统事件" >
                        <BulbTwoTone /><span style={{color: "#1890ff"}}> 事件配置</span>
                    </Tooltip>
                </Divider>
                
                <Form
                ref={this.eventRef}>
                    <Form.Item
                    label="事件语句">
                        <Form.List name="events">
                            {(eventsList, { add, remove }) => {
                            return (
                                <div>
                                {eventsList.map((events, index) => (
                                    <Form.Item
                                    required={false}
                                    key={events.key}
                                    >
                                    <Form.Item
                                        {...events}
                                        name={[events.name, 'event']}
                                        validateTrigger={['onChange', 'onBlur']}
                                        rules={[
                                        {
                                            required: true,
                                            whitespace: true,
                                            message: "请输入事件语句 或删除此输入框",
                                        },
                                        ]}
                                        noStyle
                                    >
                                        <Input placeholder="请输入事件" style={{ width: '60%' }} />
                                    </Form.Item>
                                    {eventsList.length > 0 ? (
                                        <MinusCircleOutlined
                                        className="dynamic-delete-button"
                                        style={{ margin: '0 8px' }}
                                        onClick={() => {
                                            remove(events.name);
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
                                    style={{ width: '60%' }}
                                    >
                                    <PlusOutlined /> Add Events
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