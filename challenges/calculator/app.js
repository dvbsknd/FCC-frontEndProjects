const TYPES = {
  number: 'number',
  action: 'action'
}
const OPERATORS = {
  add: '+',
  subtract: '-',
  multiply: '*',
  divide: '/',
  decimal: '.'
}
const ACTIONS = {
  calculate: 'calculate',
  clear: 'clear'
}
const BUTTONS = [
  { type: TYPES.action, label: 'C', value: ACTIONS.clear, id: "clear"},
  { type: TYPES.action, label: '=', value: ACTIONS.calculate, id: "equals"},
  { type: TYPES.action, label: '+', value: OPERATORS.add, id: "add"},
  { type: TYPES.action, label: '-', value: OPERATORS.subtract, id: "subtract"},
  { type: TYPES.action, label: '×', value: OPERATORS.multiply, id: "multiply"},
  { type: TYPES.action, label: '÷', value: OPERATORS.divide, id: "divide"},
  { type: TYPES.number, label: '.', value: OPERATORS.decimal, id: "decimal"},
  { type: TYPES.number, label: '0', value: 0, id: "zero"},
  { type: TYPES.number, label: '1', value: 1, id: "one"},
  { type: TYPES.number, label: '2', value: 2, id: "two"},
  { type: TYPES.number, label: '3', value: 3, id: "three"},
  { type: TYPES.number, label: '4', value: 4, id: "four"},
  { type: TYPES.number, label: '5', value: 5, id: "five"},
  { type: TYPES.number, label: '6', value: 6, id: "six"},
  { type: TYPES.number, label: '7', value: 7, id: "seven"},
  { type: TYPES.number, label: '8', value: 8, id: "eight"},
  { type: TYPES.number, label: '9', value: 9, id: "nine"}
]

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: BUTTONS.slice(),
      buffer: '0'
    }
    this.handlePress = this.handlePress.bind(this);
  }
  handlePress(e) {
    const action = BUTTONS.find(button => button.id === e.target.id).value;
    switch (action) {
      case 'clear':
        this.setState({ buffer: ''});
        break;
      case 'calculate':
        const formula = new Function(`return ${this.state.buffer};`);
        const result = formula();
        this.setState({ buffer: result });
        break;
      default:
        if (this.state.buffer === '' && typeof(action) !== 'number') break;
        else this.setState({ buffer: this.state.buffer + action });
    }
  }
  render() {
    return(<Keypad
      buffer={this.state.buffer}
      buttons={this.state.buttons}
      handlePress={this.handlePress}
    />)
  }
}

class Keypad extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <ul id="keypad">
        <Display buffer={this.props.buffer} />
        {this.props.buttons.map((button, idx) => <Button
          key={idx}
          id={button.id}
          label={button.label}
          type={button.type}
          value={button.value}
          handlePress={this.props.handlePress}
        />)}
      </ul>
    )
  }
}

class Display extends React.Component {
  render() {
    return(<li id='display'>{this.props.buffer}</li>);
  }
}

class Button extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(<li
      id={this.props.id}
      className={this.props.type}
      onClick={this.props.handlePress}
    >{this.props.label}</li>);
  }
}

ReactDOM.render(<Calculator/>, document.querySelector('#app'));
