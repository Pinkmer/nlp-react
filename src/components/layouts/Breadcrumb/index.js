/**
 * breadcrumb
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { Layout, Breadcrumb } from 'antd'
import { connect } from 'react-redux'
import store from '../../../redux/store/index'

class BreadcrumbNav extends React.Component {
    constructor(props){
        super(props);
        this.state = store.getState()
        store.subscribe(() => {
            this.setState(store.getState())
        })
    }
    
    componentDidMount() {
        this.setState(store.getState())
    }


    render() {
        return (
            <Layout>
                <Breadcrumb style={{ margin: '10px 0' }}>
                    {this.state.breadList.map((item)=>{
                        return  <Breadcrumb.Item key={item.key}>
                            <Link to={item.key}>{item.title}</Link> 
                        </Breadcrumb.Item>
                    })}
                </Breadcrumb>
            </Layout>
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

export default connect(mapStateToProps, mapDispatchToProps)(BreadcrumbNav)
