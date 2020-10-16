import React from 'react';
import NiceTime from  './NiceTime';

class TimeList extends React.Component {
  render() {
    const listItems = this.props.story.map((token) =>
      <tr key={token.idx}>
        <td>
          <b className={"record-" + token.team}>
            {token.team === 'red' ? 'R' : 'B'}
            <NiceTime time={token.time} />
          </b>
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

export default TimeList;
