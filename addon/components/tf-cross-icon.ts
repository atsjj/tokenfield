import Component from '@glimmer/component';

interface TfCrossIconArgs {
  size?: number;
}

export default class TfCrossIcon extends Component<TfCrossIconArgs> {
  get size(): number {
    if (this.args.size) {
      return this.args.size;
    } else {
      return 20;
    }
  }
}
