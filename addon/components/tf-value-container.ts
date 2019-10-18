import Component from '@glimmer/component';
import { action } from '@ember/object';

interface TfValueContainerArgs {
  onMouseDown?: (event: MouseEvent) => Promise<void> | void;
  onDblClick?: (event: MouseEvent) => Promise<void> | void;
}

export default class TfValueContainer extends Component<TfValueContainerArgs> {
  @action onMouseDown(event: MouseEvent) {
    if (this.args.onMouseDown) {
      this.args.onMouseDown(event);
    }
  }

  @action onDblClick(event: MouseEvent) {
    if (this.args.onDblClick) {
      this.args.onDblClick(event);
    }
  }
}
