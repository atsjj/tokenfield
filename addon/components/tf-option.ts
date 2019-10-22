import { action } from '@ember/object';
import { Option } from './tf-state-manager';
import Component from '@glimmer/component';

interface TfOptionArgs {
  isDisabled?: boolean;
  isHovered?: boolean;
  isSelected?: boolean;
  onClick?: (event: MouseEvent, option: Option) => Promise<void> | void;
  onMouseOut?: (event: MouseEvent, option: Option) => Promise<void> | void;
  onMouseOver?: (event: MouseEvent, option: Option) => Promise<void> | void;
  value: Option;
}

export default class TfOption extends Component<TfOptionArgs> {
  get disabled(): string {
    return this.args.isDisabled ? 'disabled' : '';
  }

  get hover(): string {
    return this.args.isHovered ? 'hover' : '';
  }

  get selected(): string {
    return this.args.isSelected ? 'selected' : '';
  }

  @action onMouseOver(event: MouseEvent) {
    // console.info('TfOption', 'onMouseOver', event);
    if (this.args.onMouseOver) {
      this.args.onMouseOver(event, this.args.value);
    }
  }

  @action onMouseOut(event: MouseEvent) {
    // console.info('TfOption', 'onMouseOut', event);
    if (this.args.onMouseOut) {
      this.args.onMouseOut(event, this.args.value);
    }
  }

  @action onClick(event: MouseEvent) {
    if (this.args.onClick) {
      this.args.onClick(event, this.args.value);
    }
  }
}
