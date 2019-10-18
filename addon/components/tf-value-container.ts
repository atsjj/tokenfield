import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class TfValueContainer extends Component {
  @action
  onMouseDown(event: MouseEvent) {
    if (event.target) {
      const input = (event.target as HTMLElement).querySelector('input');

      if (input) {
        (input as HTMLInputElement).focus();
      }
    }
  }

  @action
  onDblClick(event: MouseEvent) {
    if (event.target) {
      const input = (event.target as HTMLElement).querySelector('input');

      if (input) {
        (input as HTMLInputElement).select();
      }
    }
  }
}
