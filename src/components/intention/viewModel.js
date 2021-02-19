/**
 * 查看预览意图抽屉
 */

import React from 'react'
import { Drawer, Row, Col, PageHeader, Input, Button, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const { confirm } = Modal

export default class addIntentionModel extends React.Component {
    inputRef = React.createRef()

    constructor(props){
        super(props);
        this.state = {
            name: '',
            intentionType: '',
            grammars: '',
            isEdit: false,
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.editVisible === true){
            this.setState({
                name: this.props.viewName,
                intentionType: this.props.intentionType,
                grammars: this.props.grammars
            })
        }
    }

    /** 
     * 编辑
    **/
    editView = ()=> {
         this.setState({
            intentionType: this.props.intentionType,
            grammars: this.props.grammars,
            isEdit: true
         }, () => {
            this.inputRef.current.focus()
         })
    }

    /**
     * 关闭弹窗
     */
    handleCancleView = () => {
        const this_ = this
        if (this.state.isEdit === true) {
            confirm({
                title: '现处于编辑模式，如退出将不会保存，继续操作吗？',
                icon: <ExclamationCircleOutlined />,
                okText: '继续退出',
                onOk() {
                    this_.props.handleCancleView()
                },
                onCancel() {},
            })
        } else {
            this_.props.handleCancleView()
        }
    }

    /**
     * 取消编辑
     */
    onCloseEdit = () => {
        this.setState({
            isEdit: false
         })
    }


    /**
     * 改变输入内容
     */
    changeInput = e => {
        this.setState({
            grammars: e.target.value
        })
    }

    /**
     * 提交保存编辑
     */
    onSaveEdit = () => {
        this.props.onSaveEdit(this.state.grammars)
    }
    

    render() {
        const {
            grammars,
            isEdit,
            intentionType
        } = this.state
        return (
            <div>
                <Drawer
                    width={760}
                    placement="left"
                    onClose={this.handleCancleView}
                    visible={this.props.editVisible}
                    footer={
                        <div style={{ textAlign: 'right' }} >
                            {isEdit === true ?(
                                <>
                                <Button onClick={this.onCloseEdit} style={{ marginRight: 8 }}>取消编辑</Button>
                                <Button onClick={this.onSaveEdit} type="primary">提交</Button>
                                </>
                            ):(
                            <Button onClick={this.editView} type="primary">编辑</Button>
                            )}
                        </div>
                      }
                    >
                        <PageHeader
                            onBack={this.handleCancleView}
                            title={this.props.viewName}
                            subTitle={
                            isEdit === true ? (<>编辑模式</>) : (<>预览模式</>)
                            }
                        />
                        <div style={{marginBottom: '20px'}}>意图类型（不可变更）：
                            <span>
                                {intentionType === 'system' ?(
                                    <>内置意图</>
                                ) : (
                                    <>模板意图</>
                                )}
                            </span>
                        </div>
                        <Row>
                            <Col span={24}>
                                {isEdit === true ?(
                                    <Input.TextArea
                                    ref={this.inputRef}
                                    style={{overflowY: 'scroll',height: 'calc(100vh - 225px)' }}
                                    onChange={this.changeInput}
                                    value={grammars} />
                                ):(
                                    <pre style={{wordBreak: 'break-all',wordWrap: 'break-word',whiteSpace: 'pre-wrap',overflowY: 'scroll',border: '1px solid #dfdfdf',padding: '10px',height: 'calc(100vh - 225px)', }}>
                                        {this.props.grammars}
                                    </pre>
                                )
                                }
                            </Col>
                        </Row>
                            
                    </Drawer>
            </div>
        )
    }
}