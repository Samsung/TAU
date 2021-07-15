import { css, LitElement, PropertyValues } from 'lit';
import { query } from 'lit/decorators.js';

export type Point = [number, number];

export const BaseCSS = css`
:host {
  opacity: 0;
  color: white;
}
:host(.one-rendered) {
  opacity: 1;
}
#overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
svg {
  display: block;
}
path {
  stroke: currentColor;
  fill: transparent;
}
.hidden {
  display: none !important;
}
`;

export abstract class OneBase extends LitElement {
  @query('svg') protected svg?: SVGSVGElement;

  protected lastSize: Point = [0, 0];

  updated(_changed?: PropertyValues) {
    this.oneRender();
  }

  oneRender(force = false) {
    if (this.svg) {
      const size = this.canvasSize();
      if ((!force) && (size[0] === this.lastSize[0]) && (size[1] === this.lastSize[1])) {
        return;
      }
      while(this.svg.hasChildNodes()) {
        this.svg.removeChild(this.svg.lastChild!);
      }
      this.svg.setAttribute('width', `${size[0]}`);
      this.svg.setAttribute('height', `${size[1]}`);
      this.draw(this.svg, size);
      this.lastSize = size;
      this.classList.add('one-rendered');
    }
  }

  protected abstract canvasSize(): Point;
  protected abstract draw(svg: SVGSVGElement, size: Point): void;
}