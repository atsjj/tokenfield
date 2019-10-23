import { action } from '@ember/object';
import { Option } from './tf-state-manager';
import Component from '@glimmer/component';

interface TfOptionArgs {
  isActive?: boolean;
  isDisabled?: boolean;
  isHovered?: boolean;
  isSelected?: boolean;
  value?: Option;
  onActivateStart?: (option: Option, event: MouseEvent) => Promise<void> | void;
  onActivateEnd?: (option: Option, event: MouseEvent) => Promise<void> | void;
  onHoverStart?: (option: Option, event: MouseEvent) => Promise<void> | void;
  onHoverEnd?: (option: Option, event: MouseEvent) => Promise<void> | void;
  onSelect?: (option: Option, event: MouseEvent) => Promise<void> | void;
}

export default class TfOption extends Component<TfOptionArgs> {
  get active(): string {
    return this.args.isActive ? 'disabled' : '';
  }

  get disabled(): string {
    return this.args.isDisabled ? 'disabled' : '';
  }

  get hover(): string {
    return this.args.isHovered ? 'hover' : '';
  }

  get selected(): string {
    return this.args.isSelected ? 'selected' : '';
  }

  @action onMouseDown(event: MouseEvent) {
    console.info('TfOption', 'onMouseDown', event);
    if (!this.args.isSelected && this.args.onActivateStart && this.args.value) {
      this.args.onActivateStart(this.args.value, event);
    }
  }

  @action onMouseOver(event: MouseEvent) {
    console.info('TfOption', 'onMouseOver', event);
    if (!this.args.isSelected && this.args.onHoverStart && this.args.value) {
      this.args.onHoverStart(this.args.value, event);
    }
  }

  @action onMouseOut(event: MouseEvent) {
    console.info('TfOption', 'onMouseOut', event);
    if (!this.args.isSelected && this.args.isActive && this.args.onActivateEnd && this.args.value) {
      this.args.onActivateEnd(this.args.value, event);
    }

    if (!this.args.isSelected && this.args.onHoverEnd && this.args.value) {
      this.args.onHoverEnd(this.args.value, event);
    }
  }

  @action onClick(event: MouseEvent) {
    console.info('TfOption', 'onClick', event);
    if (!this.args.isSelected && this.args.onSelect && this.args.value) {
      this.args.onSelect(this.args.value, event);
    }
  }
}
