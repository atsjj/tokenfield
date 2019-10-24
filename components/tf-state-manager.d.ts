import Component from '@glimmer/component';
export interface Option {
    value: string;
    label: string;
    [key: string]: any;
}
interface FetchOptions {
    (value: string): Promise<Option[]>;
}
interface TfStateManagerArgs {
    value?: string;
    placeholder?: string;
    options?: Option[] | FetchOptions;
    onSelect: (option: Option | Option[]) => Promise<void> | void;
}
export default class TfStateManager extends Component<TfStateManagerArgs> {
    private activeOption;
    private filteredOptions;
    private hoveredOption;
    private isFocused;
    private isLoading;
    private isMenuOpen;
    private isMulti;
    private selectedOption;
    private selectedOptions;
    private containerElement;
    private lastValueLength;
    constructor(owner: unknown, args: TfStateManagerArgs);
    readonly focused: string;
    readonly isValuePresent: boolean;
    getOptions(): Promise<Option[]>;
    filterOptions(value?: string): Promise<void>;
    activateOption(option: Option): void;
    deactivateOption(option: Option): void;
    hoverOption(option: Option): void;
    dehoverOption(option: Option): void;
    selectOption(option?: Option): boolean;
    clearValue(): void;
    openMenu(setHoveredOption?: boolean): void;
    nextMenuOption(): void;
    prevMenuOption(): void;
    closeMenu(shouldBlur?: boolean): void;
    removeOption(option: Option): void;
    popOption(): Option | undefined;
    pushOption(...value: Option[]): void;
    /**
     * Focus Event Handler for Input
     */
    focus(): void;
    blur(): void;
    handleAccelerator(event: KeyboardEvent): void;
    /**
     * Blur Event Handler for Input
     */
    onInputBlur(): void;
    /**
     * MouseDown Event Handler for Input
     *
     * @param event
     */
    onInputMouseDown(event: MouseEvent): void;
    /**
     * DblClick Event Handler for Input
     *
     * @param event
     */
    onInputDblClick(event: MouseEvent): void;
    onOptionClick(_: MouseEvent, option: Option): void;
    onOptionMouseOut(_: MouseEvent, option: Option): void;
    onOptionMouseOver(_: MouseEvent, option: Option): void;
    onBlur(_: FocusEvent): void;
    onInsert(element: HTMLDivElement): void;
    onDestroy(): void;
}
export {};
