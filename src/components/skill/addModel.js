/**
 * 添加task弹窗
 */

import React from 'react'
import { Button, Modal, Form, Input } from 'antd'

export default class addTaskModel extends React.Component {
    addTaskRef = React.createRef()

    constructor(props){
        super(props);
        this.state = {}
    }



    /**
     * 提交新建
     */
    handleSubmit = value => {
        this.props.handleSubmit(value)
    }

     /**
     * 取消新建
     */
    handleCancle = () => {
        this.props.handleCancle()
    }

    /**
     * 清空
     */
    onReset = () => {
        this.addTaskRef.current.resetFields();
    }


    render() {
        return (
            <div>
                <Modal
                title="新建任务"
                visible={this.props.addVisible}
                footer={null}
                destroyOnClose="true"
                onCancel={this.handleCancle}
                >
                    <Form ref={this.addTaskRef} name="control-ref" onFinish={this.handleSubmit}>
                        <Form.Item
                            name="name"
                            label="名称"
                            rules={[
                            {required: true,message: '请输入名称'},
                            ]}
                        >
                            <Input  placeholder="支持中、英、数字、下划线，不超过30个字" maxLength="30" />
                        </Form.Item>
                        <Form.Item
                            name="intention"
                            label="意图"
                            rules={[
                            {required: true,message: '请输入意图'},
                            ]}
                        >
                            <Input placeholder="仅支持英文小写、下划线" />
                        </Form.Item>
                        <Form.Item style={{textAlign: "right"}}>
                            <Button type="primary" htmlType="submit" style={{marginRight: "10px"}}>
                            确定
                            </Button>
                            <Button htmlType="button" onClick={this.onReset}>
                            清空
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }

}