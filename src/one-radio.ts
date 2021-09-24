import { css, CSSResultArray, html, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { BaseCSS, OneBase, Point } from './one-base'
import {ellipse, svgNode} from "./one-lib";
// import { line, rectangle, svgNode } from './one-lib';

@customElement('one-radio')
export class OneRadio extends OneBase {
  @property({ type: Boolean }) checked = false;
  @property({ type: String }) name?: string;

  @query('input') private input?: HTMLInputElement;

  private svgCheck?: SVGElement;

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
      :host {
        display: inline-block;
        font-family: inherit;
      }
      #container {
        display: flex;
        flex-direction: row;
        position: relative;
        user-select: none;
        min-height: 24px;
        cursor: pointer;
      }
      span {
        margin-left: 1.5ex;
      }
      input {
        opacity: 0;
      }
      path {
        stroke: currentColor;
        stroke-width: 0.7;
      }
      g path {
        stroke-width: 0;
        fill: currentColor;
      }
    `];
  }

  oneRender(force: boolean = false) {
    super.oneRender(force);
    this.refreshCheckVisibility();
  }

  render(): TemplateResult {
    return html`
    <label id="container">
      <input type="checkbox" .checked="${this.checked}"
        @change="${this.onChange}"
      >
      <span><slot></slot></span>
      <div id="overlay"><svg></svg></div>
    </label>
    `;
  }

  protected canvasSize(): Point {
    return [24, 24];
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    ellipse(svg, size[0] / 2, size[1] / 2, size[0], size[1]);
    this.svgCheck = svgNode('g');
    svg.appendChild(this.svgCheck);
    const iw = Math.max(size[0] * 0.6, 5);
    const ih = Math.max(size[1] * 0.6, 5);
    ellipse(this.svgCheck, size[0] / 2, size[1] / 2, iw, ih);
  }

  private onChange() {
    this.checked = this.input!.checked;
    this.refreshCheckVisibility();
    this.fire('change', { checked: this.checked });
  }

  private refreshCheckVisibility() {
    if (this.svgCheck) {
      this.svgCheck.style.display = this.checked ? '': 'none';
    }
  }
}
