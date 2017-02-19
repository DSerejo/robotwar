import React from 'react';
import classNames from 'classnames';
import {KeyCallbackComponent} from '../helpers.js';
class ElementList extends KeyCallbackComponent{
    handleClick(id){
        if(!this.props.editorScene) return;
        this.props.editorScene.setSelectedObject(id);
        cc._canvas.focus();
    }
    render() {
        var className = classNames({
            hide: !this.props.show
        });
        var self = this;
        var objects = this.props.editorScene && this.props.editorScene.worldLayer?this.props.editorScene.worldLayer.objects:[];
        var list = objects.map(function(object){
            return <div key={object.id}>
                <span>{object.type}, id: {object.id}</span> <button onClick={self.handleClick.bind(self,object.id)}>Select</button>
            </div>
        });
        return <div className={className}>
            {list}
        </div>
    }

}
export default  ElementList;
