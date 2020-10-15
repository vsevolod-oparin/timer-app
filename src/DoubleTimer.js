import React from 'react';
import NiceTime from  './NiceTime';


function NiceTimeHeader(props) {
  return (
    <center>
      <h2>
        <NiceTime time={props.time} />
      </h2>
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
      <a className={redClass} onClick={this.props.redClick} href="#">
        Red Team finished
      </a>;

    let blueButton =
      <a className={blueClass} onClick={this.props.blueClick}  href="#">
        Blue Team finished
      </a>;

    return (
      <div className="doubleTimer">
        <div className="row">
          <div className="column column-10" />
          <div className="column">
            <NiceTimeHeader time={this.props.redTime} />
          </div>
          <div className="column">
            <NiceTimeHeader time={this.props.blueTime} />
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
