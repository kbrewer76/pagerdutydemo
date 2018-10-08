import $ from 'jquery';
import {AppView} from './app-view';
import {AppRouter} from './router';
import {TodoCollection} from './todo-collection';

let TodoList = new TodoCollection();
let TodoFilter = ''; // Default Route is empty

$(() => {
  new AppView({todolist: TodoList, todofilter: TodoFilter});
  new AppRouter({todolist: TodoList, todofilter: TodoFilter});
  Backbone.history.start();
});