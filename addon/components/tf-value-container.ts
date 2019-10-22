import Component from '@glimmer/component';
import { action } from '@ember/object';

interface TfValueContainerArgs {
  onKeyDown?: (event: KeyboardEvent) => Promise<void> | void;
  onDblClick?: (event: MouseEvent) => Promise<void> | void;
  onMouseDown?: (event: MouseEvent) => Promise<void> | void;
}

export default class TfValueContainer extends Component<TfValueContainerArgs> {
  @action onKeyDown(event: KeyboardEvent) {
    if (this.args.onKeyDown) {
      this.args.onKeyDown(event);
    }
  }

  @action onDblClick(event: MouseEvent) {
    if (this.args.onDblClick) {
      this.args.onDblClick(event);
    }
  }

  @action onMouseDown(event: MouseEvent) {
    if (this.args.onMouseDown) {
      this.args.onMouseDown(event);
    }
  }
}
