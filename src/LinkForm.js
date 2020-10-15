import React from 'react';

class LinkForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    let link = event.target.gameLink.value;
    this.props.update(link);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <fieldset>
          <div className="container">
            <div className="row">
              <div className="column column-20" />
              <div className="column column-50">
                <input type="text" placeholder="https://codenames.game/room/tik-tak-toe" id="gameLink" />
              </div>
            <div className="column column-10">
                <input className="button" type="submit" value="Send" />
            </div>
            <div className="column column-20"/>
          </div>
        </div>
        </fieldset>
      </form>
    );
  }
}


export default LinkForm;
