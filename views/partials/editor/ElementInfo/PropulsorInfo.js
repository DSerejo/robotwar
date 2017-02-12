import React from 'react'
import ElementInfo from './ElementInfo.js'
import {PositionRow, SizeRow, AngleRow,CustomPropRow,ActionKeyRow} from './ElementInfoRows.js';
class PropulsorInfo extends ElementInfo{
    rows(){
        return <div>
            <PositionRow updateElement={this.updateElement.bind(this)} element={this.props.element} />
            <SizeRow static={true} element={this.props.element} />
            <AngleRow updateElement={this.updateElement.bind(this)} element={this.props.element} />
            <CustomPropRow prop="Force" updateElement={this.updateElement.bind(this)} element={this.props.element} />
            <ActionKeyRow prop="Start" updateElement={this.updateElement.bind(this)} element={this.props.element}/>
        </div>
    }
}
module.exports = PropulsorInfo;