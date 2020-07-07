const CLIPS = [
  { key: 'Q', file: 'q.mp4'}, 
  { key: 'W', file: ''}, 
  { key: 'E', file: ''}, 
  { key: 'A', file: ''}, 
  { key: 'S', file: ''}, 
  { key: 'D', file: ''}, 
  { key: 'Z', file: ''}, 
  { key: 'X', file: ''}, 
  { key: 'C', file: ''}
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
  render() {
    return(
      <li className={this.constructor.name + ' drum-pad'} id={`pad-${this.props.clip.clipKey}`}>
        <a href={this.props.clip.file}>
          {this.props.clip.clipKey}
        <audio>
          <source src={this.props.clip.name} type="audio/mpeg" />
        </audio>
        </a>
      </li>
    );
  }
}

ReactDOM.render(<Machine />, document.querySelector('#drum-machine'));
