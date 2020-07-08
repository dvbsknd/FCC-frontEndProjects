const CLIPS = [
  { key: 'Q', file: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3'}, 
  { key: 'W', file: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3'}, 
  { key: 'E', file: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3'}, 
  { key: 'A', file: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3'}, 
  { key: 'S', file: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3'}, 
  { key: 'D', file: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3'}, 
  { key: 'Z', file: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3'}, 
  { key: 'X', file: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3'}, 
  { key: 'C', file: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3'}
];

class Machine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      banks: [
        { id: 0,
          label: 'Main',
          pads: CLIPS.map((clip) => ({ active: false, clipKey: clip.key, file: clip.file}))
        }
      ]
    };
  }
  render() {
    return(<Bank data={this.state.banks[0]} />);
  }
}

class Bank extends React.Component {
  render() {
    return(
      <ol id="display" className={this.constructor.name}>{this.props.data.pads.map((pad, idx) => <Pad key={idx} clip={pad} />)}</ol>);
  }
}

class Pad extends React.Component {
  handlePadClick(e) {
    e.preventDefault();
    let audio = e.target.children[0];
    audio.play();
  }
  handleKeyPress(e) {
    let keyPressed = e.key.toUpperCase();
    let audio = document.getElementById(keyPressed);
    audio ? audio.play() : console.log('No clip for', keyPressed);
  }
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }
  render() {
    return(
      <li className={this.constructor.name + ' drum-pad'} id={`pad-${this.props.clip.clipKey}`}>
        <a
          href={this.props.clip.file}
          onClick={this.handlePadClick.bind(this)}
          onKeyDown={(e) => this.handleKeyPress(e)}
        >
          {this.props.clip.clipKey}
        <audio className='clip' id={this.props.clip.clipKey} src={this.props.clip.file} type="audio/mpeg" ></audio>
        </a>
      </li>
    );
  }
}

ReactDOM.render(<Machine />, document.querySelector('#drum-machine'));
