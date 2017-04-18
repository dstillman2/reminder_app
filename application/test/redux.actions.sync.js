import { expect } from 'chai';
import { updateCredits } from '../views/actions/credits';
import { openModal, closeModal } from '../views/actions/modal';

describe('actions/credits/updateCredits', () => {
  it('should create an action', () => {
    const credits = 500;
    const expectedAction = {
      type: 'UPDATE CREDITS',
      credits,
    };

    expect(updateCredits(credits)).to.eql(expectedAction);
  });
});

describe('actions/modal/openModal', () => {
  it('should create an action', () => {
    const title = 'Title';
    const content = 'Content';
    const footer = 'Footer';
    const schema = {
      title: 'Change Password',
      content: [
        {
          ref: 'old_password',
          type: 'textbox',
          inputType: 'password',
          label: 'Old Password',
          size: 6,
          validation: 'Your old password is a required field.',
        },
      ],
    };
    const expectedAction = {
      type: 'OPEN_MODAL',
      title,
      content,
      footer,
      schema,
    };

    const openModalAction = openModal({ title, content, footer, schema });

    expect(openModalAction).to.deep.equal(expectedAction);
  });
});

describe('actions/modal/closeModal', () => {
  it('should create an action', () => {
    const expectedAction = {
      type: 'CLOSE_MODAL',
    };

    expect(closeModal()).to.eql(expectedAction);
  });
});
