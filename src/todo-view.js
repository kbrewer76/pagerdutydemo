import _ from 'lodash';
import $ from 'jquery';
import {
  View
} from 'backbone';

let TodoFilter;
export let TodoView = View.extend({

  tagName: 'li',
  initialize(options) {
    console.log('view options');
    console.log(options);
    TodoFilter = options.todofilter || '';

    this.template = ({
      completed,
      title
    }) => `
    <div class="view">
    <input class="toggle" type="checkbox"${completed ? 'checked' : ''}>
    <label>${title}</label>
    <button class="destroy"></button>
    </div>
    <input class="edit" value="${title}">
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
    'dblclick label': 'edit',
    'click .destroy': 'clear',
    'keypress .edit': 'updateOnEnter',
    'blur .edit': 'close'
  },

  render() {
    this.$el.html(this.template(this.model.toJSON()));
    this.$el.toggleClass('completed', this.model.get('completed'));
    this.toggleVisible();
    this.input = this.$('.edit');
    return this;
  },

  toggleVisible() {
    this.$el.toggleClass('hidden', this.isHidden);
  },


  /* THIS IS A DERIVED PROPERTY */
  // get isHidden() {
  //   var isCompleted = this.model.get('completed'); 
  //   return (
  //     (!isCompleted && TodoFilter === 'completed') ||
  //     (isCompleted && TodoFilter === 'active')
  //   );
  // },

  setIsHidden() {
    let isCompleted = this.model.get('completed');
    return (
      (!isCompleted && TodoFilter === 'completed') ||
      (isCompleted && TodoFilter === 'active')
    );

  },

  toggleCompleted() {
    this.model.toggle();
  },

  edit() {
    let value = this.input.val();

    this.$el.addClass('editing');
    this.input.val(value).focus();
  },

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