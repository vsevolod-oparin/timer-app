import React from 'react';
import LinkForm from  './LinkForm';

class TimeSettings extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  niceTime(val) {
    val /= 1000;
    return Math.floor(val / 60) + ":" + (val % 60).toString().padStart(2, "0");
  }

  parse(val) {
    let tokens = val.split(':');
    let res = 0;
    for (var i = 0; i < tokens.length; ++i) {
      res *= 60;
      res += parseInt(tokens[i]);
    }
    return res * 1000;
  }

  handleChange(event) {
    const target = event.target;
    this.props.timeUpdate(target.id, this.parse(target.value));
  }

  render() {
    console.log(this.props);

    return (
      <div>
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
                  <label htmlFor="firstTurn">First Turn: </label>
                  <input
                    type="text"
                    placeholder="mm:ss"
                    id="firstTurn"
                    defaultValue={this.niceTime(this.props.firstTurn)}
                    onChange={this.handleChange} />
                </div>
                <div className="column column-40">
                  <label htmlFor="turn">Other Turns: </label>
                  <input
                    type="text"
                    placeholder="mm:ss"
                    id="turn"
                    defaultValue={this.niceTime(this.props.turn)}
                    onChange={this.handleChange} />
                </div>
                <div className="column column-10" />
              </div>
            </div>
          </fieldset>
        </form>
        <LinkForm update={this.props.update}/>
      </div>
    );
  }
}

export default TimeSettings;
