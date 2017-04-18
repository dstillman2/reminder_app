import timeZoneData from '../time_zone.js';


function modalUpdateTimeZone({ time_zone, updateUser }) {
  return {
    schema: {
      title: 'Update Time Zone',
      content: [
        {
          ref: 'time_zone',
          type: 'dropdown',
          label: 'Time Zone',
          defaultValue: time_zone,
          validation: 'Time zone is a required field.',
          options: timeZoneData()
        },
      ],
      footer: [
        {
          name: 'Update',
          ajax: true,
          type: 'primary'
        },
        {
          name: 'Cancel',
          dismiss: true,
          type: 'default'
        },
      ],
      ajax: {
        api: 'web',
        method: 'PUT',
        path: '/accounts',
        success: updateUser,
        returnSingleObject: true
      }
    },
  }
}

function modalEditUsers({ first_name, last_name, updateUser }) {
  return {
    schema: {
      title: 'Update User Information',
      content: [
        {
          ref: 'first_name',
          type: 'textbox',
          label: 'First Name',
          defaultValue: first_name,
          size: 6,
          validation: 'First name is a required field.',
          placeholder: 'i.e. John',
        },
        {
          ref: 'last_name',
          type: 'textbox',
          label: 'Last Name',
          defaultValue: last_name,
          size: 6,
          validation: 'Last name is a required field.',
          placeholder: 'i.e. Doe',
        }
      ],
      footer: [
        {
          name: 'Update',
          ajax: true,
          type: 'primary'
        },
        {
          name: 'Cancel',
          dismiss: true,
          type: 'default'
        },
      ],
      ajax: {
        api: 'web',
        method: 'PUT',
        path: '/users',
        success: updateUser,
        returnSingleObject: true
      }
    }
  }
}

function modalEditAddress({ address_1, address_2, city, state, zip_code, company, updateUser }) {
  return {
    schema: {
      title: 'Update Address',
      content: [
        {
          ref: 'company',
          type: 'textbox',
          label: 'Company',
          defaultValue: company,
          size: 12,
          validation: 'Company is a required field',
          placeholder: 'i.e. Dr. Jones'
        },
        {
          ref: 'address_1',
          type: 'textbox',
          label: 'Address 1',
          defaultValue: address_1,
          size: 12,
          validation: 'Address 1 is a required field',
          placeholder: 'i.e. 500 Beverly Drive'
        },
        {
          ref: 'address_2',
          type: 'textbox',
          label: 'Address 2',
          defaultValue: address_2,
          size: 12,
          placeholder: 'i.e. # 150',
        },
        {
          ref: 'city',
          type: 'textbox',
          label: 'City',
          defaultValue: city,
          size: 4,
          validation: 'City is a required field.',
          placeholder: 'i.e. Chicago',
        },
        {
          ref: 'state',
          type: 'textbox',
          label: 'State',
          defaultValue: state,
          size: 4,
          validation: 'State is a required field.',
          placeholder: 'i.e. IL',
        },
        {
          ref: 'zip_code',
          type: 'textbox',
          label: 'Zip Code',
          defaultValue: zip_code,
          size: 4,
          validation: 'Zip Code is a required field.',
          placeholder: 'i.e. 52748',
        }
      ],
      footer: [
        {
          name: 'Update',
          ajax: true,
          type: 'primary'
        },
        {
          name: 'Cancel',
          dismiss: true,
          type: 'default'
        },
      ],
      ajax: {
        api: 'web',
        method: 'PUT',
        path: '/accounts',
        success: updateUser,
        returnSingleObject: true
      }
    }
  };
}

function modalUpdatePassword() {
  return {
    schema: {
      title: 'Change Password',
      content: [
        {
          ref: 'old_password',
          type: 'textbox',
          inputType: 'password',
          label: 'Old Password',
          size: 6,
          validation: 'Your old password is a required field.',
          placeholder: '******',
        },
        {
          ref: 'new_password',
          type: 'textbox',
          inputType: 'password',
          label: 'New Password',
          size: 6,
          validation: 'New password is a required field.',
          placeholder: '******',
        }
      ],
      footer: [
        {
          name: 'Update',
          ajax: true,
          type: 'primary'
        },
        {
          name: 'Cancel',
          dismiss: true,
          type: 'default'
        },
      ],
      ajax: {
        api: 'web',
        method: 'PUT',
        path: '/users/password',
      }
    }
  };
}

export {
  modalUpdateTimeZone,
  modalEditUsers,
  modalEditAddress,
  modalUpdatePassword,
}
