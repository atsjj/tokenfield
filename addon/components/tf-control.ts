import Component from '@glimmer/component';

interface TfControlArgs {
  isDisabled?: boolean;
  isFocused?: boolean;
}

export default class TfControl extends Component<TfControlArgs> {
  get disabled(): string {
    return this.args.isDisabled ? 'disabled' : '';
  }

  get focused(): string {
    return this.args.isFocused ? 'focused' : '';
  }
}
