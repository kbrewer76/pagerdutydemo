import _ from 'lodash';
import $ from 'jquery';
import {
  View
} from 'backbone';
import {
  TodoView
} from './todo-view';

let TodoList;
let TodoFilter;
let ENTER_KEY = 13;
export let AppView = View.extend({

  initialize(options) {
    TodoFilter = options.todofilter || '';
    TodoList = options.todolist || {};

    this.setElement($('#todoapp'), true);

    this.stat_template = (remaining, completed) => `
    <span id="todo-count"><strong>${remaining}</strong> ${remaining === 1 ? 'item' : 'items'} left</span>
    <ul id="filters">
      <li>
        <a class="selected" href="#/">All</a>
      </li>
      <li>
        <a href="#/active">Active</a>
      </li>
      <li>
        <a href="#/completed">Completed</a>
      </li>
    </ul>
    ${completed ? '<button id="clear-completed">Clear completed ('+ completed +')</button>' : ''}`;

    this.allCheckbox = this.$('#toggle-all')[0];
    this.$input = this.$('#new-todo');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');

    this.listenTo(TodoList, 'add', this.addOne);
    this.listenTo(TodoList, 'reset', this.addAll);
    this.listenTo(TodoList, 'change:completed', this.filterOne);
    this.listenTo(TodoList, 'filter', this.filterAll);
    this.listenTo(TodoList, 'all', this.render);

    TodoList.fetch();
  },

  events: {
    'keypress #new-todo': 'createOnEnter',
    'click #clear-completed': 'clearCompleted',
    'click #toggle-all': 'toggleAllComplete'
  },

  render() {
    let completed = TodoList.completed().length; // const
    let remaining = TodoList.remaining().length; // const

    if (TodoList.length) {
      this.$main.show();
      this.$footer.show();

      this.$footer.html(
        this.stat_template(remaining, completed)
      );

      this.$('#filters li a')
        .removeClass('selected')
        .filter('[href="#/' + (TodoFilter || '') + '"]')
        .addClass('selected');
    } else {
      this.$main.hide();
      this.$footer.hide();
    }

    this.allCheckbox.checked = !remaining;
  },

  addOne(model) {
    let view = new TodoView({
      model, todofilter: TodoFilter
    });
    $('#todo-list').append(view.render().el); // Why do I need the .el?
  },

  addAll() {
    this.$('#todo-list').html('');
    TodoList.each(this.addOne, this);
  },

  filterOne(todo) {
    todo.trigger('visible');
  },

  filterAll() {
    TodoList.each(this.filterOne, this);
  },

  newAttributes() {
    return {
      title: this.$input.val().trim(),
      order: TodoList.nextOrder(),
      completed: false
    };
  },

  createOnEnter(e) {
    if (e.which !== ENTER_KEY || !this.$input.val().trim()) {
      return;
    }

    TodoList.create(this.newAttributes()); // add a model to collection with create method
    this.$input.val('');
  },

  clearCompleted() {
    _.invoke(TodoList.completed(), 'destroy');
    return false;
  },

  toggleAllComplete() {
    let completed = this.allCheckbox.checked;
    TodoList.each(todo => todo.save({
      completed
    }));
  }
});