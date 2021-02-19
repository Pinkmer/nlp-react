/**
 * task-config-优先级
 */

import React from 'react'
import { Divider, Rate, Tooltip } from 'antd'
import { BulbTwoTone } from '@ant-design/icons'

export default class ScoreConfig extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            rate: 6
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
     * 切换等级
     */
    handleChangeScore = rate => {
        this.setState({ rate })
    }

    /**
     * 获取此表单数据数据
     */
    getScoreFormValue  = () => {
        const scoreConfig = {
            score: this.state.rate
        }
        return scoreConfig
    }

    render() {
        const {rate} = this.state
        return (
            <div id={"anchor-score"}>
                <Divider orientation="left" plain>
                    <Tooltip placement="right" title="当前意图的优先级，同比的是对话场景下同一级里的其他意图" >
                        <BulbTwoTone /><span style={{color: "#1890ff"}}> 优先级</span>
                    </Tooltip>
                </Divider>
                <span>
                    <Rate count="10" onChange={this.handleChangeScore} value={rate} />
                    <span style={{margin: "0 10px"}}>{rate}级</span>
                </span>
            </div>
        )
    }
}