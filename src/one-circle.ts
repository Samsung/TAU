import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('one-circle')
export class OneCircle extends LitElement {
  @property({ type: Number }) radius?: number;

  static get styles() {
    return css`
      :host {
        display: flex;
        width: 360px;
        height: 360px;
        background-color: black;
        clip-path: circle(180px at center);
        justify-content: center;
        align-items: center;
      }
    `;
  }  

  render(): TemplateResult {
    return html`
    <div ?radius="${this.radius}">
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
    console.log('circle slotChange');
    this.requestUpdate();        
  }

  firstUpdated() {
    console.log('circle firstUpdated');    
  }

  updated() {
    console.log('circle updated');

    if (this.radius) {
      console.log('radius exist');
      this.style.width = `${this.radius * 2}px`;
      this.style.height = `${this.radius * 2}px`;
      this.style.clipPath = `circle(${this.radius}px at center)`;
    }
  }
}
