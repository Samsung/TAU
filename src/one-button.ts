import { css, html, CSSResultArray, TemplateResult } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { BaseCSS, Point, OneBase } from './one-base';
import { rectangle } from './one-lib';

@customElement('one-button')
export class OneButton extends OneBase {
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
        outline: none;
        color: inherit;
      }
      button:active path {
        transform: scale(0.97) translate(1.5% 1.5%);
      }
      button:focus path {
        stroke-width: 1.5;
      }
      `
    ]
  }

  render(): TemplateResult {
    return html`
    <button>
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

  protected canvasSize(): Point {
    if (this.button) {
      const size = this.button.getBoundingClientRect();
      console.log(`button canvasSize width:${size.width} height:${size.height}`);
      return [size.width, size.height];
    }

    return this.lastSize;
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    const width = size[0];
    const height = size[1];
    rectangle(svg, 0, 0, width, height);    
  }
}