export interface Size {
  width: number;
  height: number;
}

function createDummyElement(node: HTMLElement, text: string): HTMLElement {
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
  element.style.fontSize = node.style.fontSize;
  element.style.fontFamily = node.style.fontFamily;
  element.style.fontWeight = node.style.fontWeight;
  element.style.fontStyle = node.style.fontStyle;
  element.style.letterSpacing = node.style.letterSpacing;
  element.style.textTransform = node.style.textTransform;

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
