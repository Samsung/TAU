import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('one-square')
export class OneSquare extends LitElement {
  @property({ type: Number }) width?: number;
  @property({ type: Number }) height?: number;

  static get styles() {
    return css`
      :host {
        display: flex;
        width: 360px;
        height: 360px;
        background-color: black;
        justify-content: center;
        align-items: center;
      }
    `;
  }

  render(): TemplateResult {
    return html`
    <div ?width="${this.width}" ?height="${this.height}">
      <slot @slotchange="${this.slotChange}"></slot>
    </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  slotChange() {
    this.requestUpdate();
  }

  updated() {
    if (this.width || this.height) {
      this.style.width = `${this.width}px`;
      this.style.height = `${this.height}px`;
    }
  }
}
