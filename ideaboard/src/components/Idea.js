import React, { Component } from 'react'

class Idea extends Component {
  enableEditing = () => { if (this.props.idea.location === "wip") { this.props.onEdit(this.props.idea.id) }}

  handleDelete = () => { this.props.onDelete(this.props.idea.id) }

  onDragStart = (event) => { this.props.onDragStart(event, this.props.idea.id) }

  onDropOnIdea = (event) => {this.props.onDrop(event, this.props.idea.id)}

  render () {
    return(
      <div className="tile draggable" draggable onDragStart={this.onDragStart} onDrop={this.onDropOnIdea}>
        <span className="deleteIdea" onClick={this.handleDelete}>x</span>
        <h4 onClick={this.enableEditing}>{this.props.idea.title}</h4>
        <p onClick={this.enableEditing}>{this.props.idea.body}</p>
      </div>
    )
  }
}

export default Idea
