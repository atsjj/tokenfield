import { action } from '@ember/object';
import { isEqual } from '@ember/utils';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import createFilter, { isPresent } from '../-private/filter';

export interface Option {
  value: string,
  label: string,
  [key: string]: any
}

interface TfStateManagerArgs {
  onInput?: Function;
  value?: string;
  placeholder?: string;
  options?: Option[];
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
  @tracked private isLoading: boolean = false;

  private containerElement: HTMLDivElement | undefined;
  private lastValueLength: number = (this.args.value || '').length;

  @tracked private options: Option[] = this.args.options || defaultOptions;
  @tracked private value: string = this.args.value || '';
  @tracked private filteredOptions: Option[] = this.options;
  @tracked private activeOption: Option | undefined;
  @tracked private hoveredOption: Option | undefined;
  @tracked private selectedOption: Option | undefined;
  @tracked private selectedOptions: Option[] = selectedOptions;

  get debug() {
    return [
      this.placeholder,
      this.isLoading,
      this.selectedOption,
    ];
  }

  get focused(): string {
    return this.isFocused ? 'tf-control-focused' : '';
  }

  get isValuePresent(): boolean {
    return isPresent(this.value);
  }

  @action filterOptions(value?: string) {
    console.info('TfStateManager', 'filterOptions', ...arguments);
    const filter = createFilter(value || '');

    this.value = value || '';

    this.filteredOptions = this.options.filter(option => {
      return ((this.isValuePresent ? filter(option) : true) &&
        !this.selectedOptions.some(selectedOption => isEqual(option, selectedOption)));
    });
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
      if (this.isMulti) {
        this.selectedOptions.push(value);
        this.selectedOptions = this.selectedOptions;
      } else {
        this.selectedOption = value;
      }

      this.closeMenu();

      return true;
    } else {
      this.closeMenu();

      return false;
    }
  }

  @action clearValue() {
    this.filterOptions();
  }

  @action openMenu(setHoveredOption: boolean = true) {
    console.info('TfStateManager', 'openMenu');
    if (!this.isMenuOpen) {
      if (!this.hoveredOption && setHoveredOption) {
        this.hoveredOption = this.filteredOptions[0];
      }
      this.isFocused = true;
      this.isMenuOpen = true
    }
  }

  @action nextMenuOption() {
    const min = 0;

    if (this.hoveredOption) {
      let index = this.filteredOptions.findIndex(option => isEqual(option, this.hoveredOption)) + 1;

      console.info('TfStateManager', 'nextMenuOption', index);

      if (index >= this.filteredOptions.length) {
        index = min;
      }

      this.hoveredOption = this.filteredOptions[index];
    } else {
      this.hoveredOption = this.filteredOptions[min];
    }
  }

  @action prevMenuOption() {
    const max = this.filteredOptions.length - 1;

    if (this.hoveredOption) {
      let index = this.filteredOptions.findIndex(option => isEqual(option, this.hoveredOption)) - 1;

      console.info('TfStateManager', 'prevMenuOption', index);

      if (index < 0) {
        index = max;
      }

      this.hoveredOption = this.filteredOptions[index];
    } else {
      this.hoveredOption = this.filteredOptions[max];
    }
  }

  @action closeMenu(shouldBlur?: boolean) {
    this.activeOption = undefined;
    this.hoveredOption = undefined;
    this.isMenuOpen = false;
    this.filterOptions();

    if (shouldBlur && this.containerElement) {
      if (document.activeElement && this.containerElement.contains(document.activeElement)) {
        console.info('TfStateManager', 'closeMenu', 'fully blur');
        (document.activeElement as HTMLElement).blur();
        this.isFocused = false;
      } else {
        console.info('TfStateManager', 'closeMenu', 'partially blur');
      }
    }
  }

  @action popOption(): Option | undefined {
    const value = this.selectedOptions.pop();

    this.selectedOptions = this.selectedOptions;

    this.filterOptions();

    return value;
  }

  @action pushOption(...value: Option[]) {
    this.selectedOptions.push(...value);

    this.selectedOptions = this.selectedOptions;

    this.filterOptions();
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
    this.lastValueLength = this.value.length;

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
        this.closeMenu();
        break;
      }
      default: {
        this.openMenu();
      }
    }
  }

  /**
   * Blur Event Handler for Input
   */
  @action onInputBlur() {
    console.info('TfStateManager', 'onInputBlur', ...arguments);

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
    // console.info('TfStateManager', 'onOptionClick', ...arguments);
    this.selectOption(option);
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
        this.isFocused = false;
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
