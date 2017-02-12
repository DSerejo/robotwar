import React from 'react';
import factory from './ElementInfoFactory.js';
import classNames from 'classnames';
import {calculateLayerStylesheet} from '../helpers.js';
class EmptyElement extends React.Component{
    render(){return null;}
}
class InfoLayer extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        var className = classNames({
            hide:!this.props.show,
            'editor-box':true
        });
        const ElementInfo = this.props.element?factory[this.props.element.type]:EmptyElement;
        return  <div className={className} style={calculateLayerStylesheet()}>
                <ElementInfo editorScene={this.props.editorScene} element={this.props.element} editorLayerCallbacks={this.props.editorLayerCallbacks} registerKeyCallBacks={this.props.registerKeyCallBacks} />
            </div>
    }
}

module.exports = InfoLayer;