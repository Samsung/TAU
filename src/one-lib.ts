class OnePath {
  private p = '';

  get value() {
    return this.p.trim();
  }

  moveTo(x: number, y: number): void {
    this.p = `${this.p}M ${x} ${y}`;
  }

  lineTo(x: number, y: number): void {
    this.p = `${this.p}L ${x} ${y}`;
  }
}

type Params = {[name: string]: string};

export function svgNode(tagName: string, attributes?: Params): SVGElement {
  const ns = document.createElementNS('http://www.w3.org/2000/svg', tagName);
  if (attributes) {
    for (const attr in attributes) {
      ns.setAttributeNS(null, attr, attributes[attr]);
    }
  }
  return ns;
}

function _line(x1: number, y1: number, x2: number, y2: number, existingPath?: OnePath): OnePath {
  const path = existingPath || new OnePath();
  path.moveTo(x1, y1);
  path.lineTo(x2, y2);
  path.moveTo(x2, y2);
  return path;
}

export function line(parent: SVGElement, x1: number, y1: number, x2: number, y2: number): SVGElement {
  const path = _line(x1, y1, x2, y2);
  const node = svgNode('path', { d: path.value });
  parent.appendChild(node);
  return node;    
}

export function rectangle(parent: SVGElement, x: number, y: number, width: number, height: number): SVGElement {
  let path = _line(x, y, x + width, y);
  path = _line(x + width, y, x + width, y + height, path);
  path = _line(x + width, y + height, x, y + height, path);
  path = _line(x, y + height, x, y, path);
  const node = svgNode('path', { d: path.value });
  parent.appendChild(node);
  return node;
}