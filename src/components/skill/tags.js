/**
 * task-config-标签/指令
 */

import React from 'react'
import { Divider, Form, Input, Tooltip } from 'antd'
import { BulbTwoTone } from '@ant-design/icons'

export default class TagsConfig extends React.Component{
    tagsRef = React.createRef()

    constructor(props){
        super(props);
        this.state = {
            commandsConfig: ''
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.config !== nextProps.config){
            const config = JSON.stringify(nextProps.config)
            const propsConfig = JSON.parse(config)
            if (config === '{}') {
                this.setState({
                    commandsConfig: ''
                })
            } else { 
                this.setState({
                    commandsConfig: propsConfig.additional.commands
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
        const currentCommands =  this.state.commandsConfig
        this.tagsRef.current.setFieldsValue({
            commands: currentCommands
        })
    }

        /**
     * 获取此表单数据数据
     */
    getTagFormValue = () => {
        const commandConfig = this.tagsRef.current.getFieldValue()
        return commandConfig
    }



    render() {
        return (
            <div id={"anchor-tags"}>
            <Divider orientation="left" plain>
                <Tooltip placement="right" title="车载应用中长用的快捷指令，可在此直接指定" >
                    <BulbTwoTone /><span style={{color: "#1890ff"}}> 指令配置</span>
                </Tooltip>
            </Divider>
            
            <Form
            ref={this.tagsRef}>
                <Form.Item
                label="JSON指令"
                name="commands">
                    <Input.TextArea autoSize={{ minRows: 4 }} style={{ width: '60%' }}/>
                </Form.Item>
            </Form>
            </div>
        )
    }
}