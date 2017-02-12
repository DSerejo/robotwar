import React from 'react'
import ElementInfo from './ElementInfo.js'
import {PositionRow, SizeRow, AngleRow,CustomPropRow,JoinedRow} from './ElementInfoRows.js';
class BoxInfo extends ElementInfo{
    rows(){
        return <div>
            <CustomPropRow static={true} prop="Material" element={this.props.element} />
            <PositionRow updateElement={this.updateElement.bind(this)} element={this.props.element} />
            <SizeRow updateElement={this.updateElement.bind(this)} element={this.props.element} />
            <AngleRow updateElement={this.updateElement.bind(this)} element={this.props.element} />
            <JoinedRow element={this.props.element} />
        </div>
    }
}
export default BoxInfo;