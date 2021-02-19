/**
 * 404
 */

import React from 'react'
import { Result, Button } from 'antd'
export default class NoMatch extends React.Component {

    render() {
        return (
            <div style={{textAlign:'center',fontSize:'24'}}>
                <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, the page you visited does not exist."
                    extra={<Button type="primary">Back Home</Button>}
                />
            </div>
        );
    }
}