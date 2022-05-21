import { css, html, CSSResultArray, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseCSS, Point, OneBase } from './one-base';
import { line } from './one-lib';

@customElement('one-divider')
export class OneDivider extends OneBase {
  @property({ type: Number }) elevation = 1;

  private resizeObserver?: ResizeObserver;
  private windowResizeHandler?: EventListenerOrEventListenerObject;
  private roAttached = false;

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

  updated() {
    super.updated();
    this.attachResizeListener();
  }

  disconnectedCallback() {
    this.detachResizeListener();
  }

  private attachResizeListener() {
    if (!this.roAttached) {
      if (this.resizeObserver) {
        this.resizeObserver.observe(this);        
      } else if (!this.windowResizeHandler) {
        this.windowResizeHandler = () => this.oneRender();
        window.addEventListener('resize', this.windowResizeHandler, { passive: true });
      }
      this.roAttached = true;
    }
  }

  private detachResizeListener() {
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this);
    }
    if (this.windowResizeHandler) {
      window.removeEventListener('resize', this.windowResizeHandler);
    }
    this.roAttached = false;
  }
}