import { action } from '@ember/object';
import Component from '@glimmer/component';

interface AutosizeInputArgs {
  minWidth?: number;
  onBlur?: (event: FocusEvent) => Promise<void> | void;
  onClick?: (event: MouseEvent) => Promise<void> | void;
  onFocus?: (event: FocusEvent) => Promise<void> | void;
  onInput?: (value: string, event: InputEvent) => Promise<void> | void;
  onKeyDown?: (event: InputEvent) => Promise<void> | void;
  onKeyUp?: (event: InputEvent) => Promise<void> | void;
  value?: string;
}

export default class AutosizeInput extends Component<AutosizeInputArgs> {
  private inputRef?: HTMLInputElement;

  @action onBlur(event: FocusEvent) {
    // console.info('AutosizeInput', 'onBlur', ...arguments);

    if (this.args.onBlur) {
      this.args.onBlur(event);
    }
  }

  @action onClick(event: MouseEvent) {
    // console.info('AutosizeInput', 'onClick', ...arguments);

    if (this.args.onClick) {
      this.args.onClick(event);
    }
  }

  @action onFocus(event: FocusEvent) {
    // console.info('AutosizeInput', 'onFocus', ...arguments);

    if (this.args.onFocus) {
      this.args.onFocus(event);
    }
  }

  @action onInput(event: InputEvent) {
    // console.info('AutosizeInput', 'onInput', ...arguments);

    if (this.inputRef && event.target && this.args.onInput) {
      this.args.onInput(((event.target as HTMLInputElement).value || ''), event);
    }
  }

  @action onKeyDown(event: InputEvent) {
    // console.info('AutosizeInput', 'onKeyDown', ...arguments);

    if (this.args.onKeyDown) {
      this.args.onKeyDown(event);
    }
  }

  @action onKeyUp(event: InputEvent) {
    // console.info('AutosizeInput', 'onKeyUp', ...arguments);

    if (this.args.onKeyUp) {
      this.args.onKeyUp(event);
    }
  }
}
