const __curveStepCount = 9;

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

  bcurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {
    this.p += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y} `;
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

function _curve(vertArray: any, existingPath?: OnePath) {
  const vertArrayLength = vertArray.length;
  let path = existingPath || new OnePath();
  if (vertArrayLength > 3) {
    const b = [];
    path.moveTo(vertArray[1][0], vertArray[1][1]);
    for (let i = 1; (i + 2) < vertArrayLength; i++) {
      const cachedVertArray = vertArray[i];
      b[0] = [cachedVertArray[0], cachedVertArray[1]];
      b[1] = [cachedVertArray[0] + (vertArray[i + 1][0] - vertArray[i - 1][0]) / 6, cachedVertArray[1] + (vertArray[i + 1][1] - vertArray[i - 1][1]) / 6];
      b[2] = [vertArray[i + 1][0] + (vertArray[i][0] - vertArray[i + 2][0]) / 6, vertArray[i + 1][1] + (vertArray[i][1] - vertArray[i + 2][1]) / 6];
      b[3] = [vertArray[i + 1][0], vertArray[i + 1][1]];
      path.bcurveTo(b[1][0], b[1][1], b[2][0], b[2][1], b[3][0], b[3][1]);
    }
  } else if (vertArrayLength === 3) {
    path.moveTo(vertArray[0][0], vertArray[0][1]);
    path.bcurveTo(vertArray[1][0], vertArray[1][1],
      vertArray[2][0], vertArray[2][1],
      vertArray[2][0], vertArray[2][1]);
  } else if (vertArrayLength === 2) {
    path = _line(vertArray[0][0], vertArray[0][1], vertArray[1][0], vertArray[1][1], path);
  }
  return path;
}

function _ellipse(ellipseInc: number, cx: number, cy: number, rx: number, ry: number, existingPath?: OnePath) {
  const points = [];
  points.push([
    cx + 0.9 * rx * Math.cos(ellipseInc),
    cy + 0.9 * ry * Math.sin(ellipseInc)
  ]);
  for (let angle = 0; angle < (Math.PI * 2); angle = angle + ellipseInc) {
    points.push([
      cx + rx * Math.cos(angle),
      cy + ry * Math.sin(angle)
    ]);
  }
  points.push([
    cx + rx * Math.cos(Math.PI * 2),
    cy + ry * Math.sin(Math.PI * 2)
  ]);
  points.push([
    cx + 0.98 * rx * Math.cos(Math.PI * 2),
    cy + 0.98 * ry * Math.sin(Math.PI * 2)
  ]);
  return _curve(points, existingPath);
}

export function ellipse(parent: SVGElement, x: number, y: number, width: number, height: number) {
  width = Math.max(width > 10 ? width - 4 : width - 1, 1);
  height = Math.max(height > 10 ? height - 4 : height - 1, 1);
  const ellipseInc = (Math.PI * 2) / __curveStepCount;
  let rx = Math.abs(width / 2);
  let ry = Math.abs(height / 2);
  let path = _ellipse(ellipseInc, x, y, rx, ry);
  const node = svgNode('path', { d: path.value });
  parent.appendChild(node);
  return node;
}
