import React from 'react';
import DoubleTimer from  './DoubleTimer';
import NiceTime from  './NiceTime';
import LinkForm from  './LinkForm';

class TimeSettings extends React.Component {
  render() {
    return (
      <form>
        <fieldset>
          <div className="container">
            <div className="row">
              <div className="column"><h1 /></div>
            </div>
            <div className="row">
              <div className="column"><center><h2>Time Settings</h2></center></div>
            </div>
            <div className="row">
              <div className="column column-10"></div>
              <div className="column column-40">
                <label for="nameField">First Turn: </label>
                <input type="text" placeholder="mm:ss" id="firstTurn" value="6:00" />
            </div>
            <div className="column column-40">
              <label for="nameField">Other Turns: </label>
                <input type="text" placeholder="mm:ss" id="turn" value="4:00" />
            </div>
            <div className="column column-10" />
          </div>
        </div>
        </fieldset>

        <LinkForm update={this.props.update}/>
      </form>
    );
  }
}


class TimeList extends React.Component {
  render() {
    const listItems = this.props.story.map((token) =>
      <tr key={token.idx}>
        <td>
          <b className={"record-" + token.team}>{token.team == 'red' ? 'R' : 'B'} <NiceTime time={token.time}/></b>
        </td>
      </tr>
    );

    return (
      <div className="row">
        <div className="column column-10"></div>
        <div className="column">
          <center>
            <table>
              <thead>
                <tr>
                  <th>Steps</th>
                </tr>
              </thead>
              <tbody>
                {listItems}
              </tbody>
            </table>
          </center>
        </div>
        <div className="column column-10"></div>
      </div>
    );
  }
}

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

    this.runRed = this.runRed.bind(this);
    this.runBlue = this.runBlue.bind(this);
    this.resume = this.resume.bind(this);
    this.pause = this.pause.bind(this);
    this.reset = this.reset.bind(this);


    this.tick = this.tick.bind(this);
    this.settingsToggleOn = this.settingsToggleOn.bind(this);
    this.settingsToggleOff = this.settingsToggleOff.bind(this);

    this.updateTime = 10;
    this.intervalId = null;

    this.state = {
      stateId: 0,
      addedTime: 0,
      startedTime: 0,
      iid: null,
      story: [],
      settingsOff: true,
      ctm: this.tm()
    };
  }

  tick() {
    this.setState({ctm: this.tm()});
  }

  tm() {
    return new Date().getTime();
  }

  any2s() {
    console.log("a2s");
    if (this.state.iid !== null) { // runRed or runBlue
      clearInterval(this.state.iid);
    }
    this.setState(function(state) {
      console.log(state.iid);
      return {
        stateId: 0, // start
        story: [],
        iid: null,
        addedTime: 0,
      };
    });
  }

  s2rr() {
    console.log("s2rr");
    let iid = setInterval(this.tick, this.updateTime);
    this.setState(function(state) {
      console.log(iid);
      return {
        stateId: 1, // runRed
        iid: iid,
        startedTime: this.tm()
      };
    });
  }

  s2br() {
    console.log("s2br");
    let iid = setInterval(this.tick, this.updateTime);
    this.setState(function(state) {
      return {
        stateId: 2, // runBlue
        iid: iid,
        startedTime: this.tm()
      };
    });
  }

  rr2rp() {
    console.log("rr2rp");
    clearInterval(this.state.iid);
    this.setState(function(state) {
      let addedTime = state.addedTime + this.tm() - state.startedTime;
      return {
        stateId: 3, // pauseRed
        addedTime: addedTime,
        iid: null,
      };
    });
  }

  rp2rr() {
    console.log("rp2rr");
    let iid = setInterval(this.tick, this.updateTime);
    this.setState(function(state) {
      return {
        stateId: 1, // runRed
        iid: iid,
        startedTime: this.tm()
      };
    });
  }

  br2bp() {
    console.log("br2bp");
    clearInterval(this.state.iid);
    this.setState(function(state) {
      let addedTime = state.addedTime + this.tm() - state.startedTime;
      return {
        stateId: 4, // pauseRed
        addedTime: addedTime,
        iid: null,
      };
    });
  }

  bp2br() {
    console.log("bp2br");
    let iid = setInterval(this.tick, this.updateTime);
    this.setState(function(state) {
      return {
        stateId: 2, // runRed
        iid: iid,
        startedTime: this.tm()
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
        addedTime: 0
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
        addedTime: 0
      };
    });
  }

  bp2rr() {
    console.log("bp2rr");
    let iid = setInterval(this.tick, this.updateTime);
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
        iid: iid,
        startedTime: this.tm(),
        addedTime: 0
      };
    });
  }

  rp2br() {
    console.log("rp2br");
    let iid = setInterval(this.tick, this.updateTime);
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
        iid: iid,
        startedTime: this.tm(),
        addedTime: 0
      };
    });
  }



  runBlue() {
    let funcMap = {
      0: this.s2br,
      1: this.rr2br,
      3: this.rp2br,
      4: this.bp2br
    };
    funcMap[this.state.stateId]();
  }

  runRed() {
    let funcMap = {
      0: this.s2rr,
      2: this.br2rr,
      3: this.rp2rr,
      4: this.bp2rr
    };
    funcMap[this.state.stateId]();
  }

  resume() {
    let funcMap = {
      3: this.rp2rr,
      4: this.bp2br
    };
    funcMap[this.state.stateId]();
  }

  pause() {
    let funcMap = {
      1: this.rr2rp,
      2: this.br2bp
    };
    funcMap[this.state.stateId]();
  }

  // Reset to default state
  reset() {
    this.any2s();
  }

  settingsToggleOn() {
    this.setState({settingsOff: true});
  }

  settingsToggleOff() {
    this.setState({settingsOff: false});
  }

  render() {
    let settingsButton;
    if (this.state.settingsOff) {
      settingsButton = <a
        className="button button-outline"
        onClick={this.settingsToggleOff}>
        Settings
      </a>
    } else {
      settingsButton = <a
        className="button"
        onClick={this.settingsToggleOn}>
        Save
      </a>
    }

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


    let pauseClass = this.state.stateId == 0
      ? "button button-outline button-disable"
      : "button button-outline";
    console.log(pauseClass)
    let pauseButton =
      <div className="column column-10">
        <center>
          <a className={pauseClass} onClick={this.pause}>
            Pause
          </a>
        </center>
      </div>;
    let resetButton =
      <div className="column column-10">
          <a className="button button-outline" onClick={this.reset}>
            Reset
          </a>
      </div>;
    let resumeButton =
      <div className="column column-20">
          <a className="button" onClick={this.resume}>
            Resume
          </a>
      </div>;

    let buttonsOnPause =
      <div className="buttonsOnPause">
        {resumeButton}
        {resetButton}
      </div>;


    return (
      <div className="timer-logic">
        <DoubleTimer
          blueActive={this.state.stateId != 2 && this.state.stateId != 4}
          redActive={this.state.stateId != 1 && this.state.stateId != 3}
          redTime={redTime}
          blueTime={blueTime}
          redClick={this.runRed}
          blueClick={this.runBlue}
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
          : <TimeSettings  update={this.props.linkSetter}/>
        }
      </div>
    );
  }
}

export default TimerLogic;
