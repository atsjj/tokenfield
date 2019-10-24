import Component from '@glimmer/component';
interface TfIndicatorArgs {
    onClick?: (event: MouseEvent) => Promise<void> | void;
}
export default class TfIndicator extends Component<TfIndicatorArgs> {
    onClick(event: MouseEvent): void;
}
export {};
