import React, {Component} from 'react'

import Aux from '../../hoc/Aux'
import Classes from './Layout.css'
import Toolbar from '../Navigation/Toolbar/Toolbar'
import SideDrawer from '../Navigation/SideDrawer/SideDrawer'

class Layout extends Component {

    state = {
        showSideDrawer: false,
       
    }

sideDrawerCloseHandler = () => {
    this.setState({showSideDrawer: false})
}
sideDrawerToggleHandler = () => {
 this.setState((prevState)=> {return {showSideDrawer: !prevState.showSideDrawer}})
}
render () {
    return(
<Aux>
<Toolbar drawerToggle = {this.sideDrawerToggleHandler}/>
<SideDrawer open = {this.state.showSideDrawer} closed = {this.sideDrawerCloseHandler}/>
<main className = {Classes.Content}>

    {this.props.children}
</main>
</Aux>
    )
}
}

export default Layout;