import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('uc-circle')
export class UCCircle extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        width: 360px;
        height: 360px;
        background-color: black;
      }
    `;
  }  

  render(): TemplateResult {
    return html`<slot @slotchange="${this.slotChange}"></slot>`;
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

  firstUpdated() {
    console.log('firstUpdated');    
  }

  updated() {

  }
}
