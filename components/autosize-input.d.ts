import Component from '@glimmer/component';
interface AutosizeInputArgs {
    minWidth?: number;
    onBlur?: (event: FocusEvent) => Promise<void> | void;
    onClick?: (event: MouseEvent) => Promise<void> | void;
    onFocus?: (event: FocusEvent) => Promise<void> | void;
    onInput?: (value: string, event: InputEvent) => Promise<void> | void;
    onKeyDown?: (event: InputEvent) => Promise<void> | void;
    onKeyUp?: (event: InputEvent) => Promise<void> | void;
    value?: string;
}
export default class AutosizeInput extends Component<AutosizeInputArgs> {
    private inputRef?;
    onBlur(event: FocusEvent): void;
    onClick(event: MouseEvent): void;
    onFocus(event: FocusEvent): void;
    onInput(event: InputEvent): void;
    onKeyDown(event: InputEvent): void;
    onKeyUp(event: InputEvent): void;
}
export {};
