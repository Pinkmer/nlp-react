/**
 * task-config-回答
 */

import React from 'react'
import { Button, Divider, Form, Input, Radio, Tooltip, message } from 'antd'
import { MinusCircleOutlined, PlusOutlined, BulbTwoTone } from '@ant-design/icons'
import CodeMirror from '../codeMirror/index'

export default class AnswerConfig extends React.Component{
   answerRef = React.createRef()

    constructor(props){
        super(props);
        this.state = {
            answerConfig: '',
            answerType: 'text',
            busJSCode: ''
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.config !== nextProps.config){
            const config = JSON.stringify(nextProps.config)
            const propsConfig = JSON.parse(config)
            if (config === '{}') {
                this.setState({
                    answerConfig: '',
                    answerType: 'text'
                })
            } else { 
                this.setState({
                    answerConfig: propsConfig.answers,
                    answerType: propsConfig.answerType,
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
        const currentAnswer =  this.state.answerConfig
        const currentAnswerType = this.state.answerType
        if (currentAnswerType === 'text') {
            this.answerRef.current.setFieldsValue({
                answerType: currentAnswerType,
                textAnswer: currentAnswer,
            })
        } else if (currentAnswerType === 'template') {
            this.answerRef.current.setFieldsValue({
                answerType: currentAnswerType,
                templateAnswer: currentAnswer,
            })
        } else if (currentAnswerType === 'script') {
            this.answerRef.current.setFieldsValue({
                answerType: currentAnswerType,
                scriptAnswer: currentAnswer[0].answer,
            })
            this.setState({
                busJSCode: currentAnswer[0].answer
            })
        } else if (currentAnswerType === 'web') {
            this.answerRef.current.setFieldsValue({
                answerType: currentAnswerType,
                webAnswer: currentAnswer[0].answer,
            })
        }
    }

    /**
     * 切换类型
     */
    onChangeAnswerType = e => {
        this.setState({
            answerType: e.target.value,
        })
    }

    /**
     * 获取此表单数据数据
     */
    getAnswerValidate = async () => {
        try {
            const answer = await this.answerRef.current.validateFields()
            if (answer.answerType === 'text') {
                if (answer.textAnswer === undefined) {
                    throw new Error()
                } else {
                    const answersConfig = {
                        answerType: answer.answerType,
                        answers: answer.textAnswer
                    }
                    return answersConfig
                }
            } else if (answer.answerType === 'template') {
                if (answer.templateAnswer === undefined) {
                    throw new Error()
                } else {
                    const answersConfig = {
                        answerType: answer.answerType,
                        answers: answer.templateAnswer
                    }
                    return answersConfig
                }
            } else if (answer.answerType === 'script') {
                const js = this.refs.answerCode.pushPropsValue()
                if (js === '' || js === null || js === undefined) {
                    throw new Error()
                } else {
                    const scriptAnswer = [{
                        answer: js
                    }]
                    const answersConfig = {
                        answerType: answer.answerType,
                        answers: scriptAnswer
                    }
                    return answersConfig
                }
            } else if (answer.answerType === 'web') {
                if (answer.webAnswer === undefined) {
                    throw new Error()
                } else {
                    const webAnswer = [{
                        answer: answer.webAnswer
                    }]
                    const answersConfig = {
                        answerType: answer.answerType,
                        answers: webAnswer
                    }
                    return answersConfig
                }
            } else {
               message.warning('请配置回答')
            }
        } catch {
            message.warning('回答不为空')
            throw new Error()
        }
    }


    render() {
        const {answerType, busJSCode} = this.state
        const initialValue = {
            answerType: 'text'
        }
        return (
            <div id={"anchor-answer"}>
                <Divider orientation="left" plain>
                    <Tooltip placement="right" title="再次处理对话逻辑，给出协议字段信息及生成播报内容" >
                        <BulbTwoTone /><span style={{color: "#1890ff"}}> 回答配置</span>
                    </Tooltip>
                </Divider>
                <Form
                ref={this.answerRef}
                initialValues={initialValue}>
                    <Form.Item label="回答类型" name="answerType">
                        <Radio.Group onChange={this.onChangeAnswerType}>
                            <Radio.Button value="text">文本回复</Radio.Button>
                            <Radio.Button value="template">模板回复</Radio.Button>
                            <Radio.Button value="script">自定义脚本</Radio.Button>
                            <Radio.Button value="web">远程调用</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    {answerType === 'text' ? (
                        <Form.Item
                        label="回答内容">
                            <Form.List name="textAnswer">
                                {(answerTextList, { add, remove }) => {
                                return (
                                    <div>
                                    {answerTextList.map((answerText, index) => (
                                        <Form.Item
                                        required={false}
                                        key={answerText.key}
                                        >
                                        <Form.Item
                                            {...answerText}
                                            name={[answerText.name, 'answer']}
                                            validateTrigger={['onChange', 'onBlur']}
                                            rules={[
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: "请输入回答",
                                            },
                                            ]}
                                            noStyle
                                        >
                                            <Input placeholder="请输入回答" style={{ width: '60%' }} />
                                        </Form.Item>
                                        {answerTextList.length > 1 ? (
                                            <MinusCircleOutlined
                                            className="dynamic-delete-button"
                                            style={{ margin: '0 8px' }}
                                            onClick={() => {
                                                remove(answerText.name);
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
                                        <PlusOutlined /> Add Answer
                                        </Button>
                                    </Form.Item>
                                    </div>
                                    )
                                }}
                            </Form.List>
                        </Form.Item>
                    ) : null}
                    {answerType === 'template' ? (
                        <Form.Item label="模板内容">
                            <Form.List name="templateAnswer">
                                {(answerTemplateList, { add, remove }) => {
                                return (
                                    <div>
                                    {answerTemplateList.map((answerTemplate, index) => (
                                        <Form.Item
                                        required={false}
                                        key={answerTemplate.key}
                                        >
                                        <Form.Item
                                            {...answerTemplate}
                                            name={[answerTemplate.name, 'answer']}
                                            validateTrigger={['onChange', 'onBlur']}
                                            rules={[
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: "请输入模板",
                                            },
                                            ]}
                                            noStyle
                                        >
                                            <Input placeholder="请输入模板" style={{ width: '60%' }} />
                                        </Form.Item>
                                        {answerTemplateList.length > 1 ? (
                                            <MinusCircleOutlined
                                            className="dynamic-delete-button"
                                            style={{ margin: '0 8px' }}
                                            onClick={() => {
                                                remove(answerTemplate.name);
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
                                        <PlusOutlined /> Add Answer
                                        </Button>
                                    </Form.Item>
                                    </div>
                                );
                                }}
                            </Form.List>
                        </Form.Item>
                    ) : null}
                    {answerType === 'script' ? (
                        <Form.Item
                        label="JS脚本"
                        name="scriptAnswer"
                        rules={[
                            {required: true,message: '请输入javascripts脚本'},
                        ]}>
                            <CodeMirror ref="answerCode" busJSCode={busJSCode} />
                        </Form.Item>
                    ) : null}
                    {answerType === 'web' ? (
                        <Form.Item
                        label="调用链接"
                        name="webAnswer"
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