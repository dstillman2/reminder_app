import React from 'react';
import { shallow, mount } from 'enzyme';
import jsdom from 'jsdom';

// Set up global virtual DOM
global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = global.document.defaultView;

/**
 * Shallow render and full render configurations (full render requires virtual
 * dom). Shallow render tests solely the component in question, while full
 * render renders includes children.
 * @param {Object} props default props passed into the component
 * @param {Object} Component jsx component
 * @param {React.Children} [children] Passed children into component
 * @returns {Object} props, shallowRender, fullRender
 */
function render(props, Component, children) {
  const reactComponent = <Component {...props}>{children}</Component>;

  const shallowComponent = shallow(reactComponent);
  const mountComponent = mount(reactComponent);

  return {
    props,
    shallowComponent,
    mountComponent,
  };
}

export default render;
