/**
 * task-config-语法
 */

import React from 'react'
import { Button, Divider, Form, Input, Radio, Tooltip, message } from 'antd'
import { MinusCircleOutlined, PlusOutlined, BulbTwoTone } from '@ant-design/icons'

export default class GrammarConfig extends React.Component{
    grammarRef = React.createRef()

    constructor(props){
        super(props);
        this.state = {
            grammarConfig: [],
            grammarType: 'none'
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.config !== nextProps.config){
            const config = JSON.stringify(nextProps.config)
            const propsConfig = JSON.parse(config)
            if (config === '{}') {
                this.setState({
                    grammarConfig: [],
                    grammarType: 'none'
                })
                
            } else { 
                this.setState({
                    grammarConfig: propsConfig.grammars,
                    grammarType: propsConfig.grammarType,
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
        const currentGrammar =  this.state.grammarConfig
        const currentGrammarType = this.state.grammarType
        if (currentGrammarType === 'jsgf') {
            this.grammarRef.current.setFieldsValue({
                grammarType: currentGrammarType,
                jsgfgrammar: currentGrammar[0].grammar,
            })
        } else if (currentGrammarType === 'match') {
            this.grammarRef.current.setFieldsValue({
                grammarType: currentGrammarType,
                matchgrammar: currentGrammar,
            })
        } else {
            this.grammarRef.current.setFieldsValue({
                grammarType: currentGrammarType,
            })
        }
    }

    /**
     * 切换类型
     */
    onChangeGrammarType = e => {
        this.grammarRef.current.setFieldsValue({
            grammarType: e.target.value
        })
        this.setState({
            grammarType: e.target.value,
        }, () => {
            // 清空其余两个内容
            if (this.state.grammarType === 'jsgf') {
                this.grammarRef.current.setFieldsValue({
                    matchgrammar: [],
                })
            } else if (this.state.grammarType === 'jsgf') {
                this.grammarRef.current.setFieldsValue({
                    jsgfgrammar: '',
                })
            } else {
                this.grammarRef.current.setFieldsValue({
                    jsgfgrammar: '',
                    matchgrammar: [],
                })
            }
        })
    }

    /**
     * 获取处理此表单数据数据
     */
    getGrammarsValidate = async () => {     
        try {
            const grammars = await this.grammarRef.current.validateFields()
            if (grammars) {
                if (grammars.grammarType === 'jsgf') {
                    const jsgf = {
                        grammar: grammars.jsgfgrammar
                    }
                    const jsgfarr = [jsgf]
                    const grammerConfig = {
                        grammarType: 'jsgf',
                        grammars: jsgfarr
                    }
                    return grammerConfig
                } else if (grammars.grammarType === 'match') {
                    if (grammars.matchgrammar.length === 0) {
                        throw new Error()
                    } else {
                        const grammerConfig = {
                            grammarType: 'match',
                            grammars: grammars.matchgrammar
                        }
                        return grammerConfig
                    }
                    } else {
                    const grammerConfig = {
                        grammarType: 'none',
                        grammars: []
                    }
                    return grammerConfig
                }
            }
        } catch {
            message.warning('语法配置不为空')
            throw new Error()
        }
    }


    render() {
        const grammarType = this.state.grammarType
        const initialValue = {
            grammarType: 'none'
        }
        return (
            <div id={"anchor-grammars"}>
                <Divider orientation="left" plain>
                    <Tooltip placement="right" title="用户在对话交互过程中提出的问题、请求或命令" >
                        <BulbTwoTone /><span style={{color: "#1890ff"}}> 语法配置</span>
                    </Tooltip>
                </Divider>
                
                <Form
                ref={this.grammarRef}
                initialValues={initialValue}>
                    <Form.Item label="语法类型" name="grammarType">
                        <Radio.Group onChange={this.onChangeGrammarType}>
                            <Radio.Button value="jsgf">规则</Radio.Button>
                            <Radio.Button value="match">匹配</Radio.Button>
                            <Radio.Button value="none">不使用理解</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item>
                    {grammarType === 'jsgf' ? (
                        <Form.Item
                        label="语法规则"
                        name="jsgfgrammar"
                        rules={[
                            {
                                required: true,
                                message: "请输入规则",
                            },
                        ]}>
                            <Input.TextArea autoSize={{ minRows: 4 }} style={{ width: '60%' }}/>
                        </Form.Item>
                    ) : null}
                    {grammarType === 'match' ? (
                        <Form.Item label="匹配语句">
                             <Form.List name="matchgrammar">
                                {(grammarList, { add, remove }) => {
                                return (
                                    <div>
                                    {grammarList.map((grammars, index) => (
                                        <Form.Item
                                        required={false}
                                        key={grammars.key}
                                        >
                                        <Form.Item
                                            {...grammars}
                                            name={[grammars.name, 'grammar']}
                                            validateTrigger={['onChange', 'onBlur']}
                                            rules={[
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: "请输入匹配语句",
                                            },
                                            ]}
                                            noStyle
                                        >
                                            <Input placeholder="请输入语句" style={{ width: '60%' }} />
                                        </Form.Item>
                                        {grammarList.length > 0 ? (
                                            <MinusCircleOutlined
                                            className="dynamic-delete-button"
                                            style={{ margin: '0 8px' }}
                                            onClick={() => {
                                                remove(grammars.name);
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
                                        <PlusOutlined /> Add grammar
                                        </Button>
                                    </Form.Item>
                                    </div>
                                );
                                }}
                            </Form.List>
                        </Form.Item>
                    ) : null}
                    {grammarType === 'none' ? (
                        <Form.Item>
                            <p style={{margin: '0 75px'}}>注意"不使用理解时必须配置其他触发方式"</p>
                        </Form.Item>
                    ) : null}
                    </Form.Item>
                </Form>
            </div>
        )
    }
}