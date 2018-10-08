import {
  Router
} from 'backbone';

let TodoFilter;
let TodoList;

export let AppRouter = Router.extend({

  constructor(options) {
    console.log('options in router');
    console.log(options);

    // Pull in Global Objects - only want one instance of the collection
    TodoFilter = options.todofilter || '';
    TodoList = options.todolist || {};

    this.routes = {
      '*filter': 'showRoute'
    }

    this._bindRoutes();
  },

  showRoute(param = '') {
    console.log('the parama', param);
    TodoFilter = param;
    TodoList.trigger('filter');
  }
})