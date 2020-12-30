import React from 'react';
import NiceTime from  './NiceTime';


function NiceTimeHeader(props) {
  let className = props.time === 0 ? 'time-clock-out' : '';
  return (
    <center>
      <div className={className}>
        <h2>
          <NiceTime time={props.time} />
        </h2>
      </div>
    </center>
  );
}

class DoubleTimer extends React.Component {
  render() {
    let redClass =
      this.props.redActive
      ? "button button-red"
      : "button button-red button-disable";

    let blueClass =
      this.props.blueActive
      ? "button button-blue"
      : "button button-blue button-disable";

    let redButton =
      <button className={redClass} onClick={this.props.redClick} href="#">
        Red Team{this.props.start ? ' starts' : "'s turn"}
      </button>;

    let blueButton =
      <button className={blueClass} onClick={this.props.blueClick}  href="#">
        Blue Team{this.props.start ? ' starts' : "'s turn"}
      </button>;

    let redTime = Math.max(this.props.turnTime - this.props.redTime, 0);
    let blueTime = Math.max(this.props.turnTime - this.props.blueTime, 0);

    return (
      <div className="doubleTimer">
        <div className="row">
          <div className="column column-10" />
          <div className="column">
            <NiceTimeHeader time={redTime} />
          </div>
          <div className="column">
            <NiceTimeHeader time={blueTime} />
          </div>
          <div className="column column-10" />
        </div>
        <div className="row">
          <div className="column column-10" />
          <div className="column">
            <center>
              {redButton}
            </center>
          </div>
          <div className="column">
            <center>
              {blueButton}
            </center>
          </div>
          <div className="column column-10" />
        </div>
      </div>
    );
  }
}

DoubleTimer.defaultProps = {
  redTime: 0,
  blueTime: 0,
  redActive: true,
  blueActive: true
}


export default DoubleTimer;
