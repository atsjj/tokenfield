import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';

interface TfStateManagerArgs {
  onInput?: Function;
  value?: string;
  placeholder?: string;
}

interface Option {
  value: string,
  label: string,
  [key: string]: any
}

const defaultOptions: Option[] = [
  {
    label: 'Orange',
    value: 'orange',
  },
  {
    label: 'Yellow',
    value: 'yellow',
  },
];

const selectedOptions: Option[] = [
  {
    label: 'Orange',
    value: 'orange',
  },
  {
    label: 'Yellow',
    value: 'yellow',
  },
];

export default class TfStateManager extends Component<TfStateManagerArgs> {
  @tracked private isFocused: boolean = false;
  @tracked private isMenuOpen: boolean = false;
  @tracked private placeholder: string = this.args.placeholder || '';
  @tracked private value: string = this.args.value || '';
  @tracked private isLoading: boolean = false;
  @tracked private defaultOptions: Option[] = defaultOptions;
  @tracked private loadedOptions: Option[] = [];
  @tracked private selectedOptions: Option[] = selectedOptions;

  get classesForTfControl(): string {
    if (this.isFocused) {
      return 'tf-control-focused';
    } else {
      return '';
    }
  }

  get options(): Option[] {
    // if (this.isValuePresent) {
    //   return this.loadedOptions;
    // } else {
    //   return this.defaultOptions;
    // }
    return this.defaultOptions;
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
    // console.info('TfStateManager', 'onInputKeyUp', event);
    const inputElement = (event.target as HTMLInputElement);

    switch (event.key) {
      case 'Backspace': {
        if (!this.isValuePresent) {
          this.popOption();
        }

        break;
      }
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
    console.info('TfStateManager', 'onInputKeyDown', event);
    // const inputElement = (event.target as HTMLInputElement);

    switch (event.key) {
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
}
