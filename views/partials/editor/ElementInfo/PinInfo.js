import React from 'react'
import ElementInfo from './ElementInfo.js'
import {PositionRow,FixturesRow} from './ElementInfoRows.js';
class PinInfo extends ElementInfo{
    rows(){
        return <div>
            <PositionRow updateElement={this.updateElement.bind(this)} element={this.props.element} />
            <FixturesRow element={this.props.element} />

        </div>
    }
}
export default PinInfo;