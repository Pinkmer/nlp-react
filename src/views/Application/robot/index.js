/**
 * application-robot
 */

import React from 'react'
import { Row, Col, PageHeader, Divider, message } from 'antd'
import {SettingTwoTone, MessageTwoTone  } from '@ant-design/icons'
import ConfigSkill from '../../../components/application/configSkill'
import ConfigInfo from '../../../components/application/configInfo'
import Chat from '../../../components/application/chat'
import APPLICATIONAPI from '../../../api/applicationApi'
import { handleAxios, getStorageUserId } from '../../../utils/commons'
import { connect } from 'react-redux'
import './index.less'

class Robot extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            appKey: '',
            appId: this.props.match.params.appId,
            version: 0,
            config: {},
            name: '',
        }
    }

    componentDidMount(){
        this.getApplicationInfo()
        // 面包屑设置
        let hasBread = this.props.breadList
        hasBread.splice(1)
        const currentBread = {
          key: this.props.match.url,
          title: this.props.match.params.appName
        }
        hasBread.push(currentBread)
        this.props.changeBreadList(hasBread)
    }

    /**
     * 获取当前机器人信息
     */
    getApplicationInfo = async () => {
        const userId = getStorageUserId()
        if (!userId) {
            this.props.history.push('/login')
            return
        }
        let data = {
            userId: userId,
            applicationId: this.props.match.params.appId
        }
        const res = await APPLICATIONAPI.getApplicationInfo(data)
        const resData = handleAxios.handleRes(res)
        if (resData) {
            this.setState({
                appKey: resData.appKey,
                config: resData.config,
                version: resData.version,
                name: resData.name,
            })
        } else {
            message.info('未获取到信息，请重新登陆或检查网络')
        }
    }

    /**
     * 保存更新
     */
    saveSubmit = async (values) => {
        const submitValue = JSON.stringify(values)
        const userId = getStorageUserId()
        if (!userId) {
            this.props.history.push('/login')
            return
        }
        let data = {
            userId: userId,
            applicationId: this.props.match.params.appId,
            config: submitValue,
            context: '',
            description: '',
            name: this.state.name,
            projectType: '',
            version: this.state.version
        }
        const res = await APPLICATIONAPI.reloadApplication(data)
        handleAxios.handleRes(res)
    }

    render() {
        const {
            appKey,
            appId,
            config
        } = this.state
        return (
            <div className="robot">
                {/* 页头 */}
                <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={"机器人-" + this.props.match.params.appName}
                subTitle={'密匙：' + appKey}
                ></PageHeader>
                <Row>
                    <Col span={14}>
                        {/* 机器人对话框 */}
                        <Divider orientation="left" plain>
                            <MessageTwoTone />
                            <span style={{color: "#1890ff"}}> 机器人对话窗口</span>
                        </Divider>
                        <Chat appKey={appKey} />
                    </Col>
                    <Col span={10} className="config-box">
                        {/* 技能配置 */}
                        <Divider orientation="left" plain>
                            <SettingTwoTone />
                            <span style={{color: "#1890ff"}}> 技能配置</span>
                        </Divider>
                        <ConfigSkill appId={appId} />
                        {/* 信息配置 */}
                        <Divider orientation="left" plain>
                            <SettingTwoTone />
                            <span style={{color: "#1890ff"}}> 信息配置</span>
                        </Divider>
                        <ConfigInfo config={config} saveSubmit={this.saveSubmit} />
                    </Col>
                </Row>
            </div>
        )
    }
}

// react-redux
const mapStateToProps = state => {
    return {
        breadList: state.breadList
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeBreadList(e) {
            let action = {
                type: 'changeBreadList',
                breadList: e
            }
            dispatch(action)
        },
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Robot)