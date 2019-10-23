import Component from '@glimmer/component';
import { action } from '@ember/object';

interface TfMultiValueRemoveArgs {
  onClick?: (event: MouseEvent) => Promise<void> | void;
}

export default class TfMultiValueRemove extends Component<TfMultiValueRemoveArgs> {
  @action onClick(event: MouseEvent) {
    if (this.args.onClick) {
      this.args.onClick(event);
    }
  }
}
