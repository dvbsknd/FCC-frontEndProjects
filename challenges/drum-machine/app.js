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
      ],
      active: 'None'
    };
  }
  updateDisplay(track) {
    this.setState({ active: track });
    //setTimeout(() => this.setState({ active: 'Cleared' }), 2000);
  }
  render() {
    return(
      <div>
        <Bank data={this.state.banks[0]} updater={this.updateDisplay.bind(this)} />
        <Display clipKey={this.state.active} />
      </div>
    );
  }
}

class Display extends React.Component {
  render() {
    const clip = CLIPS.filter(clip => clip.key === this.props.clipKey)[0];
    const file = clip ? clip.file : '';
    const label = file
      ? file.match(/\/drums\/(.+).mp3$/)[1].replace(/[-_]/g, ' ').toUpperCase()
      : '';
    console.log(this.props.clipKey, label);
    return(<div className={this.constructor.name} id="display">{label}</div>);
  }
}

class Bank extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return(
      <ol id="drum-bank" className={this.constructor.name}>
        {this.props.data.pads.map((pad, idx) => <Pad
          key={idx}
          clip={pad}
          updater={this.props.updater}
        />)}
      </ol>
    );
  }
}

class Pad extends React.Component {
  constructor(props) {
    super(props);
    this.playClip = this.playClip.bind(this);
    this.handlePadClick = this.handlePadClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }
  playClip(audio) {
    audio.play();
  }
  handlePadClick(e) {
    e.preventDefault();
    let audio = e.target.children[0];
    this.props.updater(this.props.clip.clipKey);
    this.playClip(audio);
  }
  handleKeyPress(e) {
    if (e.key.toUpperCase() === this.props.clip.clipKey) {
      let audio = document.getElementById(this.props.clip.clipKey);
      this.props.updater(this.props.clip.clipKey);
      this.playClip(audio);
    }
  }
  render() {
    return(
      <li onClick={this.handlePadClick} className={this.constructor.name + ' drum-pad'} id={`pad-${this.props.clip.clipKey}`}>
          {this.props.clip.clipKey}
          <audio className='clip' id={this.props.clip.clipKey} src={this.props.clip.file} type="audio/mpeg"></audio>
      </li>
    );
  }
}

ReactDOM.render(<Machine />, document.querySelector('#drum-machine'));
