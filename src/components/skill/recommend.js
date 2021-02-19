/**
 * task-config-推荐语
 */

import React from 'react'
import { Button, Divider, Form, Input, Tooltip, message } from 'antd'
import { MinusCircleOutlined, PlusOutlined, BulbTwoTone } from '@ant-design/icons'

export default class RecommendConfig extends React.Component{
    recommendRef = React.createRef()

    constructor(props){
        super(props);
        this.state = {
            recommendsConfig: []
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.config !== nextProps.config){
            const config = JSON.stringify(nextProps.config)
            const propsConfig = JSON.parse(config)
            if (config === '{}') {
                this.setState({
                    recommendsConfig: []
                })
            } else { 
                this.setState({
                    recommendsConfig: propsConfig.additional.recommends
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
        const currentrRecommends =  this.state.recommendsConfig
        this.recommendRef.current.setFieldsValue({
            recommends: currentrRecommends
        })
    }

    /**
     * 获取此表单数据数据
     */
    getRecommendValidate = async () => {
        try {
        const recommend = await this.recommendRef.current.validateFields()
            if (recommend.recommends === undefined) {
                return {recommends: []}
            } else {
                return recommend
            }
        } catch {
            message.warning('推荐语不为空')
            throw new Error()
        }
    }


    render() {
        return (
            <div id={"anchor-recommend"}>
                <Divider orientation="left" plain>
                    <Tooltip placement="right" title="用于指导用户进行对话流程的推荐说法" >
                        <BulbTwoTone /><span style={{color: "#1890ff"}}> 推荐语</span>
                    </Tooltip>
                </Divider>
                
                <Form
                ref={this.recommendRef}>
                    <Form.Item label="推荐语句">
                        <Form.List name="recommends">
                            {(recommendList, { add, remove }) => {
                            return (
                                <div>
                                {recommendList.map((recommend, index) => (
                                    <Form.Item
                                    required={false}
                                    key={recommend.key}
                                    >
                                    <Form.Item
                                        {...recommend}
                                        validateTrigger={['onChange', 'onBlur']}
                                        rules={[
                                        {
                                            required: true,
                                            whitespace: true,
                                            message: "请输入推荐语 或删除此输入框",
                                        },
                                        ]}
                                        noStyle
                                    >
                                        <Input placeholder="请输入推荐语" style={{ width: '60%' }} />
                                    </Form.Item>
                                    {recommendList.length > 0 ? (
                                        <MinusCircleOutlined
                                        className="dynamic-delete-button"
                                        style={{ margin: '0 8px' }}
                                        onClick={() => {
                                            remove(recommend.name);
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
                                    <PlusOutlined /> Add Recommend
                                    </Button>
                                </Form.Item>
                                </div>
                            )
                            }}
                        </Form.List>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}