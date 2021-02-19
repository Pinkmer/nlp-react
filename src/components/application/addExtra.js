/**
 * add-model
 */

import React from 'react'
import { Button, Modal, Form, Input } from 'antd'

export default class AddExtraModel extends React.Component {
    addExtraRef = React.createRef()

    constructor(props){
        super(props);
        this.state = {
        }
    }


    /**
     * 提交新建
     */
    submitExtra = value => {
        this.props.submitExtra(value)
    }

     /**
     * 取消新建
     */
    cancleExtra = () => {
        this.props.cancleExtra()
    }

    /**
     * 清空
     */
    onReset = () => {
        this.addExtraRef.current.setFieldsValue({
            extra: ''
        })
    }


    render() {
        const initialValue = {
            extra: this.props.extra
        }
        return (
            <div>
                <Modal
                title='请输入附加字段(JSON)'
                visible={this.props.extraVisible}
                footer={null}
                destroyOnClose="true"
                onCancel={this.cancleExtra}
                >
                    <Form
                    ref={this.addExtraRef}
                    onFinish={this.submitExtra}
                    initialValues={initialValue}>
                        <Form.Item name="extra">
                            <Input placeholder="必须为JSON格式" maxLength="30" />
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