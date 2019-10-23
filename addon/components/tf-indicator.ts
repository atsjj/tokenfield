import { action } from '@ember/object';
import Component from '@glimmer/component';

interface TfIndicatorArgs {
  onClick?: (event: MouseEvent) => Promise<void> | void;
}

export default class TfIndicator extends Component<TfIndicatorArgs> {
  @action onClick(event: MouseEvent) {
    if (this.args.onClick) {
      this.args.onClick(event);
    }
  }
}
