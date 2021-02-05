import React from 'react';
import TimerLogic from './TimerLogic';
import LinkForm from  './LinkForm';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

function GameLink(props) {
  return (
    <div className="row">
      <div className="column">
        <center>
          <h4>Game Link: <a href={props.href}>{props.name}</a></h4>
        </center>
      </div>
    </div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.setLink = this.setLink.bind(this);

    this.state = {
      settingsOff: true,
      gameLink: null,
      suffix: null,
    };
    if (props.suffix != null) {
      this.state.gameLink = "https://codenames.game/room/" + props.suffix + '?#';
      this.state.suffix = props.suffix;
    }
  }


  setLink(link) {
    let tokens = link.split("/")
    // TODO
    if (tokens.length === 0) {
      return;
    }
    try {
      new URL(link);
    } catch (_) {
      return;
    }
    let last = tokens[tokens.length - 1];
    last = last.split('?')[0];
    this.setState({
      gameLink: link,
      suffix: last,
    })
    window.location.href = last;
  }

  render() {
    return (
      <div className="App">
        <div className="container">
          <div className="row">
            <div className="column"><h1><span/></h1></div>
          </div>
          <div className="row">
            <div className="column"><center><h1>Codenames Timer</h1></center></div>
          </div>

          <Router>
            <Switch>
              <Route path="/timer-app/:room">
                <GameLink href={this.state.gameLink} name={this.state.suffix} />
                <TimerLogic linkSetter={this.setLink}/>
              </Route>
              <Route path="/timer-app">
                {this.state.suffix
                  ? <Redirect to={`/timer-app/${this.state.suffix}`} />
                  : ""
                }
                <LinkForm update={this.setLink} />
              </Route>
            </Switch>
          </Router>
        </div>
      </div>
    );
  }
}

export default App;
