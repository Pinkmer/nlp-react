import React from 'react'
import {UnControlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/lib/codemirror.css'
import 'codemirror/lib/codemirror.js'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/clike/clike'
import FullScreenCode from './fullscreen'
 
export default class CodeComponent extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            jscript: '//javascript编辑器 例如：var a = 0'
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.busJSCode !== nextProps.busJSCode){
            if (nextProps.busJSCode !== '') {
                this.setState({
                    jscript: nextProps.busJSCode
                })
            }
        }
    }

    /**
     * 获取处理数据
     */
    pushPropsValue= () => {
        const jsconfig = this.state.jscript
        if (jsconfig === '//javascript编辑器 例如：var a = 0') {
            return ''
        } else {
            return jsconfig
        }
    }

    /**
     * 获取处理数据
     */
    handleSaveCode = (value) => {
        this.setState({
            jscript: value
        })
    }

    
    render() {
        const {jscript} = this.state
        return (
            <div>
                <CodeMirror
                    value={jscript}
                    options={{
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
                {/* 全屏编辑弹窗 */}
                <FullScreenCode jscript={jscript} handleSaveCode={this.handleSaveCode} />
            </div>
        );
    }
}