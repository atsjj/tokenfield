import { action } from '@ember/object';
import { Option } from './tf-state-manager';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';

interface TfOptionArgs {
  onClick?: (event: MouseEvent, option: Option) => Promise<void> | void;
  isSelected?: boolean;
  value: Option;
}

export default class TfOption extends Component<TfOptionArgs> {
  @tracked private isSelected: boolean = this.args.isSelected || false;
  @tracked private isDisabled: boolean = false;

  get selected(): string {
    return this.isSelected ? 'selected' : '';
  }

  get disabled(): string {
    return this.isDisabled ? 'disabled' : '';
  }

  @action onClick(event: MouseEvent) {
    if (this.args.onClick) {
      this.args.onClick(event, this.args.value);
    }
  }
}
