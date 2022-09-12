import { css, html, CSSResultArray, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseCSS, OneBase, Point } from './one-base'
import { rectangle } from './one-lib';

import './one-item';

@customElement('one-tab')
export class OneTab extends OneBase {
  @property({ type: String }) name = '';
  @property({ type: String }) label = '';
  
  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
        :host {
          display: inline-block;
          position: relative;
          padding: 10px;
        }
      `
    ];
  }

  render(): TemplateResult {
    return html`
      <div>
        <slot @slotchange="${this.oneRender}"></slot>
      </div>
      <div id="overlay"><svg></svg></div>
    `;
  }

  protected canvasSize(): Point {
    const s = this.getBoundingClientRect();
    return [s.width, s.height];
  }

  protected draw(svg: SVGSVGElement, s: Point) {
    rectangle(svg, 2, 2, s[0] - 4, s[1] - 4);
  }
}
