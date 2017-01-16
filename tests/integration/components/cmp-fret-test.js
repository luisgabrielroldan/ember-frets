import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('cmp-fret', 'Integration | Component | cmp fret', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{cmp-fret}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#cmp-fret}}
      template block text
    {{/cmp-fret}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
