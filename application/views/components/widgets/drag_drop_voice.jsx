import React from 'react';

import _ from 'underscore';

class DragDropComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      arrangement: []
    };

    this._debouncedSwap = _.debounce(this.props.onElementSwap, 300);
  }

  componentWillMount() {
    this.setSchema(this.props.schema);
  }

  componentWillReceiveProps(nextProps) {
    this.setSchema(nextProps.schema);
  }

  setSchema(schema) {
    const arr = [];

    const mapping = {
      tts: {
        color: 'token',
        name: 'Text to Speech'
      },
      upload: {
        color: 'token',
        name: 'Upload'
      },
      recording: {
        color: 'token',
        name: 'Recording'
      },
      new: {
        color: 'grey',
        name: 'New Entry'
      }
    };

    schema.forEach((item, index) => {
      arr.push(
        <li
          className={mapping[item.type].color}
          data-id={item.id}
          key={item.id}
          style={{textAlign: 'left'}}
          onClick={e => this.props.onClick(item.id)}
          draggable={true}
          onDragOver={e => e.preventDefault()}
          onDragEnd={e => this.onDragEnd(e)}
          onDrag={e => this.onDrag(e)}>
          <span className="index">{index + 1}</span>
          {(item.token || '') + ' (' + mapping[item.type].name + ')'}
        </li>
      );
    });

    this.setState({ arrangement: arr });
  }

  computeRelativeContainerHeight() {
    const component = document.getElementsByClassName('dragdrop-voice')[0];
    const rect = component.getBoundingClientRect();

    return rect.top;
  }

  computeElementPositionSwaps(start) {
    const elements = this.state.arrangement;
    const positionSwaps = [];

    elements.forEach((element, index) => {
      positionSwaps.push({
        id: element.props['data-id'],
        lower: (50 * index) + start,
        upper: (50 * (index + 1)) + start
      });
    });

    return positionSwaps;
  }

  swapElement(id1, id2, isDrag=false) {
    // get element # of id1 and id2
    const newArr = this.state.arrangement.slice(0);
    var id1Index, id2Index;

    newArr.forEach((item, index) => {
      if (id1 == item.props['data-id']) {
        id1Index = index;
      }

      if (id2 == item.props['data-id']) {
        id2Index = index;
      }
    });

    if (id1Index !== id2Index) {
      [newArr[id1Index], newArr[id2Index]] = [newArr[id2Index], newArr[id1Index]];

      this.setState({ arrangement: newArr });

      const schema = this.props.schema;

      [schema[id1Index], schema[id2Index]] = [schema[id2Index], schema[id1Index]];

      if (isDrag) {
        this._debouncedSwap(schema);
      } else {
        this.props.onElementSwap(schema);
      }
    }
  }

  onDrag(event) {
    event.preventDefault();

    if (event.clientX === 0 && event.clientY === 0) {
      return;
    }

    const eventId = event.target.dataset.id;
    const containerPositionY = this.computeRelativeContainerHeight();

    const positionSwaps = this.computeElementPositionSwaps(containerPositionY);

    positionSwaps.forEach((position) => {
      if (event.clientY > position.lower && event.clientY < position.upper) {
        this.swapElement(position.id, eventId, true);
      }
    });
  }

  onDragEnd(event) {
    event.preventDefault();
    event.stopPropagation();

    this.setSchema(this.props.schema);
  }

  render() {
    return (
      <ul className="dragdrop-voice">
          {this.state.arrangement}
      </ul>
    );
  }
}

DragDropComponent.propTypes = {
  schema: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
};

DragDropComponent.props = {
  schema: []
}

export default DragDropComponent;
