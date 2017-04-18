function verifyValidFields(fields) {
  const obj = {};

  for (let value in fields) {
    if (fields[value]) {
      try {
        if (!this[value].getValue()) {
          this.setState({
            errorMessage: fields[value],
          });

          return null;
        }
      } catch (e) {
        this.setState({
          errorMessage: fields[value],
        });

        return null;
      }
    }

    obj[value] = this[value].getValue();
  }

  return obj;
}

export default verifyValidFields;
