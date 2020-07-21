function formatTime(seconds) {
  /* Convert the time in milliseconds to something
   * appropriate for the clock display of min:sec */
  let mins = Math.floor(seconds/60);
  let secs = seconds % 60;

  function pad(time) {
    /* Pad time values with a leading zero if they are
     * single digits */
    return time < 10 ? '0'+time : time.toString();
  }

  return `${pad(mins)}:${pad(secs)}`;
}

function Clock(props) {
  /* The clock has a number of modes. They're states, but
   * we call them modes so as not to confuse with application
   * state */
  const MODE = {
    ready: 'ready',
    running: 'running',
    paused: 'paused',
    finished: 'finished'
  }

  /* The default mode is 'stopped' */
  const [mode, changeMode] = React.useState(MODE.ready);

  /* Give the clock state, defaulted to zero in
   * milliseconds */
  const [remainingTime, setTime] = React.useState(25 * 60);
  const formattedTime = formatTime(remainingTime);

  /* Somewhere to store the setTimeout IDs so that we can
   * cancel them with the pause button. This allows the current
    * loop to be immediately stopped rather than it counting
    * down one last second via the active Timeout. */
  let timerId;

  function controlClock(e) {
    /* This click handler simply changes the mode
     * depending on the user's selection, and logic is
     * then dealt with using React's useEffect() below
     * which is fired whenever the state changes */
    switch(e.target.id) {
      case 'start':
        changeMode(MODE.running);
        break;
      case 'pause':
        window.clearTimeout(timerId);
        changeMode(MODE.paused);
        break;
      default:
        console.log('default');
    }
  }

  React.useEffect(() =>
    {
      console.log(`${formatTime(remainingTime)} (${mode})`);
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
      <Display time={formattedTime} mode={mode} />
      <Controls handler={controlClock} />
    </div>
  );
}

function Display(props) {
  return (
    <div>
      <div id='display'>{props.time}</div>
      <div id='status'>{props.mode}</div>
    </div>
  );
}

function Controls(props) {
  return (
    <ul>
      <li><button id='start' onClick={props.handler}>Start</button></li>
      <li><button id='pause' onClick={props.handler}>Pause</button></li>
      <li><button id='restart' onClick={props.handler}>Restart</button></li>
    </ul>
  )
}

ReactDOM.render(<Clock/>, document.querySelector('#app'));
