import { css, html, CSSResultArray, TemplateResult, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseCSS, Point, OneBase } from './one-base';
import { hasCircleContainer, line, rectangle, polygon } from './one-lib';

@customElement('one-card')
export class OneCard extends OneBase {
  @property({ type: Number }) elevation = 1;
  @property({ type: String }) fill?: string;

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
    const elevation = Math.min(Math.max(1, this.elevation), 5);
    const width = size.width + ((elevation - 1) * 2);
    const height = size.height + ((elevation - 1) * 2);
    return [width, height];
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    const elevation = Math.min(Math.max(1, this.elevation), 5);
    const s = {
      width: size[0] - ((elevation - 1) * 2),
      height: size[1] - ((elevation - 1) * 2)
    };
    if (this.fill && this.fill.trim()) {
      const rectangle = polygon(svg, [[0, 0], [s.width, 0], [s.width, s.height], [0, s.height]]);
      rectangle.style.fill = this.fill;
    }
    rectangle(svg, 2, 2, s.width - 4, s.height - 4);
    for (let i = 1; i < elevation; i++) {
      (line(svg, (i * 2), s.height - 4 + (i * 2), s.width - 4 + (i * 2), s.height - 4 + (i * 2))).style.opacity = `${(85 - (i * 10)) / 100}`;
      (line(svg, s.width - 4 + (i * 2), s.height - 4 + (i * 2), s.width - 4 + (i * 2), i * 2)).style.opacity = `${(85 - (i * 10)) / 100}`;
      (line(svg, (i * 2), s.height - 4 + (i * 2), s.width - 4 + (i * 2), s.height - 4 + (i * 2))).style.opacity = `${(85 - (i * 10)) / 100}`;
      (line(svg, s.width - 4 + (i * 2), s.height - 4 + (i * 2), s.width - 4 + (i * 2), i * 2)).style.opacity = `${(85 - (i * 10)) / 100}`;
    }
  }
}