export interface Size {
  width: number;
  height: number;
}

function createDummyElement(node: HTMLElement, text: string): HTMLElement {
  const input = node.querySelector('input');
  const styles = window.getComputedStyle(input || node);
  const element = document.createElement('div');
  const textNode = document.createTextNode(text);

  element.appendChild(textNode);

  element.style.position = 'absolute';
  element.style.top = '0';
  element.style.left = '0';
  element.style.visibility = 'hidden';
  element.style.height = '0';
  element.style.overflow = 'scroll';
  element.style.whiteSpace = 'pre';
  element.style.fontSize = styles.fontSize;
  element.style.fontFamily = styles.fontFamily;
  element.style.fontWeight = styles.fontWeight;
  element.style.fontStyle = styles.fontStyle;
  element.style.letterSpacing = styles.letterSpacing;
  element.style.textTransform = styles.textTransform;

  node.appendChild(element);

  return element;
}

function destroyElement(node: HTMLElement, element: HTMLElement): void {
  if (node) {
    node.removeChild(element);
  }
}

export default function calculateSize(node: HTMLElement, text: string): Size {
  const element = createDummyElement(node, text);
  const size = {
    width: element.scrollWidth,
    height: element.offsetHeight,
  }

  destroyElement(node, element);

  return size;
}
