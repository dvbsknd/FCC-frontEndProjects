const TYPES = {
  number: 'number',
  operator: 'operator',
  clear: 'clear'
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
  { type: TYPES.clear, label: 'C', value: ACTIONS.clear, id: "clear"},
  { type: TYPES.operator, label: '=', value: ACTIONS.calculate, id: "equals"},
  { type: TYPES.operator, label: '+', value: OPERATORS.add, id: "add"},
  { type: TYPES.operator, label: '-', value: OPERATORS.subtract, id: "subtract"},
  { type: TYPES.operator, label: '×', value: OPERATORS.multiply, id: "multiply"},
  { type: TYPES.operator, label: '÷', value: OPERATORS.divide, id: "divide"},
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
      input: '0',
      result: '0',
      pendingOperation: null,
      prompt: true
    }
    this.calculate= this.calculate.bind(this);
  }
  calculate(button) {
    let { input, pendingOperation, result, prompt } = this.state;

    switch (button.type) {

      case 'clear':
        /* Reset all state if user has hit 'clear' */
        this.setState({
          pendingOperation: null,
          result: '0',
          input: '0',
          prompt: true
        });
        break;

      case 'number':
        /* Prevent logging of multiple zeros in a row */
        if (this.state.input === 0 && button.value === 0) break;
        /* Prevent logging of multiple decimals in a row */
        if (button.value === '.' && this.state.input.toString().includes('.')) break;
        /* Handle normal input */
        if (prompt === true) { /* Buffer is ready to accept input */
          this.setState({ 
            input: button.value,
            prompt: false 
          });
        } else {
          /* Buffer has numbers: append incoming number */
          this.setState({
            input: input.toString().concat(button.value)
          });
        }
        break;

      case 'operator':
        /* Apply the queued operator between the previous result and the
         * current input, then store the new value as the result, ready
         * for new input. Set the supplied operator as the forthcoming
         * operation for the next time a calculation is done */

        /* Provided there's an operator to apply, convert the current result
         * (a String) into a Function and evaluate it, otherwise just set
         * the result to whatever is currently in the input */
        let newResult;
        if (
          pendingOperation
          && prompt === true
          && button.value === OPERATORS.subtract
        ) {
          this.setState({ input: '-', prompt: false });
          break;
        }
        else if (pendingOperation && prompt === false) {
          newResult = new Function(`return ${result} ${pendingOperation} ${input};`)();
        }
        else {
          newResult = input;
        }

        /* Update the input and result accordingly, and set the just-supplied
         * operator as the one to be used in the next calculation cycle */
        this.setState({
          input: newResult,
          result: newResult,
          pendingOperation: button.value === ACTIONS.calculate ? null : button.value,
          prompt: true
        });
        break;
    }
  }
  render() {
    return(<Keypad
      result={this.state.result}
      input={this.state.input}
      buttons={this.state.buttons}
      calculate={this.calculate}
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
        <Display
          result={this.props.result}
          input={this.props.input}
        />
        {this.props.buttons.map((button, idx) => <Button
          key={idx}
          id={button.id}
          label={button.label}
          type={button.type}
          value={button.value}
          calculate={this.props.calculate}
        />)}
      </ul>
    )
  }
}

class Display extends React.Component {
  render() {
    let { input } = this.props;
    if (input.toString().length > 11) input = input.toString().slice(0, 11);
    return(<li id='display'>{input}</li>);
  }
}

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false
    }
    this.handlePress = this.handlePress.bind(this);
  }
  handlePress(e) {
    const button = BUTTONS.find(button => button.id === e.target.id);
    this.setState({ active: true });
    setTimeout(() => this.setState({ active: false }), 200);
    this.props.calculate(button);
  }
  render() {
    return(<li
      id={this.props.id}
      className={`${this.state.active === true ? 'active ' : ''}${this.props.type}`}
      onClick={this.handlePress}
    >{this.props.label}</li>);
  }
}

ReactDOM.render(<Calculator/>, document.querySelector('#app'));
