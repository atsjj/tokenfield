import { Option, FetchOptions } from './tf-state-manager';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { action } from '@ember/object';

interface TokenfieldArgs {
  value?: string;
  placeholder?: string;
  options?: Option[] | FetchOptions;
  onSelect: (option: Option | Option[]) => Promise<void> | void;
}

export default class Tokenfield extends Component<TokenfieldArgs> {
  @tracked private value: string = this.args.value || '';
  @tracked private placeholder: string = this.args.placeholder || '';

  @action onSelect(option: Option | Option[]) {
    if (this.args.onSelect) {
      this.args.onSelect(option);
    }
  }
}
