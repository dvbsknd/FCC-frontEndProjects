function formatTime(seconds, format) {
  /* Convert the time in milliseconds to something
   * appropriate for the clock display or settings
   * fields, e.g min or min:sec */
  let mins = Math.floor(seconds/60);
  let secs = seconds % 60;

  switch(format) {
    case 'mm:ss':
      function pad(time) {
        /* Pad time values with a leading zero if they are
         * single digits */
        return time < 10 ? '0'+time : time.toString();
      }

      return `${pad(mins)}:${pad(secs)}`;
      break;
    case 'mm':
      return mins;
      break;
    default:
      throw new Error('Format not recognised');
  }
}

function Clock(props) {
  /* The clock has a number of modes. They're states, but
   * we call them modes so as not to confuse with application
   * state */
  const MODE = {
    ready: 'ready',
    running: 'running',
    stopped: 'stopped',
    finished: 'finished'
  }

  /* The default mode is 'ready' */
  const [mode, changeMode] = React.useState(MODE.ready);

  /* Default session and break lenghts are stored in state */
  const [sessionLength, changeSession] = React.useState(25 * 60);
  const [breakLength, changeBreak] = React.useState(5 * 60);

  /* Set the timer */
  const [remainingTime, setTime] = React.useState(sessionLength);

  /* Somewhere to store the setTimeout IDs so that we can
   * cancel them with the pause button. This allows the current
    * loop to be immediately stopped rather than it counting
    * down one last second via the active Timeout. */
  let timerId;

  function controlClock(e) {
    /* This click handler makes changes to the clock's state
     * depending on the user's selection, and logic is
     * then dealt with using React's useEffect() below
     * which is fired whenever the state changes */
    let control = e.currentTarget;
    console.log(control);
    switch(control.id) {
      case 'start':
        changeMode(MODE.running);
        break;
      case 'stop':
        window.clearTimeout(timerId);
        changeMode(MODE.stopped);
        break;
      case 'reset':
        window.clearTimeout(timerId);
        changeMode(MODE.ready);
        setTime(sessionLength);
        break;
      case 'session-increment':
        if (mode === MODE.ready) {
          changeSession(sessionLength + 60);
          setTime(sessionLength + 60);
        }
        break;
      case 'session-decrement':
        if (mode === MODE.ready) {
          changeSession(sessionLength - 60);
          setTime(sessionLength - 60);
        }
        break;
      case 'break-increment':
        if (mode === MODE.ready) {
          changeBreak(breakLength + 60);
        }
        break;
      case 'break-decrement':
        if (mode === MODE.ready) {
          changeBreak(breakLength - 60);
        }
        break;
      default:
        throw new Error('Control action received but not recognised.');
    }
  }

  React.useEffect(() =>
    {
      console.log(`${formatTime(remainingTime, 'mm:ss')} (${mode})`);
      if (mode === MODE.running) {
        /* In one second, reduce the remaining time by
         * one second via the supplied function, which will
         * trigger another state update and bring you back
         * here as a result */
        timerId = window.setTimeout(countDown, 1000);
      }
    }
  );

  function countDown() {
    if (remainingTime < 1) {
      /* No more seconds on the clock, so we're finished */
      changeMode(MODE.finished);
    } else {
      setTime(remainingTime - 1);
    }
  }

  return (
    <div id='clock'>
      <Display time={formatTime(remainingTime, 'mm:ss')} mode={mode} />
      <Controls
        handler={controlClock}
        breakLength={formatTime(breakLength, 'mm')}
        sessionLength={formatTime(sessionLength, 'mm')}
      />
    </div>
  );
}

function Display(props) {
  return (
    <div className='display' id='time-left'>{props.time}</div>
  );
}

function Controls(props) {
  return (
    <div id='controls'>
    <ul>
      <li><button type='button' id='start' onClick={props.handler}><i className="fas fa-play"></i></button></li>
      <li><button type='button' id='stop' onClick={props.handler}><i className="fas fa-pause"></i></button></li>
      <li><button type='button' id='reset' onClick={props.handler}><i className="fas fa-history"></i></button></li>
    </ul>
      <form id='settings'>
        <h3>Settings</h3>
        <label id='session-label' htmlFor='session-length'>Session</label>
        <button type='button' id='session-decrement' onClick={props.handler}>
          <i className="fas fa-arrow-alt-circle-left"></i>
        </button>
        <input
          type='number' id='session-length'
          name='session-length' value={props.sessionLength}
          min='0' max='60'
        />
        <button type='button' id='session-increment' onClick={props.handler}>
          <i className="fas fa-arrow-alt-circle-right"></i>
        </button>
        <label id='break-label' htmlFor='break-length'>Break</label>
        <button type='button' id='break-decrement' onClick={props.handler}>
          <i className="fas fa-arrow-alt-circle-left"></i>
        </button>
        <input type='number' id='break-length'
          name='break-length' value={props.breakLength}
          min='0' max='60'
        />
        <button type='button' id='break-increment' onClick={props.handler}>
          <i className="fas fa-arrow-alt-circle-right"></i>
        </button>
      </form>
    </div>
  )
}

ReactDOM.render(<Clock/>, document.querySelector('#app'));
