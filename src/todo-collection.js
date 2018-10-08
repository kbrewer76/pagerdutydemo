import _ from 'lodash';
import {
  Collection
} from 'backbone';
import {
  LocalStorage
} from 'backbone.localstorage';
import {
  TodoModel
} from './todo-model';

export let TodoCollection = Collection.extend({
  initialize(options) {
    this.model = TodoModel;
    this.localStorage = new LocalStorage('todos-traceur-backbone');
  },

  completed() {
    return this.filter(todo => todo.get('completed'));
  },

  remaining() {
    return this.without(...this.completed());
  },

  nextOrder() {
    if (!this.length) {
      return 1;
    }

    return this.last().get('order') + 1;
  },

  comparator(todo) {
    return todo.get('order');
  }
})