import { LitElement, PropertyValues } from 'lit';
import { query } from 'lit/decorators.js';

export type Point = [number, number];

export abstract class UCBase extends LitElement {
  @query('svg') protected svg?: SVGSVGElement;

  protected lastSize: Point = [0, 0];

  updated(_changed?: PropertyValues) {
    this.ucRender();
  }

  ucRender(force = false) {
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
      this.classList.add('uc-rendered');
    }
  }

  protected abstract canvasSize(): Point;
  protected abstract draw(svg: SVGSVGElement, size: Point): void;
}