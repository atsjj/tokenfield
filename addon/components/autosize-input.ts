import { action } from '@ember/object';
import { htmlSafe } from '@ember/string';
import { SafeString } from '@glimmer/runtime';
import { tracked } from '@glimmer/tracking';
import calculateSize from '../-private/calculate-size';
import Component from '@glimmer/component';

interface AutosizeInputArgs {
  minWidth?: number;
  value: string;
}

export default class AutosizeInput extends Component<AutosizeInputArgs> {
  @tracked public value: string = this.args.value;
  @tracked public style: SafeString = htmlSafe('');

  parentRef?: HTMLElement;
  inputRef?: HTMLInputElement;

  @action
  onInput(event: InputEvent) {
    if (this.inputRef && event.target) {
      const target = (event.target as HTMLInputElement);
      const value = target.value || '';

      if (!this.parentRef && target.parentElement) {
        this.parentRef = target.parentElement;
      }

      if (this.parentRef) {
        const { width } = calculateSize(this.parentRef, value);
        this.style = htmlSafe(`width: ${width + 2}px`);
      }

      this.value = value;
    }
  }
}
