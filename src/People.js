import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
    state = {
        redTeam: [
          {id: "i1", name: "Masha"},
          {id: "i2", name: "Sasha"},
          {id: "i3", name: "Natasha"}
        ],
        blueTeam: [
          {id: "i4", name: "Lena"},
          {id: "i5", name: "Igor"},
          {id: "i6", name: "Dasha"}
        ],
    };

    getList = id => this.state[id];

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
            let state = {};
            state[source.droppableId] = items;

            this.setState(state);
        } else {
            const result = move(
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            );

            this.setState({
                redTeam: result.redTeam,
                blueTeam: result.blueTeam,
            });
        }
    };

    remove(id) {
      let filterFunc = item => item.id != id;
      this.setState({
        redTeam: this.state.redTeam.filter(filterFunc),
        blueTeam: this.state.blueTeam.filter(filterFunc),
      });
    }

    render() {
      let dropables = [
        {name: "Red Team", classId: "redTeam"},
        {name: "Blue Team", classId: "blueTeam"}
      ]

      return (
        <>
          <div className="row">
            <div className="column">
              <center><h3>Team Split</h3></center>
            </div>
          </div>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <div className="row">
              {dropables.map((drp) =>
                <Droppable droppableId={drp.classId} key={drp.classId}>
                  {(provided, snapshot) => (
                      <div
                        className={`column column-50 teamStyle-${drp.classId}`}
                        ref={provided.innerRef}>
                          {this.state[drp.classId].map((item, index) => (
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
                                          {item.name} <a
                                            href="#"
                                            id={item.id}
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
