import { action } from '@ember/object';
import { Option } from './tf-state-manager';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';

interface TokenfieldArgs {
  isMulti?: boolean;
  onInput: (value?: string) => Promise<void> | void;
  onSelect: (option?: Option | Option[]) => Promise<void> | void;
  options?: Option[];
  placeholder?: string;
  updateOptions?: (value?: string) => Promise<Option[]>;
  value?: string;
  selectedOption?: Option;
  selectedOptions?: Option[];
  stringifyOption?: (option: Option) => string;
  labelKey?: string;
  valueKey?: string;
}

export default class Tokenfield extends Component<TokenfieldArgs> {
  @tracked private isMulti: boolean = !!this.args.isMulti;
  @tracked private options: Option[] = this.args.options || [];
  @tracked private placeholder: string = this.args.placeholder || 'Select...';
  @tracked private selectedOption: Option | undefined = this.args.selectedOption;
  @tracked private selectedOptions: Option[] = this.args.selectedOptions || [];
  @tracked private value: string = this.args.value || '';
  @tracked private labelKey: string = this.args.labelKey || 'label';
  @tracked private valueKey: string = this.args.valueKey || 'value';
  @tracked private stringifyOption: ((option: Option) => string) | undefined = this.args.stringifyOption;

  @action onInput(value?: string) {
    this.value = value || '';

    if (this.args.onInput) {
      this.args.onInput(value);
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

  _() {
    console.info(
      this.isMulti,
      this.placeholder,
      this.selectedOption,
      this.selectedOptions,
      this.value,
      this.labelKey,
      this.valueKey,
      this.stringifyOption
    )
  }
}
