/**
 * content-config
 */

import React from 'react'
import { Anchor, PageHeader, Button, Row, Col, message, Spin } from 'antd'
import Base from '../../../components/content/base'
import Url from '../../../components/content/url'
import Metion from '../../../components/content/metion'
import Cache from '../../../components/content/cache'
import CONTENTAPI from '../../../api/contentApi'
import { handleAxios, getStorageUserId } from '../../../utils/commons'
import { connect } from 'react-redux'

class ContentConfig extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            contentLoading: false,
            subTitle: '',
            version: '',
            id: '',
            name: '',
            config: {},
        }
    }

    componentDidMount(){
        this.initialise()
        // 面包屑设置
        let hasBread = this.props.breadList
        hasBread.splice(2)
        if (localStorage.getItem('contentConfigType') === 'edit') {
            const currentBread = {
                key: this.props.match.url,
                title: '编辑：' + localStorage.getItem('contentConfigName')
            }
            hasBread.push(currentBread)
        } else {
            const currentBread = {
            key: this.props.match.url,
            title: '新建：' + localStorage.getItem('contentConfigName')
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
        let skillConfig = document.getElementsByClassName('content-config')
        skillConfig[0].scrollIntoView({block: 'start', behavior: 'smooth'})
    }

    /**
     * 初始化
     */
    initialise = () => {
        this.setState({contentLoading: true})
        const stateType = localStorage.getItem('contentConfigType')
        if (stateType !== undefined) {
            if (stateType === 'add') {
                // 新建-模式下
                const stateName = localStorage.getItem('contentConfigName')
                if (stateName === undefined) {
                    message.info('页面加载失败..请返回上一层 重新进入')
                } else {
                    console.log('新建')
                    this.setState({
                        subTitle: '新建内容源',
                        contentLoading: false,
                        type: stateType,
                        name: stateName
                    })
                }
            } else {
                // 编辑-模式下
                const stateId = localStorage.getItem('contentConfigId')
                if (stateId === undefined) {
                    message.info('页面加载失败..请返回上一层 重新进入')
                } else {
                    console.log('编辑')
                    this.setState({
                        subTitle: '编辑内容源',
                        type: stateType,
                        id: stateId
                    }, () => {
                        this.getContentConfig(stateId)
                    })
                }
            }
        } else {
            message.info('页面加载失败..请返回上一层 重新进入')
        }
    }

    /**
     * 获取配置参数
     */
    getContentConfig = async (id) => {
        const userId = getStorageUserId()
        if (!userId) {
            this.props.history.push('/login')
            return
        }
        let data = {
            userId: userId,
            contentId: id
          }
        const res = await CONTENTAPI.queryContentConfig(data)
        const resData = handleAxios.handleRes(res)
        if (resData) {
            this.setState({
                contentLoading: false,
                version: resData.version,
                id: resData.id,
                name: resData.name,
                config: resData
            })
        } else {
            this.setState({contentLoading: false})
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

        let urlConfig = this.refs.Urlref.getUrlValidate()
        promiseArr.push(urlConfig)

        let metionConfig = this.refs.Metionref.getMethodValidate()
        promiseArr.push(metionConfig)

        let cacheConfig = this.refs.Cacheref.getCacheValidate()
        promiseArr.push(cacheConfig)

        Promise.all(promiseArr).then(res => {
            let submitConfig = [...res]
            let base = submitConfig[0]
            let url = submitConfig[1]
            let metion = submitConfig[2]
            let cache = submitConfig[3]
            const userId = getStorageUserId()
            if (!userId) {
                this.props.history.push('/login')
                return
            }
            let addOther = {
                userId: userId,
                typeId: this.props.match.params.contentId,
                version: this.state.version
            }
            let editOther = {
                userId: userId,
                contentId: this.state.id,
                typeId: this.props.match.params.contentId,
                version: this.state.version
            }
            let addData = {
                ...base,
                ...url,
                ...metion,
                ...cache,
                ...addOther
            }
            let editData = {
                ...base,
                ...url,
                ...metion,
                ...cache,
                ...editOther
            }
            if (this.state.type === 'edit') {
                this.submitEditContent(editData).then(res => {
                    this.setState({contentLoading: false})
                    this.initialise()
                    this.scrollTop()
                })
            } else {
                this.submitAddContent(addData).then(res => {
                    this.setState({contentLoading: false})
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
    submitAddContent = async (data) => {
        this.setState({contentLoading: true})
        const res = await CONTENTAPI.addContentInfo(data)
        handleAxios.handleRes(res)
    }

    /**
     * 提交编辑axios
     */
    submitEditContent = async (data) => {
        this.setState({contentLoading: true})
        const res = await CONTENTAPI.updateContentInfo(data)
        handleAxios.handleRes(res)
    }


    render() {
        const {
            subTitle,
            contentLoading,
            name,
            config
        } = this.state
        return (
            <div className="content-config">
                {/* 页头 */}
                <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title="内容源配置"
                subTitle={subTitle} />
                <Row>
                    <Col span={3}>
                        {/* 锚点导航 */}
                        <Anchor getContainer={()=>document.getElementById('content-wapper')}>
                            <Anchor.Link>
                                <div onClick={() => this.scrollToAnchor('anchor-base')} className="anchorspan">基本信息</div>
                            </Anchor.Link>
                            <Anchor.Link>
                                <div onClick={() => this.scrollToAnchor('anchor-url')} className="anchorspan">URL配置</div>
                            </Anchor.Link>
                            <Anchor.Link>
                                <div onClick={() => this.scrollToAnchor('anchor-metion')} className="anchorspan">处理方式</div>
                            </Anchor.Link>
                            <Anchor.Link>
                                <div onClick={() => this.scrollToAnchor('anchor-cache')} className="anchorspan">缓存配置</div>
                            </Anchor.Link>
                            <Anchor.Link>
                                <div onClick={() => this.scrollToAnchor('submit-btn')} className="anchorspan">提交保存</div>
                            </Anchor.Link>
                        </Anchor>
                    </Col>
                    <Col span={21}>
                        <div id={"content-wapper"}>
                            {/* 按板块引入组件 */}
                            <Spin spinning={contentLoading}>
                                {/* 基本信息 */}
                                <Base ref="Baseref" name={name} config={config} />
                                {/* URL配置 */}
                                <Url ref="Urlref" config={config} />
                                {/* 处理方式 */}
                                <Metion ref="Metionref" config={config} />
                                {/* 缓存 */}
                                <Cache ref="Cacheref" config={config} />
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(ContentConfig)