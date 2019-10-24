import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | join', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it renders', async function(assert) {
    this.set('inputValue', '1234');

    await render(hbs`{{join inputValue}}`);

    if (this.element && this.element.textContent) {
      assert.equal(this.element.textContent.trim(), '1234');
    } else {
      assert.ok(false, 'this.element.textContent is null');
    }
  });
});
