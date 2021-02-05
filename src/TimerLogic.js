import React from 'react';
import DoubleTimer from  './DoubleTimer';
import TimeList from './TimeList';
import TimeSettings from './TimeSettings';
import socketIOClient from "socket.io-client";
import SoundBlaster from './SoundBlaster';
import ntp from 'socket-ntp/client/ntp';
import {isAndroid, isIOS} from "react-device-detect";


const ENDPOINT = "http://44.232.186.40:3001";
const UI_UPDATE_INTERVAL = 10;


class TimerLogic extends React.Component {
  constructor(props) {
    super(props);

    this.any2s = this.any2s.bind(this);
    this.s2rr = this.s2rr.bind(this);
    this.s2br = this.s2br.bind(this);
    this.rr2rp = this.rr2rp.bind(this);
    this.rp2rr = this.rp2rr.bind(this);
    this.br2bp = this.br2bp.bind(this);
    this.bp2br = this.bp2br.bind(this);
    this.rr2br = this.rr2br.bind(this);
    this.br2rr = this.br2rr.bind(this);
    this.bp2rr = this.bp2rr.bind(this);
    this.rp2br = this.rp2br.bind(this);
    this.nope  = function() {};

    this.runRed = this.runRed.bind(this);
    this.runBlue = this.runBlue.bind(this);
    this.resume = this.resume.bind(this);
    this.pause = this.pause.bind(this);
    this.reset = this.reset.bind(this);


    this.tick = this.tick.bind(this);
    this.settingsToggleOn = this.settingsToggleOn.bind(this);
    this.settingsToggleOff = this.settingsToggleOff.bind(this);
    this.updateTurnTimes = this.updateTurnTimes.bind(this);
    this.computeTimes = this.computeTimes.bind(this);
    this.updateInterval = this.updateInterval.bind(this);

    this.updateTime = UI_UPDATE_INTERVAL;
    this.intervalId = null;
    this.updatePatch = {};

    if (this.props.externalState != null) {
      this.state = this.props.externalState;
      this.updateInterval();
    } else {
      this.state = {
        stateId: 0,
        addedTime: 0,
        startedTime: 0,
        iid: null,
        story: [],
        settingsOff: true,
        ctm: this.tm(),
        firstTurn: 6 * 60 * 1000,
        turn: 4 * 60 * 1000,
        room: this.props.rooms,
        network: false
      };
    }
  }

  componentDidMount() {
    this.socket = socketIOClient(ENDPOINT);
    this.socket.emit('ntp:client_sync', { t0 : Date.now() });
    ntp.init(this.socket, {interval: 1000});

    this.socket.on('state-update', data => {
      if ("settingsOff" in data) {
        delete data.settingsOff
      }
      delete data.iid;
      let offset = ntp.offset();
      if (!Number.isNaN(offset)) {
        data.startedTime += offset;
        data.ctm += offset;
      }
      this.setState(data);
      this.updateInterval();
    });
    if (!this.state.network) {
      console.log("Joing the room!");
      this.socket.emit('join-room', this.props.room, this.state);
    }

  }

