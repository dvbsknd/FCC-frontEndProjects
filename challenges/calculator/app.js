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
  { type: TYPES.action, label: '+', value: OPERATORS.add, row: 4, column: 2 },
  { type: TYPES.action, label: '-', value: OPERATORS.subtract, row: 4, column: 2 },
  { type: TYPES.action, label: '×', value: OPERATORS.multiply, row: 4, column: 2 },
  { type: TYPES.action, label: '÷', value: OPERATORS.divide, row: 4, column: 2 },
  { type: TYPES.action, label: '.', value: OPERATORS.decimal, row: 4, column: 2 },
  { type: TYPES.action, label: '=', value: ACTIONS.calculate, row: 4, column: 2 },
  { type: TYPES.action, label: 'C', value: ACTIONS.clear, row: 4, column: 2 },
  { type: TYPES.number, label: '0', value: 0, row: 4, column: 2 },
  { type: TYPES.number, label: '1', value: 1, row: 4, column: 2 },
  { type: TYPES.number, label: '2', value: 2, row: 4, column: 2 },
  { type: TYPES.number, label: '3', value: 3, row: 4, column: 2 },
  { type: TYPES.number, label: '4', value: 4, row: 4, column: 2 },
  { type: TYPES.number, label: '5', value: 5, row: 4, column: 2 },
  { type: TYPES.number, label: '6', value: 6, row: 4, column: 2 },
  { type: TYPES.number, label: '7', value: 7, row: 4, column: 2 },
  { type: TYPES.number, label: '8', value: 8, row: 4, column: 2 },
  { type: TYPES.number, label: '9', value: 9, row: 4, column: 2 }
]
    
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: BUTTONS.slice()
    }
  }
  render() {
    return(<Keypad buttons={this.state.buttons} />)
  }
}

class Keypad extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return(
      <ul>
      {this.props.buttons.map((button, idx) => <Button
        key={idx}
        row={button.row}
        column={button.column}
        label={button.label}
        type={button.type}
        value={button.value}
        onClick={this.props.handlePress}
    />)}
      </ul>
    )
  }
}

class Button extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return(<ol>{this.props.label}</ol>);
  }
}

ReactDOM.render(<Calculator/>, document.querySelector('#app'));
