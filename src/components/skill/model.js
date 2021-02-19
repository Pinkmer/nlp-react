/**
 * task-config-模型
 */

import React from 'react'
import { Button, Divider, Form, Input, Tooltip, message } from 'antd'
import { MinusCircleOutlined, PlusOutlined, BulbTwoTone } from '@ant-design/icons'

export default class ModelConfig extends React.Component{
    modelRef = React.createRef()

    constructor(props){
        super(props);
        this.state = {
            modelConfig: []
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.config !== nextProps.config){
            const config = JSON.stringify(nextProps.config)
            const propsConfig = JSON.parse(config)
            if (config === '{}') {
                this.setState({
                    modelConfig: []
                })
            } else { 
                this.setState({
                    modelConfig: propsConfig.additional.models
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
        const currentModel =  this.state.modelConfig
        this.modelRef.current.setFieldsValue({
            models: currentModel
        })
    }

    /**
     * 获取此表单数据数据
     */
    getModelsValidate = async () => {
        try {
            const model = await this.modelRef.current.validateFields()
            if (model.models === undefined) {
                return {models: []}
            } else {
                return model
            }
        } catch {
            message.warning('模型不为空')
            throw new Error()
        }
    }


    render() {
        return (
            <div id={"anchor-model"}>
                <Divider orientation="left" plain>
                    <Tooltip placement="right" title="与规则语法等效的，基于远程模型理解结果触发当前意图的方式" >
                        <BulbTwoTone /><span style={{color: "#1890ff"}}> 模型配置</span>
                    </Tooltip>
                </Divider>
                
                <Form
                ref={this.modelRef}>
                    <Form.Item
                    label="模型名称">
                        <Form.List name="models">
                            {(modelsList, { add, remove }) => {
                            return (
                                <div>
                                {modelsList.map((models, index) => (
                                    <Form.Item
                                    required={false}
                                    key={models.key}
                                    >
                                    <Form.Item
                                        {...models}
                                        validateTrigger={['onChange', 'onBlur']}
                                        rules={[
                                        {
                                            required: true,
                                            whitespace: true,
                                            message: "请输入模型名称 或删除此输入框",
                                        },
                                        ]}
                                        noStyle
                                    >
                                        <Input placeholder="请输入模型名" style={{ width: '60%' }} />
                                    </Form.Item>
                                    {modelsList.length > 0 ? (
                                        <MinusCircleOutlined
                                        className="dynamic-delete-button"
                                        style={{ margin: '0 8px' }}
                                        onClick={() => {
                                            remove(models.name);
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
                                    <PlusOutlined /> Add Models
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