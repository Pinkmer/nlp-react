/**
 * task-config-持续录音时长
 */

import React from 'react'
import { Divider, Slider, InputNumber, Row, Col, Tooltip } from 'antd'
import { BulbTwoTone } from '@ant-design/icons'

export default class RecordingConfig extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            recording: 0
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.config !== nextProps.config){
            const config = JSON.stringify(nextProps.config)
            const propsConfig = JSON.parse(config)
            if (config === '{}') {
                this.setState({
                    rate: 6
                })
            } else { 
                this.setState({
                    rate: propsConfig.score
                })
            }
        }
    }

    /**
     * 切换类型
     */
    onChangeRecroding = value => {
        this.setState({
            recording: value,
        })
    }

    /**
     * 获取此表单数据数据
     */
    getRecordingFormValue  = () => {
        const recordingConfig = {
            recording: this.state.recording
        }
        return recordingConfig
    }

    render() {
        const {recording} = this.state
        return (
            <div id={"anchor-recording"}>
                <Divider orientation="left" plain>
                    <Tooltip placement="right" title="设定当前意图完成后等待下一轮意图识别的语音监听时长" >
                        <BulbTwoTone /><span style={{color: "#1890ff"}}> 持续录音时长</span>
                    </Tooltip>
                </Divider>
                <Row>
                    <Col span={12}>
                    <Slider
                        min={0}
                        max={3600}
                        onChange={this.onChangeRecroding}
                        value={typeof recording === 'number' ? recording : 0}
                    />
                    </Col>
                    <Col span={4}>
                    <InputNumber
                        min={0}
                        max={3600}
                        style={{ margin: '0 16px' }}
                        value={recording}
                        onChange={this.onChangeRecroding}
                    />
                    </Col>
                </Row>
            </div>
        )
    }
}