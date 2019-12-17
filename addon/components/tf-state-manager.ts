import { action } from '@ember/object';
import { isEqual } from '@ember/utils';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import createFilter, { isPresent } from '../-private/filter';
import NativeArray from '@ember/array/-private/native-array';

export interface Option {
  value: string,
  label: string,
  [key: string]: any
}

export interface FetchOptions {
  (value?: string): Promise<Option[]>
}

interface TfStateManagerArgs {
  isMulti?: boolean;
  onInput?: (value?: string) => Promise<void> | void;
  onSelect?: (option?: Option | Option[]) => Promise<void> | void;
  options?: Option[];
  placeholder?: string;
  updateOptions?: (value?: string) => Promise<Option[]>;
  value?: string;
  selectedOption?: Option;
  selectedOptions?: Option[];
  labelKey?: string;
  valueKey?: string;
  stringifyOption?: (option: Option) => string;
}

export default class TfStateManager extends Component<TfStateManagerArgs> {
  @tracked private options: Option[] = this.args.options || [];
  @tracked private activeOption: Option | undefined;
  @tracked private hoveredOption: Option | undefined;
  @tracked private isFocused: boolean = false;
  @tracked private isLoading: boolean = false;
  @tracked private isMenuOpen: boolean = false;
  @tracked private labelKey: string | undefined = this.args.labelKey;
  @tracked private valueKey: string | undefined = this.args.valueKey;
  @tracked private stringifyOption: ((option: Option) => string) | undefined = this.args.stringifyOption;

  private containerElement: HTMLDivElement | undefined;
  private lastValueLength: number = (this.args.value || '').length;

  get selectedOption(): Option | undefined {
    return this.args.selectedOption;
  }

  get selectedOptions(): Option[] {
    return this.args.selectedOptions || [];
  }

  get placeholder(): string {
    if (this.selectedOption && !this.args.isMulti) {
      return this.selectedOption.label;
    } else {
      return this.args.placeholder || '';
    }
  }

  get focused(): string {
    return this.isFocused ? 'tf-control-focused' : '';
  }

  get isValuePresent(): boolean {
    return isPresent(this.args.value);
  }

  get isClearable(): boolean {
    return this.isValuePresent || !!this.selectedOption;
  }

  async fetchOptions(value?: string): Promise<Option[]> {
    if (this.args.updateOptions) {
      try {
        this.isLoading = true;

        return await this.args.updateOptions(value);
      } catch (error) {
        return [];
      } finally {
        this.isLoading = false;
      }
    } else {
      if (this.args.options) {
        return this.args.options;
      } else {
        return [];
      }
    }
  }

  async filterOptions(value?: string): Promise<Option[]> {
    const filter = (!!this.stringifyOption) ? createFilter(value, { stringify: this.stringifyOption }) : createFilter(value);

    return (await this.fetchOptions(value))
      .filter(option => filter(option) && !this.isSelected(option));
  }

  isSelected(option: Option): boolean {
    if (this.selectedOptions && this.selectedOptions['some']) {
      return this.selectedOptions.some(someOption => isEqual(option, someOption));
    } else {
      return (this.selectedOptions as NativeArray<Option>).any(someOption => isEqual(option, someOption));
    }
  }

  @action async onInput(value?: string) {
    if (this.args.onInput) {
      this.args.onInput(value);
    }

    if (isPresent(value)) {
      this.openMenu(false);
    }

    this.options = await this.filterOptions(value);

    if (this.isMenuOpen) {
      this.hoveredOption = this.options[0];
    }
  }

  @action activateOption(option: Option) {
    this.activeOption = option;
  }

  @action deactivateOption(option: Option) {
    if (isEqual(this.activeOption, option)) {
      this.activeOption = undefined;
    }
  }

  @action hoverOption(option: Option) {
    this.hoveredOption = option;
  }

  @action dehoverOption(option: Option) {
    if (isEqual(this.hoveredOption, option)) {
      this.hoveredOption = undefined;
    }
  }

  @action selectOption(option?: Option): boolean {
    const value = option || this.hoveredOption;

    if (value) {
      if (this.args.isMulti) {
        if (this.args.onSelect) {
          this.args.onSelect(this.selectedOptions.concat([value]));
        }
      } else {
        if (this.args.onSelect) {
          this.args.onSelect(value);
        }
      }
    }

    this.closeMenu();

    return !!value;
  }

  @action clearValue(shouldClearSelectedOption: boolean = false) {
    if (this.isValuePresent) {
      this.onInput();
    } else if (shouldClearSelectedOption) {
      if (this.args.onSelect) {
        this.args.onSelect(undefined);
      }
    }
  }

