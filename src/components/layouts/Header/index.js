/**
 * header
 */

import React from 'react'
import { Layout, Menu, Avatar, Dropdown   } from 'antd'
import { NavLink, Link } from 'react-router-dom'
import logo from '../../../logo.svg'
import avatarPic from '../../../assets/bot-13.png'
import './index.less'
import MenuConfig from '../../../utils/menuConfig'
import store from '../../../redux/store/index'

const { Header } = Layout

export default class HeaderNav extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            defaultSelectedKeys: []
        }
        store.subscribe(() => {
            this.handleDefaultSelect()
        })
    }

    componentDidMount() {
        this.handleDefaultSelect()
    }

    UNSAFE_componentWillMount(){
        const menuTreeNode = this.renderMenu(MenuConfig)
        this.setState({
            menuTreeNode
        })
    }

    /**
     * 菜单默认处理
     */
    handleDefaultSelect = () => {
        const stateStore = store.getState().breadList
        const selectKey = JSON.stringify(stateStore)
        this.setState({
            defaultSelectedKeys: selectKey
        })
    }

    /**
     * 菜单渲染
     */
    renderMenu =(data)=>{
        return data.map((item)=>{
            return <Menu.Item key={item.key}>
                <NavLink to={item.key}>{item.title}</NavLink>
            </Menu.Item>
        })
    }


    
    render() {
        const menu = (
            <Menu>
                <Menu.Item>
                    <span className="label">欢迎用户：{localStorage.getItem('userId')}</span>
                </Menu.Item>
                <Menu.Item>
                <div>
                <Link to="/login"><span className="label">退出登录</span></Link>
                </div>
                </Menu.Item>
            </Menu>
          )
          const {defaultSelectedKeys} = this.state
        return (
            <Layout>
                <Header className="header">
                    <div className="header-title">
                        <img src={logo} className="header-logo" alt="logo" />
                        NLP对话管理系统
                    </div>
                    <Menu theme="dark" mode="horizontal" selectedKeys={defaultSelectedKeys}>
                        { this.state.menuTreeNode }
                        <div className="tool">
                            <Dropdown overlay={menu} placement="bottomCenter" className="dropMenu">
                                <Avatar src={avatarPic} size="default"/>
                            </Dropdown>
                        </div>
                    </Menu>
                </Header>
            </Layout>
        )
    }
}
