import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['fret'],
	attributeBindings: ['style'],

	style: Ember.computed('fret.offset','height', function() {
		let offset = this.get('fret.offset');
		let height = this.get('height');
		return Ember.String.htmlSafe(`top: ${offset}px; height: ${height}px`);
	})

});
