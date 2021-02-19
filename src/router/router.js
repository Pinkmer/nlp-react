import React from 'react'
import {
    HashRouter,
    Route,
    Switch,
    // Redirect
} from 'react-router-dom'
import App from '../App'
import Common from '../components/layouts/Common/index'
import Login from '../views/Login/index'
import Home from '../views/Page/index'
import Skill from '../views/Skill/SkillStore/index'
import SkillTask from '../views/Skill/SkillList/index'
import TaskConfig from '../views/Skill/SkillConfig/index'
import Intention from '../views/Intention/IntentionStore/index'
import Application from '../views/Application/ApplicationStore/index'
import Robot from '../views/Application/Robot/index'
import UserDict from '../views/UserDictionary/UserDictStore/index'
import UserDictInfo from '../views/UserDictionary/UserDictList/index'
import SystemDict from '../views/SystemDictionary/index'
import Content from '../views/Content/ContentStore/index'
import ContentInfo from '../views/Content/ContentList/index'
import ContentConfig from '../views/Content/ContentConfig/index'
import NoMatch from '../views/NoMatch/404'

export default class ERouter extends React.Component{
    render(){
        return (
            <HashRouter>
                <App>
                    <Switch>
                        <Route path="/login" component={Login}/>
                        <Route path="/" render={()=>
                            <Common>
                                <Switch>
                                    <Route path='/home'  component={Home}/>
                                    <Route path='/skill'  component={Skill}/>
                                    <Route path='/task/:skillId/:skillName'  component={SkillTask}/>
                                    <Route path='/task-config/:skillId'  component={TaskConfig}/>
                                    <Route path='/intention'  component={Intention}/>
                                    <Route path='/application'  component={Application}/>
                                    <Route path='/robot/:appId/:appName'  component={Robot}/>
                                    <Route path='/userdict'  component={UserDict}/>
                                    <Route path='/userdict-info/:userDictId/:userDictName'  component={UserDictInfo}/>
                                    <Route path='/systemdict'  component={SystemDict}/>
                                    <Route path='/content'  component={Content}/>
                                    <Route path='/content-info/:contentId/:contentName'  component={ContentInfo}/>
                                    <Route path='/content-config/:contentId'  component={ContentConfig}/>
                                </Switch>
                            </Common>
                        }/>
                        <Route path="/404" component={NoMatch} />
                    </Switch>
                </App>
            </HashRouter>
        )
    }
}