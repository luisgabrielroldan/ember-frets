import Ember from 'ember';

const Component = Ember.Component.extend({
	classNames: ['note'],
	attributeBindings: ['style'],

	childrenStyle: Ember.computed('note.color', function() {
		let color = this.get('note.color');
		return Ember.String.htmlSafe(`background-color:${color}`);
	}),

	style: Ember.computed('note.offset', 'note.size',  function() {
		let offset = this.get('note.offset');
		let size = this.get('note.size');
		let style = `top: ${offset}px;`;

		if (size > 32) {
			style += `height:${size}px`;
		}

		return Ember.String.htmlSafe(style);
	}),

});

// Component.reopenClass({
//   positionalParams: ['note']
// });

export default Component;