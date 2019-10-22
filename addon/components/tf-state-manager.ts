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
  @tracked private hoveredOption: Option | undefined;

  private containerElement: HTMLDivElement | undefined;
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

  @computed('isMulti', 'options', 'selectedOptions')
  get innerOptions(): Option[] {
    if (this.isMulti) {
      return this.options.filter(option => {
        return !this.selectedOptions.some(selectedOption => isEqual(selectedOption, option))
      });
    } else {
      return this.options;
    }
  }

  get isValuePresent() {
    return this.value.trim().length > 0;
  }

  @action openMenu() {
    if (!this.isMenuOpen) {
      this.hoveredOption = this.innerOptions[0];
      this.isFocused = true;
      this.isMenuOpen = true
    }
  }

  @action nextMenuOption() {
    const min = 0;

    this.openMenu();

    if (this.hoveredOption) {
      let index = this.innerOptions.findIndex(option => isEqual(option, this.hoveredOption)) + 1;

      if (index >= this.innerOptions.length) {
        index = min;
      }

      this.hoveredOption = this.innerOptions[index];
    } else {
      this.hoveredOption = this.innerOptions[min];
    }
  }

  @action prevMenuOption() {
    const max = this.innerOptions.length - 1;

    this.openMenu();

    if (this.hoveredOption) {
      let index = this.innerOptions.findIndex(option => isEqual(option, this.hoveredOption)) - 1;

      if (index < 0) {
        index = max;
      }

      this.hoveredOption = this.innerOptions[index];
    } else {
      this.hoveredOption = this.innerOptions[max];
    }
  }

  @action closeMenu(shouldBlur?: boolean) {
    if (this.isMenuOpen) {
      this.hoveredOption = undefined;
      this.isFocused = false;
      this.isMenuOpen = false;
      this.value = '';

      if (shouldBlur && this.containerElement) {
        if (document.activeElement && this.containerElement.contains(document.activeElement)) {
          (document.activeElement as HTMLElement).blur();
        }
      }
    }
  }

  @action selectMenuOption(option?: Option): boolean {
    const selectedOption = option || this.hoveredOption;

    if (selectedOption) {
      if (this.isMulti) {
        this.selectedOptions.push(selectedOption);
        this.selectedOptions = this.selectedOptions;
      } else {
        this.selectedOption = selectedOption;
      }

      this.closeMenu();

      return true;
    } else {
      this.closeMenu(true);

      return false;
    }
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

  @action onContainerKeyDown(event: KeyboardEvent) {
    // console.info('TfStateManager', 'onContainerKeyDown', event);
    switch (event.key) {
      case 'ArrowDown': {
        this.nextMenuOption();
        break;
      }
      case 'ArrowUp': {
        this.prevMenuOption();
        break;
      }
    }
  }

  /**
   * Focus Event Handler for Input
   */
  @action onInputFocus() {
    this.openMenu();
  }

  /**
   * KeyUp Event Handler for Input
   *
   * Escape - Blur and clear the input.
   *
   * @param event
   */
  @action onInputKeyUp(event: KeyboardEvent) {
    switch (event.key) {
      case 'Escape': {
        this.closeMenu();

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
      case 'Enter': {
        if (event.keyCode === 229) {
          break;
        }

        this.selectMenuOption();

        break;
      }
      case 'Tab': {
        if (this.selectMenuOption()) {
          event.preventDefault();
        }
        break;
      }
    }
  }

  /**
   * Blur Event Handler for Input
   */
  @action onInputBlur() {
    this.closeMenu();
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
    this.selectMenuOption(option);
  }

  @action onOptionMouseOut(_: MouseEvent, option: Option) {
    // console.info('TfStateManager', 'onOptionMouseOut', ...arguments);
    if (isEqual(this.hoveredOption, option)) {
      this.hoveredOption = undefined;
    }
  }

  @action onOptionMouseOver(_: MouseEvent, option: Option) {
    // console.info('TfStateManager', 'onOptionMouseOver', ...arguments);
    this.hoveredOption = option;
  }

  onBlur(event: MouseEvent) {
    if (this.containerElement && event.target) {
      if (!this.containerElement.contains(event.target as HTMLElement)) {
        this.closeMenu();
      }
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
