import _ from 'underscore'

// TODO: clean up code
const conversion = function(object) {
  var wrapper;
  var obj = {};
  var count = 0;

  if (_.isArray(object)) {
    obj.data = [];

    for (let i = 0; i < object.length; i++) {
      obj.data.push({});
      for (key in this) {
        wrapper = this[key];

        obj.data[i][key] = wrapper(object[i][key]);
      }
    }
    obj.count = obj.data.length;

  } else if (_.isObject(object)) {
    var key;

    obj.count = 1;
    obj.data = {};

    for (key in this) {
      wrapper = this[key];

      obj.data[key] = wrapper(object[key]);
    }
  }

  return obj;
}

const fields = {
  Integer(val) {
    return (e) => {
      var int_conversion = parseInt(e);

      if (isNaN(int_conversion)) {
        return val;
      } else {
        return int_conversion;
      }
    }
  },

  String(val) {
    return (e) => {
      if (val) {
          return val;
      }

      return e;
    }
  },

  Boolean(val) {
    return e => {
      var val = e;

      if (val === 'false') {
        return false;
      }

      if (val && !e) {
        val = val;
      }

      return !!val;
    }
  },

  DateTime(val) {
    return (e) => {
      return e || val;
    }
  }
}

const pd = className => object => {
  return conversion.call(new className, object);
}

function dump(schemas) {
  const obj = {}

  for (let className in schemas) {
    obj[className] = pd(schemas[className])
  }

  return obj
}

export { fields, dump }
