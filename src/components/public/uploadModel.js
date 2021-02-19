/**
 * upload-model
 */

import React from 'react'
import { Modal, Upload } from 'antd'
import { InboxOutlined } from '@ant-design/icons'

export default class uploadModel extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            fileList: []
        }
    }

    /**
     * 提交上传
     */
    submitUpload = () => {
        console.log(this.state.fileList)
        this.props.submitUpload(this.state.fileList)
        this.setState({
            fileList: []
        })
    }

     /**
     * 取消上传
     */
    handleCancle = () => {
        this.setState({
            fileList: []
        })
        this.props.handleCancle()
    }

    render() {
        const { fileList } = this.state
        const props = {
        onRemove: file => {
            this.setState(state => {
            const index = state.fileList.indexOf(file)
            const newFileList = state.fileList.slice()
            newFileList.splice(index, 1)
            return {
                fileList: newFileList,
            }
            })
        },
        beforeUpload: file => {
            this.setState(state => ({
                fileList: [...state.fileList, file], 
            }))
            return false
        },
        fileList,
        }

        return (
            <Modal
            title={this.props.title}
            visible={this.props.addVisible}
            destroyOnClose="true"
            okButtonProps={{disabled: fileList.length === 0}}
            onOk={this.submitUpload}
            onCancel={this.handleCancle}
            confirmLoading={this.props.uploading}>
                <Upload.Dragger  {...props}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">注意： 已有列表，仅支持一个Excel 2007以上版本的xlsx文件</p>
                </Upload.Dragger >
            </Modal>
        )
    }

}