  updateInterval() {
    if (this.state.stateId === 1 || this.state.stateId === 2) {
      if (this.state.iid == null) {
        this.setState({iid: setInterval(this.tick, this.updateTime)});
      }
    } else {
      if (this.state.iid != null) {
        clearInterval(this.state.iid);
        this.setState({iid: null});
      }
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.state.network) {
      if (prevState.stateId !== this.state.stateId ||
          prevState.turn !== this.state.turn ||
          prevState.firstTurn !== this.state.firstTurn) {
        let data = JSON.parse(JSON.stringify(this.state));
        let offset = ntp.offset();
        if (!Number.isNaN(offset)) {
          data.startedTime -= offset;
          data.ctm -= offset;
        }
        this.socket.emit("state-update", data);
      }
    }
    this.updateInterval();
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  updateTurnTimes(id, value) {
    this.updatePatch[id] = value;
  }

  tick() {
    this.setState({ctm: this.tm()});
  }

  tm() {
    return new Date().getTime();
  }

  any2s() {
    console.log("a2s");
    this.setState(function(state) {
      return {
        stateId: 0, // start
        addedTime: 0,
        startedTime: 0,
        story: [],
        network: false
      };
    });
  }

  s2rr() {
    console.log("s2rr");
    this.setState(function(state) {
      return {
        stateId: 1, // runRed
        startedTime: this.tm(),
        network: false
      };
    });
  }

  s2br() {
    console.log("s2br");
    this.setState(function(state) {
      return {
        stateId: 2, // runBlue
        startedTime: this.tm(),
        network: false
      };
    });
  }

  rr2rp() {
    console.log("rr2rp");
    this.setState(function(state) {
      let addedTime = state.addedTime + this.tm() - state.startedTime;
      return {
        stateId: 3, // pauseRed
        addedTime: addedTime,
        iid: null,
        network: false
      };
    });
  }

  rp2rr() {
    console.log("rp2rr");
    this.setState(function(state) {
      return {
        stateId: 1, // runRed
        startedTime: this.tm(),
        network: false
      };
    });
  }

  br2bp() {
    console.log("br2bp");
    this.setState(function(state) {
      let addedTime = state.addedTime + this.tm() - state.startedTime;
      return {
        stateId: 4, // pauseRed
        addedTime: addedTime,
        network: false
      };
    });
  }

  bp2br() {
    console.log("bp2br");
    this.setState(function(state) {
      return {
        stateId: 2, // runRed
        startedTime: this.tm(),
        network: false
      };
    });
  }

  rr2br() {
    console.log("rr2br");
    this.setState(function(state) {
      let story = state.story;
      let ev = {
        team: 'red',
        time: this.tm() - state.startedTime + state.addedTime,
        idx: state.story.length
      }
      story = state.story.concat([ev]);
      return {
        stateId: 2, // runBlue
        story: story,
        startedTime: this.tm(),
        addedTime: 0,
        network: false
      };
    });
  }

  br2rr() {
    console.log("br2rr");
    this.setState(function(state) {
      let story = state.story;
      let ev = {
        team: 'blue',
        time: this.tm() - state.startedTime + state.addedTime,
        idx: state.story.length
      }
      story = state.story.concat([ev]);
      return {
        stateId: 1, // runRed
        story: story,
        startedTime: this.tm(),
        addedTime: 0,
        network: false
      };
    });
  }

  bp2rr() {
    console.log("bp2rr");
    this.setState(function(state) {
      let story = state.story;
      let ev = {
        team: 'blue',
        time: state.addedTime,
        idx: state.story.length
      }
      story = state.story.concat([ev]);
      return {
        stateId: 1, // runRed
        story: story,
        startedTime: this.tm(),
        addedTime: 0,
        network: false
      };
    });
  }

  rp2br() {
    console.log("rp2br");
    this.setState(function(state) {
      let story = state.story;
      let ev = {
        team: 'red',
        time: state.addedTime,
        idx: state.story.length
      }
      story = state.story.concat([ev]);
      return {
        stateId: 2, // runRed
        story: story,
        startedTime: this.tm(),
        addedTime: 0,
        network: false
      };
    });
  }

  runBlue() {
    let funcMap = {
      0: this.s2br,
      1: this.rr2br,
      2: this.nope,
      3: this.rp2br,
      4: this.bp2br
    };
    funcMap[this.state.stateId]();
  }

  runRed() {
    let funcMap = {
      0: this.s2rr,
      1: this.nope,
      2: this.br2rr,
      3: this.rp2rr,
      4: this.bp2rr
    };
    funcMap[this.state.stateId]();
  }

  resume() {
    let funcMap = {
      0: this.nope,
      1: this.nope,
      2: this.nope,
      3: this.rp2rr,
      4: this.bp2br
    };
    funcMap[this.state.stateId]();
  }

  pause() {
    let funcMap = {
      0: this.nope,
      1: this.rr2rp,
      2: this.br2bp,
      3: this.nope,
      4: this.nope,
    };
    funcMap[this.state.stateId]();
  }

  // Reset to default state
  reset() {
    this.any2s();
  }

  settingsToggleOn() {
    this.updatePatch.settingsOff = true;
    this.setState(this.updatePatch);
    this.updatePatch = {};
  }

  settingsToggleOff() {
    this.setState({settingsOff: false});
  }

  computeTimes() {
    let countedTime = this.tm() - this.state.startedTime;

    let redTime = 0;
    redTime = this.state.stateId === 1
      ? countedTime + this.state.addedTime
      : redTime;
    redTime = this.state.stateId === 3
      ? this.state.addedTime
      : redTime;

    let blueTime = 0;
    blueTime = this.state.stateId === 2
      ? countedTime + this.state.addedTime
      : blueTime;
    blueTime = this.state.stateId === 4
      ? this.state.addedTime
      : blueTime;

    return [redTime, blueTime];
  }

  render() {
    let settingsButton;
    if (this.state.settingsOff) {
      settingsButton = <button
        className="button button-outline"
        onClick={this.settingsToggleOff}>
        Settings
      </button>
    } else {
      settingsButton = <button
        className="button"
        onClick={this.settingsToggleOn}>
        Save
      </button>
    }

    let [redTime, blueTime] = this.computeTimes();
    let turnTime = this.state.story.length === 0
      ? this.state.firstTurn
      : this.state.turn;

    let pauseClass = this.state.stateId === 0
      ? "button button-outline button-disable"
      : "button button-outline";
    let pauseButton =
      <div className="column column-10">
        <center>
          <button className={pauseClass} onClick={this.pause}>
            Pause
          </button>
        </center>
      </div>;
    let resetButton =
      <div className="column column-10">
          <button className="button button-outline" onClick={this.reset}>
            Reset
          </button>
      </div>;
    let resumeButton =
      <div className="column column-20">
          <button className="button" onClick={this.resume}>
            Resume
          </button>
      </div>;

    let mobile = isAndroid || isIOS;

    let bluster = mobile
      ? ""
      : <SoundBlaster time={(redTime + blueTime)} turn={turnTime}/>;
    return (
      <div className="timer-logic">
        {bluster}
        <DoubleTimer
          blueActive={this.state.stateId !== 2 && this.state.stateId !== 4}
          redActive={this.state.stateId !== 1 && this.state.stateId !== 3}
          redTime={redTime}
          blueClick={this.runBlue}
          blueTime={blueTime}
          redClick={this.runRed}
          turnTime={turnTime}
          start={this.state.stateId === 0}
        />


        <TimeList story={this.state.story}/>

        <div className="row">
          <div className="column column-10"></div>
          {this.state.stateId < 3 ? pauseButton : ""}
          {this.state.stateId >= 3 ? resumeButton : ""}
          {this.state.stateId >= 3 ? resetButton : ""}

          <div className="column"></div>
          <div className="column column-10">
            <center>
              {settingsButton}
            </center>
          </div>
          <div className="column column-10"></div>
        </div>
        {this.state.settingsOff
          ? ""
          : <TimeSettings
              update={this.props.linkSetter}
              timeUpdate={this.updateTurnTimes}
              firstTurn={this.state.firstTurn}
              turn={this.state.turn}
            />
        }
      </div>
    );
  }
}

export default TimerLogic;
