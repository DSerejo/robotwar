import chai from "chai";
var jsxChai = require("jsx-chai");
// chai.use(jsxChai);
// chai.use(require('chai-shallow-deep-equal'));
const expect = chai.expect;
import {shallow,mount} from 'enzyme';
import sinon from 'sinon';
import {EditorSidebar,Folder,ControllerFactory} from '../Sidebar.js'
const gui = {
    metrics:{
        'fps':{v:62,static:true}
    }
    
}
describe('EditorSidebar', function() {

    var React = require('react');
    var ReactDOM = require('react-dom');
    var TestUtils = require('react-addons-test-utils');

    var wrapper,renderer;
    
    

    it('should exists', function() {
        var wrapper = TestUtils.renderIntoDocument( <EditorSidebar gui={gui} /> );
        expect(TestUtils.isCompositeComponent(wrapper)).to.be.ok;
    });
    it('adds folder', function() {
        var s = mount(<EditorSidebar gui={gui} /> );
        expect(s.find('.folder').length).to.equal(1)
    })
    describe('Folders',function(){
        var folder = mount( <Folder name='metrics' controllers={gui.metrics} /> );
        it('has a title', function() {
            expect(folder.find('.title').text()).to.equal('metrics')
        });
        it('has controllers', function() {
            expect(folder.find('.controller').length).to.equal(1)
        });
        
    })
    describe('Controllers',function(){
        var controller = mount(ControllerFactory.createController('fps',gui.metrics.fps));
        it('has a title', function() {
            expect(controller.find('.prop').text()).to.equal('fps')
        });
    })
});