import { css, html, CSSResultArray, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { BaseCSS, Point, OneBase } from './one-base';
import { polygon } from './one-lib';
import { theme } from './one-theme';

@customElement('one-button')
export class OneButton extends OneBase {
  @property({ type: Boolean }) icon = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String, reflect: true }) variant = "contained";

  @query('button') private button?: HTMLButtonElement;

  constructor() {
    super();
  }

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
      :host {
        display: inline-block;
        font-size: 14px;
      }
      path {
        transition: transform 0.05s ease;
      }
      button {
        position: relative;
        user-select: none;
        border: none;
        background: none;        
        font-family: inherit;
        font-size: inherit;
        cursor: pointer;
        letter-spacing: 1.25px;
        text-align: center;
        padding: 10px;
        color: inherit;
        outline: none;
      }
      button[icon] {
        border-radius: 50%;
      }
      button[disabled] {
        opacity: 0.6 !important;
        cursor: default;
        pointer-events: none;
      }
      button:active path {
        transform: scale(0.97) translate(1.5%, 1.5%);
      }
      button:focus path {
        stroke-width: 1.5;
      }
      `
    ]
  }

  render(): TemplateResult {
    return html`
    <button ?icon="${this.icon}" ?disabled="${this.disabled}" ?variant="${this.variant}">
      <slot @slotchange="${this.oneRender}"></slot>
      <div id="overlay">
        <svg></svg>
      </div>
    </button>
    `;
  }

  focus() {
    if (this.button) {
      this.button.focus();
    } else {
      super.focus();
    }
  }

  updated() {
    super.updated();
  }

  protected canvasSize(): Point {
    if (this.button) {
      const size = this.button.getBoundingClientRect();
      return [Math.round(size.width), Math.round(size.height)];
    }

    return this.lastSize;
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    if (this.icon) {
      const min = Math.min(size[0], size[1]);
      svg.setAttribute('width', `${min}`);
      svg.setAttribute('height', `${min}`);
    } else {
      if (this.variant === 'text') {
        return;
      }

      const rectangle = polygon(svg, [[0, 0], [size[0], 0], [size[0], size[1]], [0, size[1]]]);
      if (this.variant === 'contained') {
        rectangle.style.fill = theme.primary;
      }
    }
  }
}