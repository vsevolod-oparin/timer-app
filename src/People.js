import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './styles.css';

const redDesignators = ['r', 'R', 'red', 'RED', 'Red'];
const blueDesignators = ['b', 'B', 'blue', 'BLUE', 'Blue'];

function parse(inputString) {
  let tokens = inputString.split(",").map(item => item.trim());
  let players = tokens.map(token => {
    let subtokens = token.split(' ');
    let teamAsigned = "";
    teamAsigned =
      subtokens.some(sub => redDesignators.includes(sub))
      ? "redTeam" : teamAsigned;
    teamAsigned =
      subtokens.some(sub => blueDesignators.includes(sub))
      ? "blueTeam" : teamAsigned;
    let name = subtokens.filter(sub =>
      !redDesignators.includes(sub) &&
      !blueDesignators.includes(sub)
    ).join(' ').trim();
    if (name) {
      return {team: teamAsigned, name: name};
    } else {
      return null;
    }
  });
  return players.filter(x => x);
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    color: isDragging ? '#d98b12' : '',
    // styles we need to apply on draggables
    ...draggableStyle
});

class People extends Component {
    constructor(props) {
      super(props);

      this.addPlayers = this.addPlayers.bind(this);
      this.shuffle = this.shuffle.bind(this);
      this.add = this.add.bind(this);
      this.clean = this.clean.bind(this);
    }

    clean() {
      this.props.upState({redTeam: [], blueTeam: []}, true);
    }

    add(event) {
      this.props.upState(
        this.addPlayers(
          parse(event.target.teaminp.value),
          this.props
        )
      );
      event.target.teaminp.value = "";
    }

    shuffle(event) {
      this.props.upState(this.shuffleFunc(this.props));
    }

    shuffleFunc(props) {
      let players = props.redTeam.concat(props.blueTeam);
      shuffleArray(players);
      let mid = Math.floor(players.length / 2);
      let addon = Math.floor(Math.random() * (players.length % 2 + 1));
      return {
        redTeam: players.slice(0, mid + addon),
        blueTeam: players.slice(mid + addon)
      };
    }

    addPlayers(players, props) {
      let currentId = props.lastId;

      let redTeam = [...props.redTeam];
      let blueTeam = [...props.blueTeam];

      for (var i = 0; i < players.length; ++i) {
        let player = players[i];
        let playerObj = {
          id: `i${currentId}`,
          name: player.name,
        }
        currentId++;

        if (player.team === "") {
          if (redTeam.length <= blueTeam.length) {
            redTeam.push(playerObj);
          } else {
            blueTeam.push(playerObj);
          }
        } else if (player.team === "redTeam") {
          redTeam.push(playerObj);
        } else {
          blueTeam.push(playerObj);
        }
      }
      return {
        redTeam: redTeam,
        blueTeam: blueTeam,
        lastId: currentId,
      };
    }


    getList(id){ return this.props[id]; }

    onDragEnd = result => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                this.getList(source.droppableId),
                source.index,
                destination.index
            );
            let newProps = {};
            newProps[source.droppableId] = items;

            this.props.upState(newProps);
        } else {
            const result = move(
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            );

            this.props.upState({
                redTeam: result.redTeam,
                blueTeam: result.blueTeam,
            });
        }
    };

    remove(id) {
      let filterFunc = item => item.id !== id;
      this.props.upState({
        redTeam: this.props.redTeam.filter(filterFunc),
        blueTeam: this.props.blueTeam.filter(filterFunc),
      });
    }

    render() {
      let dropables = [
        {name: "Red Team", classId: "redTeam"},
        {name: "Blue Team", classId: "blueTeam"}
      ];

      return (
        <>
          <div className="row">
            <div className="column">
              <center><h3>Team Split</h3></center>
            </div>
          </div>

          <form onSubmit={this.add}>
            <div className="row">
              <div className="column column-10" />
              <div className="column column-50">
                <input
                  type="text"
                  placeholder="sMasha red, Seva blue, Pirozhok"
                  id="teaminp" />
              </div>
              <div className="column column-10">
                <input className="button" type="submit" value="Add" />
              </div>
              <div className="column column-5" />
              <div className="column column-10">
                <input className="button" type="submit" value="Shuffle" onClick={this.shuffle}/>
              </div>
              <div className="column column-5"/>
              <div className="column column-5">
                <input className="button" type="submit" value="Clean" onClick={this.clean}/>
              </div>
              <div className="column column-20"/>
            </div>
          </form>
          <div className="row"><div className="column"><h1><span/></h1></div></div>

          <DragDropContext onDragEnd={this.onDragEnd}>
            <div className="row">
              {dropables.map((drp) =>
                <Droppable droppableId={drp.classId} key={drp.classId}>
                  {(provided, snapshot) => (
                      <div
                        className={`column column-50 teamStyle-${drp.classId}`}
                        ref={provided.innerRef}>
                          {this.props[drp.classId].map((item, index) => (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={getItemStyle(
                                          snapshot.isDragging,
                                          provided.draggableProps.style
                                      )}>
                                      <center>
                                        <h4>
                                          {index === 0 ? '🙊 ': ''}
                                          {item.name} <a href="#" id={item.id}
                                            onClick={(e) => this.remove(e.target.id)}
                                          >
                                            x
                                          </a>
                                        </h4>
                                      </center>
                                  </div>
                                )}
                              </Draggable>
                          ))}
                          {provided.placeholder}
                      </div>
                  )}
                </Droppable>
              )}
            </div>
          </DragDropContext>
        </>
      );
    }
}

export default People;
