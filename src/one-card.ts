import { css, html, CSSResultArray, TemplateResult, PropertyValues } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BaseCSS, Point, OneBase } from './one-base';
import { hasCircleContainer, rectangle } from './one-lib';

@customElement('one-card')
export class OneCard extends OneBase {
  constructor() {
    super();
  }

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
        :host {
          display: inline-block;
          position: relative;
          padding: 0 10px;
        }
        :host(.circle) {
          padding: 0 50px !important;
        }
        path {
          stroke: var(--one-card-background-fill, currentColor);
        }
      `
    ]
  }

  render(): TemplateResult {
    return html`
    <div id="overlay"><svg></svg></div>
    <div style="position: relative;">
      <slot @slotchange="${this.oneRender}"></slot>
    </div>
    `;
  }

  updated(changed: PropertyValues) {
    if (hasCircleContainer(this)) {
      if (!this.classList.contains('circle')) {
        this.classList.add('circle');
      }
    }
    const force = changed.has('fill');
    super.oneRender(force);
  }

  protected canvasSize(): Point {
    const size = this.getBoundingClientRect();
    return [size.width, size.height];
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    const s = {
      width: size[0],
      height: size[1]
    };
    rectangle(svg, 2, 2, s.width - 4, s.height - 4);
  }
}