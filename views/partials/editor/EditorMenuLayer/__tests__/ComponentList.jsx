require('../../../../../testhelpers');
import {shallow} from 'enzyme';
import sinon from 'sinon';
describe('MenuLayer', function() {

    var React = require('react');
    var ReactDOM = require('react-dom');
    var TestUtils = require('react-addons-test-utils');

    var ComponentList,wrapper;

    beforeEach(function() {
        ComponentList = require('../ComponentList').default;
    });

    it('should exists', function() {
        // Render into document
        var wrapper = TestUtils.renderIntoDocument( <ComponentList /> );
        expect(TestUtils.isCompositeComponent(wrapper)).to.be.ok;
    });
    it('should hide when changing show prop',function(){
        wrapper = shallow(<ComponentList show={false} />);
        expect(wrapper.hasClass('hide')).to.be.true;
    });
    it('class addobject function when button is clicked',function(){
        var EditorScene = {addNewObject:sinon.spy()};
        wrapper = shallow(<ComponentList show={true} editorScene={EditorScene} />)
        wrapper.instance().handleClick('box');
        expect(EditorScene.addNewObject).to.have.property('callCount', 1);
    });
});