import React, { Component } from 'react';
import ReactDOM from 'react-dom';

/**
 * Taken from the FLIP method
 * Works only for static lists (no insertion, no deletion)
 *
 * When there is a state change for an array of nodes, React determines which
 * nodes to keep, create, or destroy. The changes are instant and css transitions
 * have no effect.
 *
 * In order to apply css transitions for a smooth transform, we must know the
 * position of the element in its before state and its after state. From these
 * two states, the change in top and left positions can be calculated.
 *
 * Right after the browser updates the layout and before the repaint
 * (componentDidUpdate in React), we get the after coordinates of the elements in
 * its new state and use a transform to move them back to their original location.
 * From here, we can apply a css transition that makes it look like the element
 * moved when in fact it's already at its new location.
 */
class Swap extends Component {
  /**
   * React componentWillReceiveProps method
   * @param {Object} nextProps next props object
   * @returns {void}
   */
  componentWillReceiveProps(nextProps) {
    if (this.domNodes) {
      // In case an animation is already in progress, stop the animation in place
      // to recalculate the new position.
      this.domNodes.forEach((node) => {
        node.style.transition = '';
      });
    }

    this.changedNodes = task.getChangedNodes(
      this.props.children,
      nextProps.children,
    );

    if (Object.keys(this.changedNodes).length < 1) {
      // No elements have been changed. Complete the lifecycle.
      return;
    }

    this.updateFlag = true;

    Object.keys(this.changedNodes).forEach((key) => {
      const dom = ReactDOM.findDOMNode(this.refs[key]);

      this.changedNodes[key].oldPosition = task.getPosition(dom);
    });
  }

  /**
   * React componentDidUpdate method
   * @returns {void}
   */
  componentDidUpdate() {
    if (this.updateFlag && requestAnimationFrame) {
      this.domNodes = [];

      for (let key in this.changedNodes) {
        const dom = ReactDOM.findDOMNode(this.refs[key]);

        const { dX, dY } = (
          task.computeTranslateXYDelta(
            this.changedNodes[key].oldPosition,
            task.getPosition(dom),
          )
        );

        dom.style.transform = `translate(${dX}px, ${dY}px)`;

        this.domNodes.push(dom);
      }

      // requestAnimationFrame executes the callback right before painting. This
      // function will need to be called twice as we want the layout to be painted,
      // which should show all the elements in their original positions due to
      // the transform style being applied. After the repaint, the transform is
      // removed
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.domNodes.forEach((elem) => {
            elem.style.transition = this.props.transition;
            elem.style.transform = '';

            const handler = function handler() {
              elem.style.transition = '';

              elem.removeEventListener('transitionend', handler);
            }

            elem.addEventListener('transitionend', handler);
          });
        });
      });

      this.updateFlag = false;
    }
  }

  /**
   * React render component
   * @returns {Object} jsx
   */
  render() {
    return (
      <div ref={(c) => { this.parent = c; }}>
        {task.addRefToChildren(this.props.children)}
      </div>
    );
  }
}


const task = {

  /**
   * Clone the element. Note that the key is automatically set to a new key
   * to prevent duplication of keys. The original key value is stored as a ref,
   * and this ref is also used to select the DOM node. Must be used inside
   * render function.
   * @param {Array} children list of child elements
   * @returns {element} React element
   */
  addRefToChildren(children) {
    return (
      React.Children.map(children, element => (
        React.cloneElement(element, { ref: element.key })
      ))
    );
  },

  /**
   * Returns an object with key references to elements that have changed index
   * positions in the array.
   * @param {Array} currentChildren current render order
   * @param {Array} nextChildren next render order
   * @returns {Object} hash object containing previous and new positions of
   * changed nodes.
   */
  getChangedNodes(currentChildren, nextChildren) {
    const hash = {};

    const currentOrdering = this.getChildrenKeys(currentChildren);
    const nextOrdering = this.getChildrenKeys(nextChildren);

    for (let i = 0; i < nextOrdering.length; i += 1) {
      if (
        nextOrdering[i] !== currentOrdering[i] &&
        currentOrdering.indexOf(nextOrdering[i]) !== -1) {
        // Only add in the elements that currently exist and have changed
        // positions.
        hash[nextOrdering[i]] = {};
      }
    }

    return hash;
  },

  /**
   * @param {Object} positionBefore positionBefore object
   * @param {Object} positionAfter psotionAfter object}
   * @returns {Object} dx, dy values
   */
  computeTranslateXYDelta(positionBefore, positionAfter) {
    return {
      dX: positionBefore.left - positionAfter.left,
      dY: positionBefore.top - positionAfter.top,
    };
  },

  /**
   * Returns the top, right, bottom, left, width, height, of the element relative
   * to the viewport.
   * @param {Object} node node
   * @returns {Object} getBoundingClientRect
   */
  getPosition(node) {
    return node.getBoundingClientRect();
  },

  /**
   * Takes an array or element of children and returns the element key.
   * @param {React.Children.Array} children React children
   * @returns {Object} React.Children
   */
  getChildrenKeys(children) {
    return React.Children.map(children, element => (
      element.key
    ));
  },

};

Swap.defaultProps = {
  children: [],

  transition: 'transform 0.5s ease 0s',
};

export default Swap;
