require('../../../../../testhelpers');
import {mount,shallow} from 'enzyme';
jest.dontMock('../ComponentList.js');
describe('MenuLayer', function() {

    var React = require('react');
    var ReactDOM = require('react-dom');
    var TestUtils = require('react-addons-test-utils');
    var ComponentList = require('../ComponentList').default;

    var MenuLayer;
    var renderer,menuLayer;

    beforeEach(function() {
        MenuLayer = require('../MenuLayer').default;
    });

    it('should exists', function() {
        // Render into document
        var menuLayer = TestUtils.renderIntoDocument( <MenuLayer /> );
        expect(TestUtils.isCompositeComponent(menuLayer)).to.be.ok;
    });
    it('should hide when changing show prop',function(){
        renderer = TestUtils.createRenderer();
        renderer.render(
            <MenuLayer show={false} />
        );
        menuLayer = renderer.getRenderOutput();
        expect(menuLayer.props.className).to.contains('hide');
    });
    it('shows component list on click',function(){
        menuLayer = mount(<MenuLayer show={true} />);
        var componentList = menuLayer.findWhere(n => {return n.type() === ComponentList});
        menuLayer.find('button#add-component').simulate('click');
        expect(componentList.props().show).to.equal(true);
    })
});