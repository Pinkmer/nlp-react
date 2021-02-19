/**
 * content-config-是否缓存
 */

import React from 'react'
import { Form, Input, Switch, Divider, message } from 'antd'
import { ApiTwoTone } from '@ant-design/icons'

export default class BaseConfig extends React.Component{
    cacheRef = React.createRef()

    constructor(props){
        super(props);
        this.state = {
            cacheEnable: false,
            cacheConfig: {}
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.config !== nextProps.config){
            const config = JSON.stringify(nextProps.config)
            const propsConfig = JSON.parse(config)
            if (config === '{}') {
                this.setState({
                    cacheConfig: {},
                    cacheEnable: false
                })
            } else { 
                this.setState({
                    cacheEnable: propsConfig.cacheEnable,
                    cacheConfig: propsConfig
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
        const currentCache =  this.state.cacheConfig
        const currentcacheEnable = this.state.cacheEnable
        this.cacheRef.current.setFieldsValue({
            cacheEnable: currentcacheEnable,
            cacheTtl: currentCache.cacheTtl,
            cacheTime: currentCache.cacheTime
        })
    }

    /**
     * 切换类型
     */
    onChangeChecked = (checked) => {
        this.setState({
            cacheEnable: checked,
        });
    }

    /**
     * 获取处理此表单数据数据
     */
    getCacheValidate = async () => {
        try {
            const cache = await this.cacheRef.current.validateFields()
            if (this.state.cacheEnable === false) {
                let cacheConfig = {
                    cacheEnable: cache.cacheEnable,
                    cacheTtl: '',
                    cacheTime: ''
                }
                return cacheConfig
            } else {
                let cacheConfig = {
                    cacheEnable: cache.cacheEnable,
                    cacheTtl: cache.cacheTtl,
                    cacheTime: cache.cacheTime
                }
                return cacheConfig
            }
        } catch {
            message.warning('缓存配置不为空')
            throw new Error()
        }
    }


    render() {
        const cacheEnable = this.state.cacheEnable
        return (
            <div id={"anchor-cache"}>
                <Divider orientation="left" plain>
                    <ApiTwoTone /><span style={{color: "#1890ff"}}> 缓存配置</span>
                </Divider>
                <Form
                 labelCol={{
                    span: 3,
                  }}
                  wrapperCol={{
                    span: 15,
                  }}
                  layout="horizontal"
                  ref={this.cacheRef}>
                    <Form.Item
                    label="是否缓存"
                    name="cacheEnable"
                    style={{ width: '65%' }}
                    valuePropName='checked'>
                        <Switch checkedChildren="是" unCheckedChildren="否" onChange={this.onChangeChecked}/>
                    </Form.Item>
                    {cacheEnable === true ? (
                        <div>
                            <Form.Item
                            label="缓存时间"
                            name="cacheTtl"
                            style={{ width: '65%' }}>
                                <Input placeholder="请输入缓存时间" />
                            </Form.Item>
                            <Form.Item
                            label="缓存时间段"
                            name="cacheTime"
                            style={{ width: '65%' }}>
                                <Input placeholder="请输入缓存时间段,例如11:22-22:11,11:11-22:22" />
                            </Form.Item>
                        </div>
                    ) : null}
                </Form>
            </div>
        )
    }
}