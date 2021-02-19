
import React from 'react'
import { Modal, Button } from 'antd'
import {UnControlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/lib/codemirror.css'
import 'codemirror/lib/codemirror.js'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/clike/clike'
import './fullscreen.less'

export default class FullScreenCode extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            fullScreenVisible: false,
            jscript: ''
        }
    }


    showModal = () => {
        this.setState({
            jscript: this.props.jscript,
            fullScreenVisible: true
        })
    }

    handleSaveCode = () => {
        this.props.handleSaveCode(this.state.jscript)
        this.setState({
            fullScreenVisible: false
        })
    }
    
    handleCancel = () => {
        this.setState({
            fullScreenVisible: false
        })
    }

  render() {
      const {fullScreenVisible, jscript} = this.state
    return (
      <div>
        <Button type="link" onClick={this.showModal}>全屏编辑</Button>
        <Modal
          title="javascript编辑器"
          visible={fullScreenVisible}
          width="90%"
          centered={true}
          onOk={this.handleSaveCode}
          onCancel={this.handleCancel}
        >
            <div className="modalStyle">
            <CodeMirror
             className="fullScreen"
                    value={jscript}
                    options={{
                        height:"500px",
                        mode: { name: "text/javascript" },
                        extraKeys: { "Ctrl": "autocomplete" },
                        autofocus: false,
                        lineWrapping: false,
                        theme: 'monokai',
                        lineNumbers: true
                    }}
                    onChange={(editer, data, value) => {
                        this.setState({
                            jscript: value
                        })
                    }}
                />
                </div>
        </Modal>
      </div>
    );
  }
}
