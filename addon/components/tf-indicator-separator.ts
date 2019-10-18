import Component from '@glimmer/component';

interface TfIndicatorSeparatorArgs {
  disabled?: boolean;
}

export default class TfIndicatorSeparator extends Component<TfIndicatorSeparatorArgs> {
  get isDisabled(): boolean {
    return !!this.args.disabled;
  }

  get cssClass(): string {
    if (this.isDisabled) {
      return 'tf-indicator-separator tf-indicator-separator-disabled';
    } else {
      return 'tf-indicator-separator';
    }
  }
}
