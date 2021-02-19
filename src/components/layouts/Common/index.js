/**
 * common
 */

import React from 'react'
import { Layout } from 'antd'
import HeaderNav from '../Header'
import BreadcrumbNav from '../Breadcrumb'
import FooterCopy from '../Footer'
import './index.less'
const { Content } = Layout

export default class Common extends React.Component {
    render() {
        return (
            <Layout>
                <HeaderNav/>
                <Content style={{ padding: '8px 50px' }}>
                    <BreadcrumbNav />
                </Content>
                <Layout className="site-layout-background" style={{ margin: '0px 45px' }}>
                    <Content style={{ padding: '0 20px'}}>
                        {this.props.children}
                    </Content>
                </Layout>
                <FooterCopy />
            </Layout>
        )
    }
}