  @action openMenu(setHoveredOption: boolean = true) {
    if (!this.isMenuOpen) {
      this.isMenuOpen = true
    }

    if (!this.hoveredOption && setHoveredOption) {
      this.hoveredOption = this.options[0];
    } else {
      this.hoveredOption = undefined;
    }

    if (!this.isFocused) {
      this.isFocused = true;
    }
  }

  @action nextMenuOption() {
    const min = 0;

    if (this.hoveredOption) {
      let index = this.options.findIndex(option => isEqual(option, this.hoveredOption)) + 1;

      if (index >= this.options.length) {
        index = min;
      }

      this.hoveredOption = this.options[index];
    } else {
      this.hoveredOption = this.options[min];
    }
  }

  @action prevMenuOption() {
    const max = this.options.length - 1;

    if (this.hoveredOption) {
      let index = this.options.findIndex(option => isEqual(option, this.hoveredOption)) - 1;

      if (index < 0) {
        index = max;
      }

      this.hoveredOption = this.options[index];
    } else {
      this.hoveredOption = this.options[max];
    }
  }

  @action closeMenu(shouldBlur?: boolean) {
    this.activeOption = undefined;
    this.hoveredOption = undefined;
    this.isMenuOpen = false;

    if (shouldBlur && this.containerElement) {
      if (document.activeElement && this.containerElement.contains(document.activeElement)) {
        (document.activeElement as HTMLElement).blur();
        this.isFocused = false;
      }
    }
  }

  @action removeOption(option: Option) {
    const selectedOptions = this.selectedOptions
      .filter(selectedOption => !isEqual(selectedOption, option));

    if (this.args.onSelect) {
      this.args.onSelect(selectedOptions);
    }
  }

  @action popOption(): Option | undefined {
    const selectedOptions = Array.from(this.selectedOptions);
    const value = selectedOptions.pop();

    this.onInput();

    if (this.args.onSelect) {
      this.args.onSelect(this.args.isMulti ? selectedOptions : undefined);
    }

    return value;
  }

  /**
   * Focus Event Handler for Input
   */
  @action focus() {
    this.isFocused = true;
  }

  @action blur() {
    this.isFocused = false;
  }

  @action handleAccelerator(event: KeyboardEvent) {
    this.lastValueLength = this.args.value ? this.args.value.length : 0;

    switch (event.key) {
      case 'ArrowDown': {
        if (this.isMenuOpen) {
          this.nextMenuOption();
        } else {
          this.openMenu(true);
        }

        break;
      }
      case 'ArrowUp': {
        if (this.isMenuOpen) {
          this.prevMenuOption();
        } else {
          this.openMenu(true);
        }

        break;
      }
      case 'Backspace': {
        if (this.lastValueLength <= 0) {
          this.popOption();
        }

        break;
      }
      case 'Enter': {
        if (event.keyCode === 229) {
          break;
        }

        this.selectOption();
        this.clearValue();

        break;
      }
      case 'Escape': {
        this.closeMenu();

        break;
      }
      case 'Tab': {
        if (this.selectOption()) {
          event.preventDefault();
        }

        this.clearValue();
        this.closeMenu();

        break;
      }
      default: {

      }
    }
  }

  /**
   * Blur Event Handler for Input
   */
  @action onInputBlur() {
    if (this.containerElement) {
      if (!document.activeElement && this.containerElement.contains(document.activeElement)) {
        this.closeMenu(true);
      }
    }
  }

  /**
   * MouseDown Event Handler for Input
   *
   * @param event
   */
  @action onInputMouseDown(event: MouseEvent) {
    if (event.target) {
      const input = (event.target as HTMLElement).querySelector('input');

      if (input) {
        (input as HTMLInputElement).focus();
      }
    }
  }

  /**
   * DblClick Event Handler for Input
   *
   * @param event
   */
  @action onInputDblClick(event: MouseEvent) {
    if (event.target) {
      const input = (event.target as HTMLElement).querySelector('input');

      if (input) {
        (input as HTMLInputElement).select();
      }
    }
  }

  @action onOptionClick(_: MouseEvent, option: Option) {
    this.selectOption(option);
  }

  @action onOptionMouseOut(_: MouseEvent, option: Option) {
    if (isEqual(this.hoveredOption, option)) {
      this.hoveredOption = undefined;
    }
  }

  @action onOptionMouseOver(_: MouseEvent, option: Option) {
    this.hoveredOption = option;
  }

  @action onBlur(_: FocusEvent) {
    const el = this.containerElement;
    const activeEl = document.activeElement;

    if (!el || !activeEl || (el && !el.contains(activeEl) && !isEqual(el, activeEl))) {
      this.isFocused = false;
      this.closeMenu();
    }
  }

  @action onInsert(element: HTMLDivElement) {
    this.containerElement = element;

    document.addEventListener('click', this.onBlur.bind(this));
  }

  @action onDestroy() {
    this.containerElement = undefined;

    document.removeEventListener('click', this.onBlur.bind(this));
  }
}
