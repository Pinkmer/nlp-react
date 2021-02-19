/**
 * add-model
 */

import React from 'react'
import { Button, Modal, Form, Input } from 'antd'

export default class AddModel extends React.Component {
    formRef = React.createRef()

    constructor(props){
        super(props);
        this.state = {}
    }

    
    /**
     * 新建
     */
    showAddModal = () => {
        this.setState({
            addVisible: true,
        })
    }

    /**
     * 提交新建
     */
    handleSubmit = value => {
        this.props.submitAdd(value)
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
        this.formRef.current.resetFields();
    }


    render() {
        return (
            <div>
                <Modal
                title={this.props.title}
                visible={this.props.addVisible}
                footer={null}
                destroyOnClose="true"
                onCancel={this.handleCancle}
                >
                    <Form ref={this.formRef} name="control-ref" onFinish={this.handleSubmit}>
                    <Form.Item
                        name="name"
                        label="名称"
                        rules={[
                        {required: true,message: '请输入名称'},
                        ]}
                    >
                        <Input placeholder="支持中、英、数字、下划线，不超过30个字" maxLength="30" />
                    </Form.Item>
                    <Form.Item style={{textAlign: "right"}}>
                        <Button type="primary" htmlType="submit" loading={this.props.btnLoading} style={{marginRight: "10px"}}>
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