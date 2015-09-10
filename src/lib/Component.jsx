import React from 'react';
import ReactMixin from 'react-mixin';
import EventMixin from 'react-as-event-mixin';
import Draggable from 'react-as-dnd';

class NumberInput extends React.Component {
  static displayName = 'NumberInput'
  static propTypes = {
    max: React.PropTypes.number,
    min: React.PropTypes.number,
    onChange: React.PropTypes.func,
		onDragEnd: React.PropTypes.func,
		onDragMove: React.PropTypes.func,
		onDragStart: React.PropTypes.func,
    step: React.PropTypes.number,
    value: React.PropTypes.number,
    width: React.PropTypes.number
  }
  static defaultProps = {
    min: 0,
    max: 100,
    value: 0,
    step: 1,
    width: 300,
    onChange: () => {}
  }
  constructor(props) {
    super();
    this.state = {
      value: props.value,
      dragging: false
    };
    this._getPixPerStep = this._getPixPerStep.bind(this);
    this._value2offset = this._value2offset.bind(this);
    this._offset2value = this._offset2value.bind(this);
    this._handleDragMove = this._handleDragMove.bind(this);
    this._handleDragStart = this._handleDragStart.bind(this);
    this._handleDragEnd = this._handleDragEnd.bind(this);
  }
  componentWillReceiveProps(props) {
    ('value' in props) && (this.state.value = props.value);
  }
  _getPixPerStep() {
    let props = this.props;
    let totalSteps = (props.max - props.min) / props.step;
    let pixPerStep = props.width / totalSteps;
    return pixPerStep;
  }
  _value2offset(value) {
    let props = this.props;
    let totalSteps = (props.max - props.min) / props.step;
    let curStep = Math.round((value - props.min) / (props.max - props.min) * totalSteps);
    let pixPerStep = this._getPixPerStep();
    return curStep * pixPerStep;
  }
  _offset2value(len) {
    let pixPerStep = this._getPixPerStep();
    let steps = Math.round(len / pixPerStep);
    return steps * this.props.step;
  }
  _handleDragMove(e) {
    let value = this._offset2value(e.dragShowX);
    this.setState({
      value
    });
		this.fireAll('change', value);
  }
  _handleDragStart() {
    this.setState({
      dragging: true
    });
  }
  _handleDragEnd() {
    this.setState({
      dragging: false
    });
  }
  render() {
    let config = {
      start: {
        x: this._value2offset(this.state.value),
        y: 5
      },
      grid: {
        x: this._getPixPerStep(),
        y: 0
      },
      onDragMove: this._handleDragMove,
      onDragStart: this._handleDragStart,
      onDragEnd: this._handleDragEnd
    };
    return (
      <div className="react-as-number-input" style={{width: this.props.width}}>
        <div className="react-as-number-input-line"></div>
        <Draggable axis="x" limit="parent" shadow={false} {...config}>
          <span className="react-as-number-input-btn"></span>
        </Draggable>
      </div>
    );
  }
}

ReactMixin(NumberInput.prototype, EventMixin);

export default NumberInput;
