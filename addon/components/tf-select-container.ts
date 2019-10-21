import Component from '@glimmer/component';
import { action } from '@ember/object';

interface TfSelectContainerArgs {
  onInsert?: () => Promise<void> | void;
  onDestroy?: () => Promise<void> | void;
}

export default class TfSelectContainer extends Component<TfSelectContainerArgs> {
  @action onInsert() {
    if (this.args.onInsert) {
      this.args.onInsert();
    }
  }

  @action onDestroy() {
    if (this.args.onDestroy) {
      this.args.onDestroy();
    }
  }
}
