/**
 * login
 */


import React from 'react'
import { Form, Input, Button, Select } from 'antd'
import { UserOutlined, LockOutlined, EyeTwoTone,EyeInvisibleOutlined } from '@ant-design/icons'
import './index.less'
import { setStorage } from '../../utils/commons'
import { connect } from 'react-redux'

class Login extends React.Component {
    componentDidMount () {
      localStorage.clear()
    }

    onFinish = values => {
      if (values) {
        const userId = values.userId
        const breadcrumb = [{
            key: '/home',
            title: '系统首页'
        }]
        setStorage("userId", userId)
        setStorage("breadcrumb", JSON.stringify(breadcrumb))
        this.props.changeBreadList(breadcrumb)
        this.props.history.push(
          "/home"
        )
      }
    }

    render() {
        return (
          <div className="sys-login">
            <div className="login-area">
              <div className="form-group">
              <div className="title">
                  NLP车载对话管理平台
              </div>
              <Form
                  name="normal_login"
                  className="login-form"
                  initialValues={{
                    language: 'CH',
                    userId: 1,
                    password: 'pachira123'
                  }}
                  onFinish={this.onFinish}
                >
                  <Form.Item
                    name="language"
                    rules={[
                      {
                        required: true,
                        message: '请选择语言',
                      },
                    ]}
                  >
                    <Select>
                      <Select.Option value="CH">中文</Select.Option>
                      <Select.Option value="EN">English</Select.Option>
                      <Select.Option value="CHTW">中文繁體</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="userId"
                    rules={[
                      {
                        required: true,
                        message: '请输入用户名',
                      },
                    ]}
                  >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: '请输入密码',
                      },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      placeholder="密码"
                      autoComplete="true"
                      iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                  </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" className="login-form-button">
                    Log in
                  </Button>
                </Form.Item>
              </Form>
              </div>
            </div>
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


export default connect(mapStateToProps, mapDispatchToProps)(Login)