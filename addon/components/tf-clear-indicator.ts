import Component from '@glimmer/component';
import { action } from '@ember/object';

interface TfClearIndicatorArgs {
  onClick?: (value: string) => Promise<void> | void;
}

export default class TfClearIndicator extends Component<TfClearIndicatorArgs> {
  @action
  onMouseDown() {
    if (this.args.onClick) {
      this.args.onClick('');
    }
  }
}
