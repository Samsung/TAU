import { css, html, CSSResultArray, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { BaseCSS, Point, OneBase } from './one-base';
import { rectangle } from './one-lib';

@customElement('one-button')
export class OneButton extends OneBase {
  @property({ type: Boolean }) icon = false;

  @query('button') private button?: HTMLButtonElement;

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
    <button ?icon="${this.icon}">
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

  firstUpdated() {
    console.log('firstUpdated');
  }

  updated() {
    console.log('updated');
    super.updated();

    console.log('icon:' + this.icon);
  }

  protected canvasSize(): Point {
    if (this.button) {
      const size = this.button.getBoundingClientRect();
      return [size.width, size.height];
    }

    return this.lastSize;
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    if (this.icon) {
      const min = Math.min(size[0], size[1]);
      svg.setAttribute('width', `${min}`);
      svg.setAttribute('height', `${min}`);
    } else {
      rectangle(svg, 0, 0, size[0], size[1]);
    }
  }
}