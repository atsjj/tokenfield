import { action, computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import { SafeString } from '@glimmer/runtime';
import calculateSize from '../-private/calculate-size';
import Component from '@glimmer/component';

interface AutosizeInputArgs {
  minWidth?: number;
  onBlur?: (event: InputEvent) => Promise<void> | void;
  onFocus?: (event: InputEvent) => Promise<void> | void;
  onInput?: (value: string, event: InputEvent) => Promise<void> | void;
  onKeyDown?: (event: InputEvent) => Promise<void> | void;
  onKeyUp?: (event: InputEvent) => Promise<void> | void;
  value?: string;
}

export default class AutosizeInput extends Component<AutosizeInputArgs> {
  private inputRef?: HTMLInputElement;

  get value(): string {
    return (this.args && this.args.value) ? this.args.value : '';
  }

  get minWidth(): number {
    return (this.args && this.args.minWidth) ? this.args.minWidth : 0;
  }

  @computed('args.minWidth', 'args.value')
  get style(): SafeString {
    const width = ((this.inputRef && this.inputRef.parentElement) ?
      calculateSize(this.inputRef.parentElement, this.value).width : this.minWidth) + 2;

    return htmlSafe(`width: ${width}px`);
  }

  @action onBlur(event: InputEvent) {
    // console.info('AutosizeInput', 'onBlur', ...arguments);

    if (this.args.onBlur) {
      this.args.onBlur(event);
    }
  }

  @action onFocus(event: InputEvent) {
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
