import React from 'react';
import ReactDOM from 'react-dom';
import EditorLayer from './ElementInfo/InfoLayer.js'
import MenuLayer from './EditorMenuLayer/MenuLayer.js'
import HelperLayer from './Helper/HelperMenuLayer.js'
import GameLayer from '../game/gameLayer.js'
import {EditorSidebar} from './Sidebar/Sidebar.js'
import { Router, Route,browserHistory } from 'react-router'
import keydown from 'react-keydown';
import robotsVM from '../../../src/client/Editor/Robots.js';
import {registerCallbacks} from './helpers.js';
import SearchForOpponent from '../battle/SearchForOpponent.js'
import _ from 'lodash';
class Game extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            showEditorLayer:false,
            ready:false
        }
        robotsVM.start(this.props.location);
    }

    setSelectedObject(element){
        if(element){
            this.setState({
                element:element,
                elementInfo:element.toObject(),
                showEditorLayer:true
            })
        }else{
            this.setState({
                element:element,
                elementInfo:{},
                showEditorLayer:false
            })
        }
    }
    editorLayerCallbacks(){
        var self = this;
        return {
            setSelectedObject:this.setSelectedObject.bind(this),
            ready:this.ready.bind(this),
            keyPressed:(key)=>registerCallbacks.triggerEvent('keyPressed',[key]),
            keyReleased:(key)=>registerCallbacks.triggerEvent('keyReleased',[key])
        }
    }
    ready(editorScene){
        this.editorScene = editorScene;
        this.setState({ready:true});
    }
    shouldShowMenuLayer(){
        return !this.state.showEditorLayer && this.state.ready;
    }
    render(){
        const gui = {
            Elements:{
                controllers:{
                    'Bodies':{
                        controllers:{
                        'Box1':{
                            controllers:{
                                delete:{'button':true},
                                select:{'button':true},
                                x:{v:1,'static':true},
                                y:{v:1,'static':true},
                                width:{v:1,'static':true},
                                height:{v:1,'static':true},
                            },
                            folder:true
                        },
                        'Box2':{
                            controllers:{
                                delete:{'button':true},
                                select:{'button':true},
                                x:{v:1,'static':true},
                                y:{v:1,'static':true},
                                width:{v:1,'static':true},
                                height:{v:1,'static':true},
                            },
                            folder:true
                        }},
                        folder:true
                    },
                    'Joints':{
                        controllers:{
                        'Box1':{
                            controllers:{
                                delete:{'button':true},
                                select:{'button':true},
                                x:{v:1,'static':true},
                                y:{v:1,'static':true},
                                width:{v:1,'static':true},
                                height:{v:1,'static':true},
                            },
                            folder:true
                        },
                        'Box2':{
                            controllers:{
                                delete:{'button':true},
                                select:{'button':true},
                                x:{v:1,'static':true},
                                y:{v:1,'static':true},
                                width:{v:1,'static':true},
                                height:{v:1,'static':true},
                            },
                            folder:true
                        }},
                        folder:true
                    },
                
                },
                folder:true
            },
            'Add body':{
                controllers:{Type:{'button':true}},
                folder:true
            },
            'Add joint':{'button':true},
            Save:{'button':true},
            Test:{'button':true},
            Debug:{'button':true}
        }

    
        return <div className="container">
            <div className="row">
            <div className="col-sm-9">
                    <GameLayer editorLayerCallbacks={this.editorLayerCallbacks()} location={this.props.location}/>
                    <EditorLayer show={this.state.showEditorLayer} editorScene={this.editorScene} element={this.state.element} editorLayerCallbacks={this.editorLayerCallbacks()} />
                    <MenuLayer show={this.shouldShowMenuLayer()} editorScene={this.editorScene} />
                    <HelperLayer />
                </div>
                <div className="col-sm-3">
                    <EditorSidebar  editorScene={this.editorScene} gui={gui}/>
                </div>
                
            </div>
        </div>
    }
}
class NoMatch extends React.Component{
    render(){
        return <div>Page not found</div>
    }
}

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={Game}>
            <Route path="*" component={NoMatch}/>
        </Route>
    </Router>,
    document.getElementById('root')
);