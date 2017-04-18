import { expect } from 'chai';
import sinon from 'sinon';

import '../lib/test_utils/ajax.globals';
import { Sidebar } from '../views/components/framework/sidebar';

import render from '../lib/test_utils/component.setup';

const props = {
  dispatch: sinon.spy(),
  credits: 50,
  email_address: 'email@email',
};

const SidebarComponent = render(props, Sidebar).shallowComponent;

// Component test cases
describe('<Sidebar />', () => {
  it('Verify credits state', () => {
    const creditCount = SidebarComponent.find('.credits').render().find('.badge').text();

    expect(creditCount).to.equal('50');
  });

  it('renders email address', () => {
    const email = SidebarComponent.find('#sidebar .email').childAt(0).text();

    expect(email).to.equal(props.email_address);
  });

  it('Checks sidebar length', () => {
    expect(SidebarComponent.find('ul').children().length).to.equal(7);
  });
});
