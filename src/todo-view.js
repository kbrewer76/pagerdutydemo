import _ from 'lodash';
import $ from 'jquery';
import {
  View
} from 'backbone';

let TodoFilter;
export let TodoView = View.extend({

  tagName: 'li',
  initialize(options) {
    TodoFilter = options.todofilter || '';

    this.template = ({
      completed,
      title
    }) => `
    <div class="view" style="position:relative">
    <div style="display:inline-block">
    <input class="toggle" type="checkbox"${completed ? 'checked' : ''}>
    <label>${title}</label>
    </div>
    <div style="display:inline-block; float:right">
    <a class="destroy">Delete</a>
    </div>
    </div>
    `;

    this.input = '';
    this.model = options.model || {};

    this.isHidden = this.setIsHidden();

    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
    this.listenTo(this.model, 'visible', this.toggleVisible);
  },

  events: {
    'click .toggle': 'toggleCompleted',
    // 'dblclick label': 'edit',
    'click .destroy': 'clear',
    'keypress .edit': 'updateOnEnter',
    'blur .edit': 'close'
  },

  render() {
    this.$el.html(this.template(this.model.toJSON()));
    this.$el.toggleClass('completed', this.model.get('completed'));
    this.$el.find('label').toggleClass('markcomplete', this.model.get('completed'));
    this.toggleVisible();
    this.input = this.$('.edit');
    return this;
  },

  toggleVisible() {
    this.$el.toggleClass('hidden', this.isHidden);
  },


  setIsHidden() {
    let isCompleted = this.model.get('completed');
    return (
      (!isCompleted && TodoFilter === 'completed') ||
      (isCompleted && TodoFilter === 'active')
    );

  },

  toggleCompleted(evt) {
    this.model.toggle();
    this.$el.find('label').toggleClass('markcomplete', this.model.get('completed'));
  },

  // edit() {
  //   let value = this.input.val();

  //   this.$el.addClass('editing');
  //   this.input.val(value).focus();
  // },

  close() {
    let title = this.input.val();

    if (title) {
      this.model.save({
        title
      });
    } else {
      this.clear();
    }

    this.$el.removeClass('editing');
  },


  updateOnEnter(e) {
    if (e.which === ENTER_KEY) {
      this.close();
    }
  },

  clear() {
    this.model.destroy();
  }
});