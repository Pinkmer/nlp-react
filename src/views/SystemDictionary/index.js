/**
 * systemDict
 */

import React from 'react'
import { PageHeader, Row, Col, Card, } from 'antd'
import systemData from '../../utils/systemdict.json'
import QueueAnim from 'rc-queue-anim'
import { connect } from 'react-redux'

class SystemDict extends React.Component {
    constructor(props){
        super(props);
        this.state = {
           systemDictList: []
        }
    }
    componentDidMount(){
        this.setData()
        // 面包屑设置
        const titleList = [{
            key: this.props.match.path,
            title: '系统词典'
        }]
        this.props.changeBreadList(titleList)
    }

    setData = () => {
        this.setState({
            systemDictList: systemData.cardList
        })
    }

    render() {
        return (
            <div className="">
                <PageHeader
                ghost={false}
                title="系统词典"
                subTitle="系统内置词典仅支持查看"
                ></PageHeader>
                <Row>
                    {this.state.systemDictList.map((item)=>{
                        return <Col span={4} key={item.chineseMean}>
                            <QueueAnim type="right">
                                <Card
                                    key={item.chineseMean}
                                    hoverable="true"
                                    style={{ margin: "10px" }}
                                    headStyle={{ color: '#549BF4'}}
                                    extra={<span>{item.lexiconName}</span>}
                                    title={item.chineseMean}
                                    >
                                        <p>{item.briefDescription}</p>
                                        <p>{item.example}</p>
                                    </Card>
                                </QueueAnim>
                            </Col>
                        })
                    }
                </Row>
            </div>
        );
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


export default connect(mapStateToProps, mapDispatchToProps)(SystemDict)