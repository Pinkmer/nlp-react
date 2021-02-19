/**
 * task-config
 */

import React from 'react'
import { Anchor, PageHeader, Button, Row, Col, Spin, message } from 'antd'
import Base from '../../../components/skill/base'
import Events from '../../../components/skill/events'
import Grammar from '../../../components/skill/grammars'
import Model from '../../../components/skill/model'
import Slots from '../../../components/skill/slots'
import SlotMerge from '../../../components/skill/slotMerge'
import Content from '../../../components/skill/content'
import Answer from '../../../components/skill/answer'
import Tags from '../../../components/skill/tags'
import Recommend from '../../../components/skill/recommend'
import Score from '../../../components/skill/score'
import Goto from '../../../components/skill/goto'
import Recording from '../../../components/skill/recording'
import './index.less'
import SKILLAPI from '../../../api/skillApi'
import { handleAxios, getStorageUserId } from '../../../utils/commons'
import { connect } from 'react-redux'

class SkillConfig extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            subTitle: '',
            skillLoading: false,
            type: '',
            version: 0,
            id: 0,
            name: '',
            intention: '',
            config: {},
        }
    }

    componentDidMount(){
        this.initialise()
        // 面包屑设置
        let hasBread = this.props.breadList
        hasBread.splice(2)
        if (localStorage.getItem('taskConfigType') === 'edit') {
            const currentBread = {
                key: this.props.match.url,
                title: '编辑：' + localStorage.getItem('taskConfigName')
            }
            hasBread.push(currentBread)
        } else {
            const currentBread = {
            key: this.props.match.url,
            title: '新建：' + localStorage.getItem('taskConfigName')
            }
            hasBread.push(currentBread)
        }
        this.props.changeBreadList(hasBread)
    }


    scrollToAnchor = (anchorName) => {
        if (anchorName) {
            let anchorElement = document.getElementById(anchorName);
            if (anchorElement) {
                anchorElement.scrollIntoView({block: 'start', behavior: 'smooth'})
            }
        }
    }

    scrollTop = () => {
        let skillConfig = document.getElementsByClassName('skill-config')
        skillConfig[0].scrollIntoView({block: 'start', behavior: 'smooth'})
    }

    /**
     * 初始化
     */
    initialise = () => {
        this.setState({skillLoading: true})
        // 页面刷新丢失state状态下需catch
        const stateType = localStorage.getItem('taskConfigType')
        if (stateType === undefined) {
            message.info('页面加载失败..请返回上一层 重新进入')
        } else {
            if (stateType === 'add') {
                // 新建-模式下
                const stateName = localStorage.getItem('taskConfigName')
                const stateIntention = localStorage.getItem('taskConfigIntention')
                if (stateName === undefined || stateIntention === undefined) {
                    message.info('页面加载失败..请返回上一层 重新进入')
                } else {
                    this.setState({
                        subTitle: '新建Task：' + localStorage.getItem('taskConfigName'),
                        skillLoading: false,
                        type: stateType,
                        name: stateName,
                        intention: stateIntention
                    })
                }
            } else {
                // 编辑-模式下
                const stateId = localStorage.getItem('taskConfigId')
                if (stateId === undefined) {
                    message.info('页面加载失败..请返回上一层 重新进入')
                } else {
                    this.setState({
                        subTitle: '编辑Task：' + localStorage.getItem('taskConfigName'),
                        type: stateType,
                        id: stateId
                    }, () => {
                        this.getTaskConfig(stateId)
                    })
                }
            }
        }
        
    }

    /**
     * 获取配置参数
     */
    getTaskConfig = async (id) => {
        const userId = getStorageUserId()
        if (!userId) {
            this.props.history.push('/login')
            return
        }
        let data = {
            userId: userId,
            taskId: id
          }
        const res = await SKILLAPI.queryTaskConfig(data)
        const resData = handleAxios.handleRes(res)
        if (resData) {
            this.setState({
                skillLoading: false,
                version: resData.version,
                id: resData.id,
                name: resData.name,
                intention: resData.intention,
                config: resData.config
            })
        } else {
            this.setState({skillLoading: false})
        }
    }

    /**
     * 提交新建/更新参数处理
     */
    submitAll = () => {
        let promiseArr = []
        // ------数据获取
        let baseConfig = this.refs.Baseref.getBaseValidate()
        promiseArr.push(baseConfig)

        let eventConfig = this.refs.Eventref.getEventsValidate()
        promiseArr.push(eventConfig)

        let grammarsConfig = this.refs.Grammarref.getGrammarsValidate()
        promiseArr.push(grammarsConfig)

        let modelConfig = this.refs.Modelref.getModelsValidate()
        promiseArr.push(modelConfig)

        let slotConfig = this.refs.Slotsref.getSlotsValidate()
        promiseArr.push(slotConfig)

        let slotMergeConfig = this.refs.SlotMergeref.getSlotMergesValidate()
        promiseArr.push(slotMergeConfig)

        let contentConfig = this.refs.Contentref.getContentValidate()
        promiseArr.push(contentConfig)

        let answerConfig = this.refs.Answerref.getAnswerValidate()
        promiseArr.push(answerConfig)

        let GotoConfig = this.refs.Gotoref.getGotoValidate()
        promiseArr.push(GotoConfig)

        let RecommendConfig = this.refs.Recommendref.getRecommendValidate()
        promiseArr.push(RecommendConfig)

        // 指令、优先级、推荐语无需校验
        let TagConfig = this.refs.Tagsref.getTagFormValue()
        promiseArr.push(TagConfig)

        let ScoreConfig = this.refs.Scoreref.getScoreFormValue()
        promiseArr.push(ScoreConfig)

        let RecordingConfig = this.refs.Recordingref.getRecordingFormValue()
        promiseArr.push(RecordingConfig)

        Promise.all(promiseArr).then(res => {
            let submitConfig = [...res]
            // ------数据处理 根据push进数组的顺序决定index
            const additional = {
                commands: submitConfig[10].commands,
                end: submitConfig[8].gotoEnd,
                gotos: submitConfig[8].gotos,
                models: submitConfig[3].models,
                recommends: submitConfig[9].recommends,
                recording: submitConfig[12].recording,
                start: submitConfig[0].start
            }
            const config = {
                additional: additional,
                answerType: submitConfig[7].answerType,
                answers: submitConfig[7].answers,
                content: submitConfig[6].content,
                events: submitConfig[1].events,
                grammarType: submitConfig[2].grammarType,
                grammars: submitConfig[2].grammars,
                score: submitConfig[11].score,
                slotMerge: submitConfig[5].slotMerge,
                slotMergeType: submitConfig[5].slotMergeType,
                slots: submitConfig[4].slots
            }
            const userId = getStorageUserId()
            if (!userId) {
                this.props.history.push('/login')
                return
            }
            // -----数据提交
            let addData = {
                config: config,
                intention: submitConfig[0].intention,
                name: submitConfig[0].name,
                skillId: this.props.match.params.skillId,
                userId: userId,
                version: this.state.version
            }
            let editData = {
                config: config,
                intention:  submitConfig[0].intention,
                name: submitConfig[0].name,
                taskId: this.state.id,
                userId: userId,
                version: this.state.version
            }
            if (this.state.type === 'edit') {
                this.submitEditTask(editData).then(res => {
                    this.setState({ skillLoading: false })
                    this.initialise()
                    this.scrollTop()
                })
            } else {
                this.submitAddTask(addData).then(res => {
                    this.setState({ skillLoading: false })
                    window.history.go(-1)
                })
            }
        }).catch(err => {
            console.log('校验失败')
        })
    }

    /**
     * 提交新建axios
     */
    submitAddTask = async (data) => {
        this.setState({skillLoading: true})
        const res = await SKILLAPI.addSkillTask(data)
        handleAxios.handleRes(res)
    }

    /**
     * 提交编辑axios
     */
    submitEditTask = async (data) => {
        this.setState({skillLoading: true})
        const res = await SKILLAPI.updateTaskConfig(data)
        handleAxios.handleRes(res)
    }



    render() {
        const {subTitle, skillLoading, id, intention, name, config } = this.state
        return (
            <div className="skill-config">
                {/* 页头 */}
                <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title="任务配置"
                subTitle={subTitle} />
                <Row>
                    <Col span={3}>
                        {/* 锚点导航 */}
                        <Anchor
                            getContainer={()=>document.getElementById('skill-wapper')}>
                            <Anchor.Link>
                                <div onClick={() => this.scrollToAnchor('anchor-baseinfo')} className="anchorspan">任务基本信息</div>
                            </Anchor.Link>
                            <Anchor.Link>
                                <div onClick={() => this.scrollToAnchor('anchor-events')} className="anchorspan">事件</div>
                            </Anchor.Link>
                            <Anchor.Link>
                                <div onClick={() => this.scrollToAnchor('anchor-grammars')} className="anchorspan">语法</div>
                            </Anchor.Link>
                            <Anchor.Link>
                                <div onClick={() => this.scrollToAnchor('anchor-model')} className="anchorspan">模型</div>
                            </Anchor.Link>
                            <Anchor.Link>
                                <div onClick={() => this.scrollToAnchor('anchor-slots')} className="anchorspan">语义槽</div>
                            </Anchor.Link>
                            <Anchor.Link>
                                <div onClick={() => this.scrollToAnchor('anchor-content')} className="anchorspan">内容源</div>
                            </Anchor.Link>
                            <Anchor.Link>
                                <div onClick={() => this.scrollToAnchor('anchor-answer')} className="anchorspan">回答</div>
                            </Anchor.Link>
                            <Anchor.Link>
                                <div onClick={() => this.scrollToAnchor('anchor-tags')} className="anchorspan">指令</div>
                            </Anchor.Link>
                            <Anchor.Link>
                                <div onClick={() => this.scrollToAnchor('anchor-score')} className="anchorspan">优先级</div>
                            </Anchor.Link>
                            <Anchor.Link>
                                <div onClick={() => this.scrollToAnchor('anchor-goto')} className="anchorspan">下一轮对话</div>
                            </Anchor.Link>
                            <Anchor.Link>
                                <div onClick={() => this.scrollToAnchor('anchor-recommend')} className="anchorspan">推荐语</div>
                            </Anchor.Link>
                            <Anchor.Link>
                                <div onClick={() => this.scrollToAnchor('anchor-recording')} className="anchorspan">持续时长</div>
                            </Anchor.Link>
                            <Anchor.Link>
                                <div onClick={() => this.scrollToAnchor('submit-btn')} className="anchorspan">提交保存</div>
                            </Anchor.Link>
                        </Anchor>
                    </Col>
                    <Col span={21}>
                        <div id={"skill-wapper"}>
                            {/* 按板块引入组件 */}
                            <Spin spinning={skillLoading}>
                                {/* 基本信息 */}
                                <Base ref="Baseref" id={id} intention={intention} name={name} config={config} />
                                {/* 事件 */}
                                <Events ref="Eventref" config={config} />
                                {/* 语法 */}
                                <Grammar ref="Grammarref" config={config}  />
                                {/* 模型 */}
                                <Model ref="Modelref" config={config} />
                                {/* 语义槽配置 */}
                                <Slots ref="Slotsref" config={config} />
                                <SlotMerge ref="SlotMergeref" config={config} />
                                {/* 内容源 */}
                                <Content ref="Contentref" config={config} />
                                {/* 回答 */}
                                <Answer ref="Answerref" config={config} />
                                {/* 指令 */}
                                <Tags ref="Tagsref" config={config} />
                                {/* 优先级 */}
                                <Score ref="Scoreref" config={config} />
                                {/* 下一轮对话 */}
                                <Goto ref="Gotoref" config={config} />
                                {/* 推荐语 */}
                                <Recommend ref="Recommendref" config={config} />
                                {/* 持续录音时长 */}
                                <Recording ref="Recordingref" config={config} />
                                {/* 提交保存 */}
                                <div id={"submit-btn"}>
                                    <Button type="primary" size="large" onClick={this.submitAll}>提交保存</Button>
                                </div>
                            </Spin>
                        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(SkillConfig)