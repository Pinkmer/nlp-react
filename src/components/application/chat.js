/**
 * chat-robot
 */

import React from 'react'
import { Row, Col, Input, Button, Empty, message  } from 'antd'
import { CopyTwoTone, TagsTwoTone } from '@ant-design/icons'
import  { getRandom, getNowTime, handleAxios } from '../../utils/commons'
import APPLICATIONAPI from '../../api/applicationApi'
import Clipboard from 'clipboard'
import AddExtraModel from './addExtra'

export default class Chat extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            jsontext: '',
            jsontexts: '',
            talkBlock: [],
            inputValue: '',
            random: '',
            extra: '',
            extraVisible: false
        }
    }
    componentDidMount() {
        this.init()
    }

    /**
     * 滚动条定位到底端
     */
    scrollToBottom() {
        let div = document.getElementById('chatmain')
        if (div !== undefined) {
            if (div !== null) {
                div.scrollTop = div.scrollHeight
            }
        }
    }

    /**
     * 初始化
     */
    init = () => {
        const res = getRandom()
        this.setState({
            random: res
        })
    }

    /**
     * 发送对话
     */
    talkSend = async e => {
        e.preventDefault()
        const sendWords = this.state.inputValue
        if (sendWords) {
            const sendTime = new Date().getTime()
            const currentTime = getNowTime()
            let question = {
                role: 'customer',
                time: currentTime,
                words: this.state.inputValue,
                json: ''
            }
            this.setState({
                talkBlock: [...this.state.talkBlock, question],
                inputValue: ''
            })
            let newExtra = ''
            if (this.state.extra === '' || this.state.extra === null) {
                newExtra = ''
            } else {
                newExtra = this.state.extra
            }
            let data = {
                endingId: this.state.random,
                eventId: [],
                extra: newExtra,
                isNew: '0',
                text: sendWords,
                time: sendTime
            }
            let appkey = this.props.appKey
            const res = await APPLICATIONAPI.robotSendCall(data, appkey)
            const resData = handleAxios.handleRes(res)
            if (resData.data.data) {
                let currentWords = resData.data.data.answer.tts.replace(/<audio .*wav'>/, '').replace(/<\/audio>/, '')
                let answer = {
                    role: 'robot',
                    time: currentTime,
                    words: currentWords,
                    json: resData.data
                }
                this.setState({
                    talkBlock: [...this.state.talkBlock, answer]
                })
            } else {
                let answer = {
                    role: 'robot',
                    time: currentTime,
                    words: '错误提示：' + resData.data.message,
                    json: resData.data
                }
                this.setState({
                    talkBlock: [...this.state.talkBlock, answer]
                })
            }
            this.scrollToBottom()
        } else {
            message.warning('内容不能为空...')
            this.setState({
                inputValue: ''
            })
        }
    }

    /**
     * 输入对话
     */
    changeInput = e => {
        this.setState({
            inputValue: e.target.value
        })
    }

    /**
     * 查看JSON
     */
    viewJson = (item) =>{
        const jsondisplay = JSON.stringify(item.json, null, 2)
        this.setState({ jsontext: jsondisplay })
    }

    /**
     * 复制JSON
     */
    copyJson = () => {
        const jsonWords = this.state.jsontext
        if (jsonWords) {
            let clipboard = new Clipboard('.copy-btn', {
                text: function () {
                    return jsonWords
                }
            })
            clipboard.on('success', e => {
                message.success('已复制到剪切板')
                clipboard.destroy()
            })
            clipboard.on('error', e => {
                message.error('复制失败，您可以手动复制')
                clipboard.destroy()
            })
        }
    }

    /**
     * 设置附加字段
     */
    setExtra = () => {
        this.setState({ extraVisible: true })
    }

    /**
     * 确认添加附加字段
     */
    submitExtra = value => {
        this.setState({
            extra: value.extra,
            extraVisible: false
        })
    }
    
    /**
     * 取消添加附加字段
     */
    cancleExtra = () => {
        this.setState({
            extraVisible: false
        })
    }


    render() {
        const {jsontext, inputValue, extra, extraVisible} = this.state
        return (
            <div className="chat-box">
                <div className="chat-card">
                    <div className="chat-title">
                        <span className="float-red"></span>
                        <span className="float-yello"></span>
                        <span className="float-green"></span>
                    </div>
                    <Row style={{ backgroundColor:' #ffffffb5'}}>
                        <Col span={8}>
                            <div className="json-wrapper">
                                <Button type="text" className="copy-btn" onClick={this.copyJson}><CopyTwoTone />复制JSON</Button>
                                <Button type="text" className="add-btn" onClick={this.setExtra}><TagsTwoTone />附加字段</Button>
                                <div className="result_main">
                                    {jsontext ? (
                                    <div dangerouslySetInnerHTML = {{__html: '<pre>' + jsontext + '</pre>'}} ></div>
                                    ) : 
                                    (<Empty description="暂无可查看的JSON" />)
                                    }
                                </div>
                            </div>
                        </Col>
                        <Col span={16}>
                            <div className="chat-main">
                                <div id="chatmain" className="chat-show">
                                    {this.state.talkBlock.map((item,index)=>{
                                        return <div className="chat-block" key={index}>
                                        {item.role === 'customer' ? (
                                            <>
                                            <div className="chat-time">{item.time}</div>
                                            <div className="question-wrapper">
                                                <span className="question-span">
                                                    <div className="question-text">
                                                    {item.words}
                                                    </div>
                                                </span>
                                            </div>
                                            </>
                                        ) : (
                                            <div className="answer-wrapper">
                                                <span className="answer-span">
                                                    <div className="answer-text">
                                                        <div dangerouslySetInnerHTML = {{__html: item.words }} ></div>
                                                    </div>
                                                </span>
                                                <Button type="link" onClick={() =>this.viewJson(item)}>查看</Button>
                                            </div>
                                        )
                                    }
                                    </div>
                                    })}
                                </div>
                                <div className="chat-send">
                                    <Input.TextArea
                                    rows={3}
                                    value={inputValue}
                                    allowClear
                                    placeholder="可以按回车Enter键发送"
                                    onChange={this.changeInput}
                                    onPressEnter={this.talkSend} />
                                    <div className="send-btn">
                                        <Button type="primary" disabled={inputValue===''} onClick={this.talkSend}>发送</Button>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            
                {/* 添加附加字段弹窗 */}
                <AddExtraModel extraVisible={extraVisible} extra={extra} cancleExtra={this.cancleExtra} submitExtra = {this.submitExtra} />
            </div>
        )
    }
}