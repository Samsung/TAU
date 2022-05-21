import { css, html, CSSResultArray, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { BaseCSS, Point, OneBase } from './one-base';
import { line } from './one-lib';

@customElement('one-divider')
export class OneDivider extends OneBase {
  @property({ type: Number }) elevation = 1;

  constructor() {
    super();
  }

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
      :host {
        display: block;
        position: relative;
      }
      `
    ]
  }

  render(): TemplateResult {
    return html`<svg></svg>`;
  }

  protected canvasSize(): Point {
    const size = this.getBoundingClientRect();
    const elev = Math.min(Math.max(1, this.elevation), 5);
    return [size.width, elev * 6];
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    const elev = Math.min(Math.max(1, this.elevation), 5);
    for (let i = 0; i < elev; i++) {
      line(svg, 0, (i * 6) + 3, size[0], (i * 6) + 3);
    }
  }
}