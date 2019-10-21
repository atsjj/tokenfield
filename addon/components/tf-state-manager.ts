import { action, computed } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { isEqual } from '@ember/utils';

interface TfStateManagerArgs {
  onInput?: Function;
  value?: string;
  placeholder?: string;
}

export interface Option {
  value: string,
  label: string,
  [key: string]: any
}

const defaultOptions: Option[] = [
  {
    label: 'Red',
    value: 'red',
  },
  {
    label: 'Green',
    value: 'green',
  },
  {
    label: 'Blue',
    value: 'blue',
  },
  {
    label: 'Cyan',
    value: 'cyan',
  },
  {
    label: 'Magenta',
    value: 'magenta',
  },
  {
    label: 'Yellow',
    value: 'yellow',
  },
  {
    label: 'Black',
    value: 'black',
  },
];

const selectedOptions: Option[] = [
  {
    label: 'Orange',
    value: 'orange',
  }
];

export default class TfStateManager extends Component<TfStateManagerArgs> {
  @tracked private isMulti: boolean = true;
  @tracked private isFocused: boolean = false;
  @tracked private isMenuOpen: boolean = false;
  @tracked private placeholder: string = this.args.placeholder || '';
  @tracked private value: string = this.args.value || '';
  @tracked private isLoading: boolean = false;
  @tracked private selectedOption: Option | undefined;
  @tracked private selectedOptions: Option[] = selectedOptions;
  @tracked private options: Option[] = defaultOptions;

  private element: HTMLDivElement | undefined;
  private lastValueLength: number = (this.args.value || '').length;

  debug() {
    this.isMenuOpen;
    this.placeholder;
    this.isLoading;
    this.isMulti;
    this.selectedOption;
  }

  get classesForTfControl(): string {
    if (this.isFocused) {
      return 'tf-control-focused';
    } else {
      return '';
    }
  }

  @computed('options', 'selectedOptions')
  get innerOptions(): Option[] {
    return this.options.filter(option => !this.selectedOptions.some(selectedOption => isEqual(selectedOption, option)));
  }

  get isValuePresent() {
    return this.value.trim().length > 0;
  }

  @action popOption(): Option | undefined {
    const value = this.selectedOptions.pop();

    this.selectedOptions = this.selectedOptions;

    return value;
  }

  @action pushOption(...value: Option[]) {
    this.selectedOptions.push(...value);

    this.selectedOptions = this.selectedOptions;
  }

  /**
   * Focus Event Handler for Input
   */
  @action onInputFocus() {
    this.isFocused = true;
    this.isMenuOpen = true;
  }

  /**
   * KeyUp Event Handler for Input
   *
   * Escape - Blur and clear the input.
   *
   * @param event
   */
  @action onInputKeyUp(event: KeyboardEvent) {
    const inputElement = (event.target as HTMLInputElement);

    switch (event.key) {
      case 'Escape': {
        if (inputElement) {
          inputElement.blur();
        }

        break;
      }
    }
  }

  /**
   * KeyDown Event Handler for Input
   *
   * Tab - In order to assist tab completion, this must happen on key down in order to prevent
   *       the default behavior of going to the next field in the browser.
   *
   * @param event
   */
  @action onInputKeyDown(event: KeyboardEvent) {
    this.lastValueLength = this.value.length;

    switch (event.key) {
      case 'Backspace': {
        if (this.lastValueLength <= 0) {
          this.popOption();
        }

        break;
      }
      case 'Tab': {
        event.preventDefault();
        break;
      }
    }
  }

  /**
   * Blur Event Handler for Input
   */
  @action onInputBlur() {
    this.isFocused = false;
    this.isMenuOpen = false;
    this.value = '';
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
    // console.info('TfStateManager', 'onOptionClick', ...arguments);

    if (this.isMulti) {
      this.selectedOptions.push(option);
      this.selectedOptions = this.selectedOptions;
    } else {
      this.selectedOption = option;
    }
  }

  onBlur(event: MouseEvent) {
    if (this.element && event.target) {
      if (!this.element.contains(event.target as HTMLElement)) {
        this.isFocused = false;
        this.isMenuOpen = false;
        this.value = '';
      }
    }
  }

  @action onInsert(element: HTMLDivElement) {
    this.element = element;

    document.addEventListener('click', this.onBlur.bind(this));
  }

  @action onDestroy() {
    this.element = undefined;

    document.removeEventListener('click', this.onBlur.bind(this));
  }
}
