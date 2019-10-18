import { action } from '@ember/object';
import Component from '@glimmer/component';

interface TfClearIndicatorArgs {
  onClick?: (value: string) => Promise<void> | void;
}

export default class TfClearIndicator extends Component<TfClearIndicatorArgs> {
  @action onMouseDown() {
    if (this.args.onClick) {
      this.args.onClick('');
    }
  }
}
