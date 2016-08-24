/**
 * components
 *
 */
var TodoItem = React.createClass({
  handleClick: function() {
    var self = this;
    $.ajax({
      url: this.props.url + '/' + this.props.data.id,
      type: 'DELETE',
      success: function(result) {
        self.props.onItemUpdated();
      },
      error: function() {
        console.log('error on delete!');
      }
    });
  },

  handleCheckboxClick: function() {
    var self = this;
    $.ajax({
      url: this.props.url + '/' + this.props.data.id + '/edit',
      type: 'GET',
      success: function(result) {
        self.props.onItemUpdated();
      },
      error: function() {
        console.log('error on check!');
      }
    });
  },

  render: function() {
    return (
      <div className="todo-item-list">
        <input type="checkbox" onChange={this.handleCheckboxClick} checked={this.props.data.completed} /> 
        <span style={this.props.data.completed ? {textDecoration: 'line-through'} : {}}>{this.props.data.description}</span> 
        <button
          className="btn-todo-delete"
          onClick={this.handleClick}>x</button>
      </div>
    );
  }
});

var TodoList = React.createClass({
  render: function() {
    var self = this;
    return (
      <div className="todos-list">
        {this.props.data.map(function(data) {
          return (
            <TodoItem
              key={data.id}
              data={data}
              url={self.props.url}
              onItemUpdated={self.props.onItemUpdated} />
          );
        })}
      </div>
    );
  }
});

var CreateForm = React.createClass({
  getInitialState: function() {
    return {
      description: ''
    };
  },

  handleSubmit: function(event) {
    event.preventDefault();
    var description = this.state.description.trim();

    this.props.onAddNewItem({description: description, completed: false});
  },

  handleDescriptionChange: function(event) {
    this.setState({description: event.target.value});
  },

  render: function() {
    return (
      <form onSubmit={this.handleSubmit} >
        <input type="text" value={this.state.description} onChange={this.handleDescriptionChange} />
        <input type="submit" value="Add" />
      </form>
    );
  }
});

/**
 * Component container
 *
 */
var App = React.createClass({
  getInitialState: function() {
    return {
      data: []
    };
  },

  componentWillMount: function() {
    this.getTodos();
  },

  getTodos: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  handleAddNewItem: function(newTodo) {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: newTodo,
      success: function(data) {
        this.setState({data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  handleDeletedItem: function() {
    // re-render components
    this.getTodos();
  },

  render: function() {
    return (
      <div className="todos-container">
        <CreateForm onAddNewItem={this.handleAddNewItem} />
        <TodoList url={this.props.url} data={this.state.data} onItemUpdated={this.handleDeletedItem} />
      </div>
    );
  }
});

////////////////////////////////
// render
////////////////////////////////
ReactDOM.render(
  <App url="/api/todos" />,
  document.getElementById('content')
);