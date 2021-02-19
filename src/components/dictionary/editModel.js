/**
 * edit-model
 */

import React from 'react'
import { Button, Modal, Form, Input } from 'antd'

export default class EditDictModel extends React.Component {
    editFormRef = React.createRef()

    constructor(props){
        super(props);
        this.state = {}
    }
    
    /**
     * 编辑
     */
    showAddModal = () => {
        this.setState({
            editVisible: true,
        });
    }

    /**
     * 提交编辑
     */
    submitEdit = value => {
        this.props.submitEdit(value)
    }

     /**
     * 取消
     */
    handleCancle = () => {
        this.props.handleCancle()
    }

    /**
     * 清空
     */
    onReset = () => {
        this.editFormRef.current.resetFields();
    }


    render() {
      const initialValue = {
        'keyword': this.props.editDict.keyword,
        'synonym': this.props.editDict.synonym
      }
        return (
            <div>
                <Modal
                title='编辑词条'
                visible={this.props.editVisible}
                footer={null}
                destroyOnClose="true"
                onCancel={this.handleCancle}
                >
                    <Form
                    ref={this.editFormRef}
                    name="control-ref"
                    onFinish={this.submitEdit}
                    initialValues={initialValue}>
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
                        <Input.TextArea
                          autoSize={{ minRows: 3, maxRows: 10 }}
                          placeholder="仅支持汉字或字母开头，包含汉字、字母、数字，以英文逗号分隔，长度不限" />
                    </Form.Item>
                    <Form.Item style={{textAlign: "right"}}>
                        <Button type="primary" htmlType="submit" loading={this.props.btnLoading} style={{marginRight: "10px"}}>
                        确定
                        </Button>
                        <Button htmlType="button" onClick={this.onReset}>
                        重置
                        </Button>
                    </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }

}