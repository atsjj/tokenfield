import { action, computed } from '@ember/object';
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
  @tracked private value: string = this.args.value;
  private inputRef?: HTMLInputElement;

  @computed('value')
  get style(): SafeString {
    if (this.inputRef && this.inputRef.parentElement) {
      const { width } = calculateSize(this.inputRef.parentElement, this.value);

      return htmlSafe(`width: ${width + 2}px`);
    } else {
      return htmlSafe(`width: ${(this.args.minWidth || 0) + 2}px`);
    }
  }

  @action
  onInput(event: InputEvent) {
    if (this.inputRef && event.target) {
      this.value = (event.target as HTMLInputElement).value || '';
    }
  }
}
