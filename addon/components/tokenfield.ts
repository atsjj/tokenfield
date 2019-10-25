import { Option, FetchOptions } from './tf-state-manager';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { action } from '@ember/object';

interface TokenfieldArgs {
  isMulti?: boolean;
  onInput: (value?: string) => Promise<void> | void;
  onSelect: (option?: Option | Option[]) => Promise<void> | void;
  options?: Option[];
  placeholder?: string;
  updateOptions?: (value?: string) => Promise<Option[]>;
  value?: string;
}

export default class Tokenfield extends Component<TokenfieldArgs> {
  @tracked private isMulti: boolean = !!this.args.isMulti;
  @tracked private options: Option[] = this.args.options || [];
  @tracked private placeholder: string = this.args.placeholder || 'Select...';
  @tracked private value: string = this.args.value || '';

  @action onInput(value?: string) {
    if (this.args.onInput) {
      this.args.onInput(value);
    } else {
      this.value = value || '';
    }
  }

  @action onSelect(option?: Option | Option[]) {
    if (this.args.onSelect) {
      this.args.onSelect(option);
    }
  }

  @action async updateOptions(value?: string): Promise<Option[]> {
    if (this.args.updateOptions) {
      return await this.args.updateOptions(value);
    } else {
      return this.options;
    }
  }
}
