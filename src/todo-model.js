import _ from 'lodash';
import {
  Model
} from 'backbone';

export let TodoModel = Model.extend({
  defaults: {
    title: '',
    completed: false
  },

  toggle() {
    this.save({
      completed: !this.get('completed')
    });
  }
})