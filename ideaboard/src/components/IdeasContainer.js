import React, { Component } from 'react'
import axios from 'axios'
import Idea from './Idea'
import IdeaForm from './IdeaForm'
import update from 'immutability-helper'
import Notification from'./Notification'

class IdeasContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ideas: [],
      editingIdeaId: null,
      notification: '',
      transitionIn: false,
      draggedElementId: null
    }
  }

  componentDidMount() {
    axios.get('http://localhost:3000/api/v1/ideas.json')
    .then(response => {
      this.setState({ideas: response.data})
    })
    .catch(error => console.log(error))
  }

  addNewIdea = () => {
    axios.post('http://localhost:3000/api/v1/ideas', {idea: {title: '', body:''}})
    .then(response => {
      const ideas = update(this.state.ideas, {$splice: [[0, 0, response.data]]})
      this.setState({ideas: ideas, editingIdeaId: response.data.id})
    })
    .catch(error => console.log(error))
  }

  updateIdea = (idea) =>  {
    const ideaIndex = this.state.ideas.findIndex(x => x.id === idea.id)
    const ideas = update(this.state.ideas, {[ideaIndex]: {$set: idea}})
    this.setState({ideas: ideas, notification: 'Saved', transitionIn: true})
  }

  resetNotification = () => {
    let a = this
    debugger
    this.setState({notification: '', transitionIn: false})
  }

  enableEditing = (id) => {
    this.setState({editingIdeaId: id}, () => {this.title.focus()})
  }

  deleteIdea = (id) => {
    axios.delete(`http://localhost:3000/api/v1/ideas/${id}`)
    .then(response => {
      const ideaIndex = this.state.ideas.findIndex(x => x.id === id)
      const ideas = update(this.state.ideas, {$splice: [[ideaIndex, 1]]})
      this.setState({ideas: ideas})
    })
    .catch(error => console.log(error))
  }

  onDragOver = (event) => {
    event.preventDefault();
  }

  onDrop = (event, state) => {
    const ideaId = parseInt(event.dataTransfer.getData("id"))
    const idea = this.state.ideas.find(x => x.id === ideaId)
    idea.location = state
    const ideaIndex = this.state.ideas.findIndex(x => x.id === ideaId)
    const ideas = update(this.state.ideas, {[ideaIndex]: {$set: idea}})
    this.setState({ideas: ideas})

    axios.put(`http://localhost:3000/api/v1/ideas/${ideaId}`, {idea: idea})
    .then(response => {
      this.updateIdea(response.data)
    })
    .catch(error => console.log(error))

    this.resetNotification()
  }

  onDropOnIdea = (event, id) => {
    if (this.state.draggedElementId !== id) {
      axios.get(`http://localhost:3000/api/v1/ideas_swapping?dragged=${this.state.draggedElementId}&target=${id}`)
        .then(response => {
          const ideas = response.data
          this.setState({ideas: ideas})
      })
      .catch(error => console.log(error))
    }
  }

  onDragStart = (event, id) => {
    event.dataTransfer.setData("id", id)
    this.setState({draggedElementId: id})
  }

  render() {
    return (
      <div>
        <div className="ideasManagement">
          <button className="newIdeaButton" onClick={this.addNewIdea}> New Idea </button>
          <Notification in={this.state.transitionIn} notification={this.state.notification}/>
        </div>
        <div className="ideasList droppable" onDragOver={this.onDragOver} onDrop={(event) => this.onDrop(event, "wip")}>
          <h2>New Ideas</h2>
          {this.state.ideas.filter(idea => idea.location === "wip").map(idea => {
            if (this.state.editingIdeaId === idea.id) {
              return (<IdeaForm draggable="true" idea={idea} key={idea.id} updateIdea={this.updateIdea} resetNotification={this.resetNotification}
                titleRef={input => this.title = input}/>)
            } else {
              return (<Idea idea={idea} key={idea.id} onEdit={this.enableEditing} onDelete={this.deleteIdea}
                onDragStart={this.onDragStart} onDrop={this.onDropOnIdea}/>)
            }
          })}
        </div>
        <div className="completedIdeas droppable" onDragOver={this.onDragOver} onDrop={(event) => this.onDrop(event, "complete")}>
          <h2>Completed Ideas</h2>
          {this.state.ideas.filter(idea => idea.location === "complete").map(idea => {
            return (<Idea idea={idea} key={idea.id} onDelete={this.deleteIdea} onDragStart={this.onDragStart} onDrop={this.onDropOnIdea}/>)
          })}
        </div>
      </div>
    );
  }
}

export default IdeasContainer;
