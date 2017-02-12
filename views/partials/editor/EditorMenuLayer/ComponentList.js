import React from 'react';
import classNames from 'classnames';

class ComponentList extends React.Component{
    handleClick(type){
        if(!this.props.editorScene) return;
        this.props.editorScene.addNewObject(type)
        this.props.onChange();
    }
    render() {
        var className = classNames({
            hide: !this.props.show
        });

        return <div className={className}>
            <div><button onClick={this.handleClick.bind(this,'box')}>Box</button></div>
            <div><button onClick={this.handleClick.bind(this,'propulsor')}>Propulsor</button></div>
            <div><button onClick={this.handleClick.bind(this,'pin')}>Pin</button></div>
        </div>
    }

}
export default  ComponentList;
