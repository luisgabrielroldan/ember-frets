import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

const FRET_GAUGE = 1;

export default Ember.Component.extend({

	viewport: 0,
	totalFrets: 8,
	fretHeight: 0,
	viewportInnerHeight: 0,
	startOffset: 0,

	bpm: 150,

	frets: [],

	notes: [[],[],[],[]],

	stringColors: [ '#060', '#c00', '#fc0', '#00c' ],

	insertNote(str, duration=0) {

		let size = ((this.fretHeight + FRET_GAUGE)) * (this.bpm / 60) * (duration / 1000);

		let note = Ember.Object.create({
			string: str,
			duration: duration,
			offset: -size,
			color: this.stringColors[str],
			created: performance.now(),
			size: size
		});

		this.get(`notes.${str}`).pushObject(note);
	},

	didInsertElement() {
		this._super(...arguments);

		let viewport = this.$('.frets-viewport');
		this.set('viewportInnerHeight', viewport.outerHeight());
		this.set('fretHeight', viewport.outerHeight(true) / this.totalFrets - FRET_GAUGE);
		this.set('viewport', viewport);

		let frets = this.get('frets');
		let startOffset = 0 - ((this.totalFrets) * (this.fretHeight + FRET_GAUGE));
		this.set('startOffset', startOffset);

		for (let i=0; i<this.totalFrets; i++) {
			frets.pushObject(Ember.Object.create({
				offset: startOffset + (i * (this.fretHeight + FRET_GAUGE))
			}));			
		}

		this.get('animateTask').perform();	
		this.get('exampleTabTask').perform();	
	},

	resetFrets() {
		for (let i=0; i<this.totalFrets; i++) {
			let fret = this.get('frets')[i];
			fret.set('offset', (i * (this.fretHeight + FRET_GAUGE)));
		}
	},

	animateTask: task(function * () {

		
		let lastUpdate = performance.now();

		while(true) {

			let bpm = this.get('bpm');
			let msPassed = performance.now() - lastUpdate;
			let increment = ((this.fretHeight + FRET_GAUGE) / 1000) * msPassed * (bpm / 60);

			this.animateFrets(increment);
			this.animateNotes(increment);

			lastUpdate = performance.now();
			yield timeout(10);
		}		
	}),

	animateFrets(increment) {

		for (let i=0; i<this.get('frets').length; i++) {
			let fret = this.get('frets.[]')[i];
			fret.set('offset', fret.offset+increment);
		}

		let lastFret = this.get('frets.[]')[this.get('frets').length-1];
		if (lastFret.offset > this.get('viewportInnerHeight')) {
			this.resetFrets();
		}

	},

	animateNotes(increment) {

		for (let stringIndex=0; stringIndex<this.get('notes').length; stringIndex++) {

			let notesToRemove = [];

			for (let i=0; i<this.get(`notes.${stringIndex}`).length; i++) {
				let note = this.get(`notes.${stringIndex}.${i}`);
				let newOffset = note.offset + increment;

				if (newOffset > this.get('viewportInnerHeight') + 100) {
					notesToRemove.pushObject(note);
				}

				note.set('offset', newOffset);
			}

			this.get(`notes.${stringIndex}`).removeObjects(notesToRemove);
		}

	},
	
	actions: {
		insertNote(string) {
			this.insertNote(string, 1500);
		}
	},


	exampleTab: [
		{ t: 2000, s: 0, d: 1000 },
		{ t: 2000, s: 1, d: 1000 },
		{ t: 3500, s: 2, d: 100 },
		{ t: 3750, s: 3, d: 100 },
		{ t: 4000, s: 1, d: 800 },
		{ t: 5000, s: 2, d: 100 },
		{ t: 5500, s: 3, d: 100 },
		{ t: 7000, s: 0, d: 0 },
		{ t: 7400, s: 1, d: 0 },
		{ t: 7800, s: 2, d: 0 },
		{ t: 8200, s: 3, d: 0 },
		{ t: 8600, s: 2, d: 0 },
		{ t: 9000, s: 3, d: 0 },
		{ t: 9400, s: 2, d: 0 },
		{ t: 9800, s: 3, d: 0 },
		{ t: 10200, s: 2, d: 0 },
		{ t: 10600, s: 1, d: 2000 },
	],

	exampleTabTask: task(function * () {

		let timeStart = Date.now();
		console.log(timeStart);

		for (let i=0; i<this.exampleTab.length; i++) {

			let note = this.exampleTab[i];

			while(Date.now() - timeStart < note.t) {
				yield timeout(10);
			}

			this.insertNote(note.s, note.d);
		}

	}),

});
