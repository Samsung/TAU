
import { css, html, CSSResultArray, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { BaseCSS, OneBase, Point } from './one-base'
import { rectangle } from "./one-lib";

@customElement('one-textarea')
export class OneTextarea extends OneBase {
  @property({ type: String }) placeholder = '';

  @query('textarea') private textareaInput?: HTMLTextAreaElement;

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
      :host {
        display: inline-block;
        position: relative;
        font-family: sans-serif;
        width: 200px;
        outline: none;
        padding: 4px;
      }
      textarea {
        position: relative;
        outline: none;
        border: none;
        resize: none;
        background: inherit;
        color: inherit;
        width: 100%;
        font-size: inherit;
        line-height: inherit;
        text-align: inherit;
        padding: 10px;
        box-sizing: border-box;
      }
    `];
  }

  render(): TemplateResult {
    return html`
    <textarea id="textarea" placeholder="${this.placeholder}"></textarea>
    <div id="overlay">
      <svg></svg>
    </div>
    `;
  }

  get textarea(): HTMLTextAreaElement | undefined {
    return this.textareaInput;
  }

  protected canvasSize(): Point {
    const size = this.getBoundingClientRect();
    return [size.width, size.height];
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    rectangle(svg, 4, 4, size[0] - 4, size[1] - 4);
  }
}
