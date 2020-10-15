import React from 'react';
import TimerLogic from './TimerLogic';
import LinkForm from  './LinkForm';


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
  }


  setLink(link) {
    let tokens = link.split("/")
    if (tokens.length == 0) {
      // error
    }
    // check url
    let last = tokens[tokens.length - 1]
    this.setState({
      gameLink: link,
      suffix: last,
    })
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

          {this.state.suffix === null ? <LinkForm update={this.setLink} /> : ""}
          {this.state.suffix !== null ? <GameLink href={this.state.gameLink} name={this.state.suffix} /> : ""}
          {this.state.suffix !== null ? <TimerLogic linkSetter={this.setLink}/>: ""}
        </div>
      </div>
    );
  }
}

export default App;
