import { css, CSSResultArray, html, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { BaseCSS, OneBase, Point } from './one-base'
import {ellipse, rectangle, svgNode} from "./one-lib";

@customElement('one-toggle')
export class OneToggle extends OneBase {
  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  @query('input') private input?: HTMLInputElement;

  private knob?: SVGElement;

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
      :host {
        display: inline-block;
        cursor: pointer;
        position: relative;
        outline: none;
      }
      input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        cursor: pointer;
        opacity: 0;
      }
      .knob {
        transition: transform 0.3s ease;
      }
      .knob path {
        stroke-width: 0.7;
        fill: currentColor;
      }
      .knob.checked {
        transform: translateX(48px);
      }
      .knob.checked path {
        fill: var(--one-toggle-on-color, blue);
      }
      .knob.unchecked path {
        fill: var(--one-toggle-off-color, gray);
      }
    `];
  }

  oneRender(force: boolean = false) {
    super.oneRender(force);
    this.refreshKnob();
  }

  render(): TemplateResult {
    return html`
    <div style="position: relative;">
      <svg></svg>
      <input type="checkbox" .checked="${this.checked}" ?disabled="${this.disabled}" @change="${this.onChange}">
    </div>
    `;
  }

  protected canvasSize(): Point {
    return [80, 34];
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    const rect = rectangle(svg, 16, 8, size[0] - 32, 18);
    rect.classList.add('toggle-bar');
    this.knob = svgNode('g');
    this.knob.classList.add('knob');
    svg.appendChild(this.knob);
    ellipse(this.knob, 16, 16, 32, 32);
  }

  private onChange() {
    this.checked = this.input!.checked;
    this.refreshKnob();
    this.fire('change', { checked: this.checked });
  }

  private refreshKnob() {
    if (this.knob) {
      const classList = this.knob.classList;
      if (this.checked) {
        classList.remove('unchecked');
        classList.add('checked');
      } else {
        classList.remove('checked');
        classList.add('unchecked');
      }
    }
  }
}
