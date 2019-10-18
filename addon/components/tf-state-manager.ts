import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { action } from '@ember/object';

interface TfStateManagerArgs {
  onInput?: Function;
  value?: string;
  placeholder?: string;
}

interface Option {
  [key: string]: any
}

export default class TfStateManager extends Component<TfStateManagerArgs> {
  @tracked private isMenuOpen: boolean = false;
  @tracked private placeholder: string = this.args.placeholder || '';
  @tracked private value: string = this.args.value || '';
  @tracked private isLoading: boolean = false;
  @tracked private values: Option[] = [];

  get isValuePresent() {
    return this.value.trim().length > 0;
  }

  @action
  onKeyUp(event: InputEvent) {
    // console.info('TfStateManager', 'onKeyUp', ...arguments);
  }
}
