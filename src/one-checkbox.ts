import { css, CSSResultArray, html, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { BaseCSS, OneBase, Point } from './one-base'
import { line, rectangle, svgNode } from './one-lib';

@customElement('one-checkbox')
export class OneCheckbox extends OneBase {
  @property({ type: Boolean }) checked = false;

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
        line-height: 24px;
      }
      input {
        opacity: 0;
      }
      path {
        stroke: currentColor;
        stroke-width: 0.7;
      }
      g path {
        stroke-width: 2.5;
      }
    `];
  }

  oneRender(force: boolean = false) {
    super.oneRender(force);
  }

  render(): TemplateResult {
    return html`
    <lablel id="container">
      <input type="checkbox"
        .checked="${this.checked}"
        @change="${this.onChange}"
      >
      <span><slot></slot></span>
      <div id="overlay"><svg></svg></div>
    </lablel>
    `;
  }

  protected canvasSize(): Point {
    return [24, 24];
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    rectangle(svg, 0, 0, size[0], size[1]);
    this.svgCheck = svgNode('g');
    svg.appendChild(this.svgCheck);
    line(this.svgCheck, size[0] * 0.3, size[1] * 0.4, size[0] * 0.5, size[1] * 0.7)
    line(this.svgCheck, size[0] * 0.5, size[1] * 0.7, size[0] + 5, -5);
  }

  private onChange() {
    this.checked = this.input!.checked;
    this.refreshCheckVisibility();
    this.fire('change', { checked: this.checked });
  }

  private refreshCheckVisibility() {
    if (this.svgCheck) {
      this.svgCheck.style.display = this.checked ? '' : 'none';
    }
  }
}
