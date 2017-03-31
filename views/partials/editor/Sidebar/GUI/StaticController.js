'use strict;'
import React from 'react'
import _ from 'lodash'
import classNames from 'classnames';
import {KeyCallbackComponent} from '../../helpers.js';
class StaticController extends React.Component{
    render(){

        return <div>
          <span className="prop">{this.props.name}</span>
          <span className="value">{this.props.value}</span>           
       </div>;
    }
}
export default StaticController;