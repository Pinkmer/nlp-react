/**
 * footer
 */

import React from 'react'
import { Layout } from 'antd'
const { Footer } = Layout

export default class FooterCopy extends React.Component {
    render() {
        return (
            <Layout>
                <Footer style={{ textAlign: 'center', padding: '10px 50px' }}>NLP Management ©2020 Created by NLP</Footer>
            </Layout>
        )
    }
}
