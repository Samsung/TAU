import { css, CSSResultArray, html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseCSS, OneBase, Point } from './one-base'
import { polygon, rectangle } from "./one-lib";

@customElement('one-progress')
export class OneProgress extends OneBase {
  @property({ type: Number }) value = 0;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Boolean }) percentage = false;

  private progressBox?: SVGElement;

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
      :host {
        display: inline-block;
        position: relative;
        width: 200px;
        height: 42px;
        font-family: sans-serif;
      }
      .labelContainer {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .progressLabel {
        color: var(--one-progress-label-color, currentColor);
        font-size: var(--one-progress-font-size, 14px);
        background: var(--one-progress-label-background, #000);
        letter-spacing: 1.25px;
      }
      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        pointer-events: none;
      }
      .progressbox {
        stroke: var(--one-progress-color, rgba(255, 255, 255, 0.8));
        stroke-width: 2.75;
        fill: white;
      }
    `];
  }

  oneRender(force: boolean = false) {
    super.oneRender(force);
    this.refreshProgressFill();
  }

  render(): TemplateResult {
    return html`
    <div id="overlay" class="overlay">
      <svg></svg>
    </div>
    <div class="overlay labelContainer">
      <div class="progressLabel">${this.getProgressLabel()}</div>
    </div>
    `;
  }

  protected canvasSize(): Point {
    const s = this.getBoundingClientRect();
    return [s.width, s.height];
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    rectangle(svg, 2, 2, size[0] - 2, size[1] - 2);
  }

  private getProgressLabel(): string {
    if (this.percentage) {
      if (this.max === this.min) {
        return '%';
      } else {
        const pct = Math.floor(((this.value - this.min) / (this.max - this.min)) * 100);
        return pct + '%';
      }
    } else {
      return '' + this.value;
    }
  }

  private refreshProgressFill() {
    console.log('refreshProgressFill')
    if (this.progressBox) {
      if (this.progressBox.parentElement) {
        this.progressBox.parentElement.removeChild(this.progressBox);
      }
      this.progressBox = undefined;
    }
    if (this.svg) {
      let percentage = 0;
      const size = this.getBoundingClientRect();
      if (this.max > this.min) {
        percentage = (this.value - this.min) / (this.max - this.min);
        const progressWidth = size.width * Math.max(0, Math.min(percentage, 100));
        this.progressBox = polygon(this.svg, [
          [0, 0],
          [progressWidth, 0],
          [progressWidth, size.height],
          [0, size.height]
        ]);
        this.svg!.appendChild(this.progressBox);
        this.progressBox.classList.add('progressbox');
      }
    }
  }
}
