/**
 * add-model
 */

import React from 'react'
import { Button, Modal, Form, Input } from 'antd'

export default class AddDictModel extends React.Component {
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
        });
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
                title='添加词条'
                visible={this.props.addVisible}
                footer={null}
                destroyOnClose="true"
                onCancel={this.handleCancle}
                >
                    <Form ref={this.formRef} name="control-ref" onFinish={this.handleSubmit}>
                    <Form.Item
                        name="keyword"
                        label="标准词"
                        rules={[
                        {required: true,message: '标准词不为空'},
                        ]}
                    >
                        <Input placeholder="仅支持汉字或字母开头，包含汉字、字母、数字，小于100" maxLength="100" />
                    </Form.Item>
                    <Form.Item
                        name="synonym"
                        label="同义词"
                        rules={[
                            {required: true,message: '同义词不为空'},
                        ]}
                    >
                        <Input.TextArea placeholder="仅支持汉字或字母开头，包含汉字、字母、数字，以英文逗号分隔，长度不限" />
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