/**
 * page首页
 */


import React from 'react'
import { Row, Col } from 'antd'
import DonutChart from '../../components/charts/donut'
import LineChart from '../../components/charts/line'
import ColumnChart from '../../components/charts/column'
import './index.less'
import { connect } from 'react-redux'

class Page extends React.Component {

    componentDidMount() {
        // 面包屑设置
        const titleList = [{
            key: this.props.match.path,
            title: '系统首页'
        }]
        this.props.changeBreadList(titleList)
    }

    render() {
        return (
            <div className="home-page">
                <Row>
                    <Col span={12}>
                        <div className="welcome-box"></div>
                    </Col>
                    <Col span={12}>
                        <DonutChart />
                    </Col>
                    <Col span={12}>
                        <LineChart />
                    </Col>
                    <Col span={12}>
                        <ColumnChart />
                    </Col>
                </Row>
                
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


export default connect(mapStateToProps, mapDispatchToProps)(Page)