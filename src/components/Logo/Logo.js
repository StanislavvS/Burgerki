import React from 'react';

import Image from '../../assets/images/burger-logo.png'
import classes from './Logo.css'

const logo = (props) => (
    <div className = {classes.Logo} >
        <img src = {Image} alt= "MyBurger"/>
    </div>
)

export default logo