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

function titleCase(str) {
  /* Converts a string to Title Case */
  return str.toLowerCase()
    .split('')
    .map((char, i) => i === 0 ? char.toUpperCase() : char)
    .join('');
}

function Clock(props) {
  /* The clock has two states, running or stopped. Unfortunately
   * the nomenclature is a little confusing as it ovelaps with
   * React's "state" concept, but they are not related. */
  const STATE = {
    running: 'running',
    stopped: 'stopped'
  }

  /* The clock also has two modes, "Session" and "Break". Each have
   * different time periods they can run for and they effectively
   * alternate indefinitely */
  const MODE = {
    session: 'session',
    break: 'break'
  }

  /* The default state is 'stopped' */
  const [state, changeState] = React.useState(STATE.stopped);

  /* The default mode is 'session' */
  const [mode, changeMode] = React.useState(MODE.session);
  /* We also have a small function to flip the mode
   * to whatever it's not. */
  function flipMode(mode) {
    return mode === MODE.session ? MODE.break : MODE.session;
  }

  /* Another helper to crop the time to be within the lower and
   * upper bounds set by the requirements */
  function cropTime(time) {
    if (time >= 60 * 60) return 60 * 60;
    else if (time <= 1 * 60) return 1 * 60;
    else return time;
  }

  /* Default session and break lengths are stored in state */
  const DEFAULTS = {
    session: 25 * 60,
    break: 5 * 60
  }
  const [sessionLength, changeSession] = React.useState(DEFAULTS.session);
  const [breakLength, changeBreak] = React.useState(DEFAULTS.break);

  /* Set the timer to the default time, ready to run. */
  const [remainingTime, setTime] = React.useState(sessionLength);

  /* Somewhere to store the setTimeout IDs so that we can
   * cancel them with the pause button. This allows the current
   * loop to be immediately stopped rather than it counting
   * down one last second via the active Timeout. */
  let timerId;

  const setSession = (e) => {
    console.log(e.target.value, state);
    if (state === STATE.stopped) {
      let newTime = cropTime(e.target.value * 60);
      changeSession(newTime);
      setTime(newTime);
    }
  }

  const adjustSession = ({ state, sessionLength, action }) => () => {
    let adjustment = action === 'increment' ? 60 : 60 * -1;
    if (state === STATE.stopped) {
      let newTime = cropTime(sessionLength + adjustment);
      changeSession(newTime);
      setTime(newTime);
    }
  }

  const setBreak = (e) => {
    if (state === STATE.stopped) { changeBreak(cropTime(e.target.value * 60)); }
  }

  const adjustBreak = ({ state, breakLength, action }) => () => {
    let adjustment = action === 'increment' ? 60 : 60 * -1;
    if (state === STATE.stopped) { changeBreak(cropTime(breakLength + adjustment)); }
  }

  function controlClock(e) {
    /* This click handler makes changes to the clock's 'state'
     * depending on the user's selection, and logic is
     * then dealt with using React's useEffect() below
     * which is fired whenever the state changes */
    let control = e.currentTarget;
    switch(control.id) {
      case 'start_stop':
        /* The user stories require that the start and stop
         * actinos be implemented by the same control, which
         * toggles the running/stopped state */
        if (state === STATE.stopped) {
          changeState(STATE.running);
        } else {
          window.clearTimeout(timerId);
          changeState(STATE.stopped);
        }
        break;
      case 'reset':
        window.clearTimeout(timerId);
        controlSound('load');
        changeState(STATE.stopped);
        changeMode(MODE.session);
        changeSession(DEFAULTS.session);
        changeBreak(DEFAULTS.break);
        setTime(DEFAULTS.session);
        break;
      default:
        throw new Error('Control action received but not recognised.');
    }
  }


  React.useEffect(() =>
    {
      if (remainingTime === 0) {
        /* No more seconds on the clock, so we're finished
         * the current counter. If we were in a session, we
         * switch to a break and vice versa. */
        controlSound('play');
        changeMode(flipMode(mode));
        /* Counterintuitively, if we're in 'session' we want to set
         * the time to the 'break' length, because we're about to
         * start a new break */
        setTime(mode === MODE.session ? breakLength: sessionLength);
        console.log(`${formatTime(remainingTime, 'mm:ss')} (${mode} ${state})`);
      }
      else if (state === STATE.running) {
        /* In one second, reduce the remaining time by
         * one second via the supplied function, which will
         * trigger another state update and bring you back
         * here as a result */
        timerId = window.setTimeout(() => setTime(remainingTime - 1), 1000);
      }
    }
  );

  function controlSound(action) {
    /* This function just makes it a little nicer to start
     * and stop the alarm sound as required */
    const audioElement = document.getElementById('beep');
    audioElement[action]();
  }

  return (
    <div id='clock'>
      <Display remainingTime={remainingTime} mode={mode} />
      <Controls
        handlers={{
          setSession,
          adjustSession,
          setBreak,
          adjustBreak
        }}
        handler={controlClock}
        breakLength={breakLength}
        sessionLength={sessionLength}
        state={state}
      />
    </div>
  );
}

function Display(props) {
  const { remainingTime, mode } = props;
  return (
    <div className='display'>
      <h3 id='timer-label'>{titleCase(mode)}</h3>
      <p id='time-left'>{formatTime(remainingTime, 'mm:ss')}</p>
      <audio id='beep' src="beep.m4a"></audio>
    </div>
  );
}

function Controls(props) {
  let { state, handler, breakLength, sessionLength } = props;
  let { setSession, adjustSession, setBreak, adjustBreak } = props.handlers;
  return (
    <div id='controls'>
    <ul>
      <li><button type='button' id='start_stop' className={state} onClick={handler}>
        <i className={`fas fa-${state === 'running' ? 'pause' : 'play'}`}></i>
      </button></li>
      <li><button type='button' id='reset' className='reset' onClick={props.handler}><i className="fas fa-history"></i></button></li>
    </ul>
      <form id='settings'>
        <h3>Settings</h3>
        <label id='session-label' htmlFor='session-length'>Session</label>
        <button type='button' id='session-decrement' onClick={adjustSession({ state, sessionLength, action: 'decrement' })}>
          <i className="fas fa-arrow-alt-circle-left"></i>
        </button>
        <input
          type='number' id='session-length'
          name='session-length' value={formatTime(sessionLength, 'mm')}
          onChange={setSession}
          min='1' max='60'
        />
        <button type='button' id='session-increment' onClick={adjustSession({ state, sessionLength, action: 'increment' })}>
          <i className="fas fa-arrow-alt-circle-right"></i>
        </button>
        <label id='break-label' htmlFor='break-length'>Break</label>
        <button type='button' id='break-decrement' onClick={adjustBreak({ state, breakLength, action: 'decrement' })}>
          <i className="fas fa-arrow-alt-circle-left"></i>
        </button>
        <input type='number' id='break-length'
          name='break-length' value={formatTime(breakLength, 'mm')}
          onChange={setBreak}
          min='1' max='60'
        />
        <button type='button' id='break-increment' onClick={adjustBreak({ state, breakLength, action: 'increment' })}>
          <i className="fas fa-arrow-alt-circle-right"></i>
        </button>
      </form>
    </div>
  )
}

ReactDOM.render(<Clock/>, document.querySelector('#app'));
