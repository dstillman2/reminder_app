import sinon from 'sinon';
import { expect } from 'chai';

import createComponent from '../lib/test_utils/component.setup';
import reactTextbox from '../views/components/form_fields/textbox';

const sinonFunction = sinon.spy();

const props = {
  label: 'Label',
  defaultValue: 'default value',
  onClick: sinonFunction,
};

// Component test cases
describe('<Textbox />', () => {
  const Textbox = createComponent(props, reactTextbox).shallowComponent;

  it('prop population', () => {
    expect(Textbox.find('label').text()).to.equal('Label');
  });
});
