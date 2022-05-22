import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { OneCard } from './one-card';

@customElement('one-dialog')
export class OneDialog extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false;

  @query('one-card') private card?: OneCard;

  static get styles() {
    return css`
      #container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: var(--one-dialog-z-index, 100);
      }
      #container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.4);
        opacity: 0;
        transition: opacity 0.5s ease;
      }
      #overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
        transform: translateY(150px);
        transition: transform 0.5s ease, opacity 0.5s ease;
      }
      .layout.vertical {
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -ms-flex-direction: column;
        -webkit-flex-direction: column;
        flex-direction: column;
      }
      .flex {
        -ms-flex: 1 1 0.000000001px;
        -webkit-flex: 1;
        flex: 1;
        -webkit-flex-basis: 0.000000001px;
        flex-basis: 0.000000001px;
      }
      one-card {
        display: inline-block;
        background: black;
        text-align: left;
      }
      .content {
        text-align: center;
        padding: 50px;
        overflow-y: visible;
        overflow-x: hidden;
      }
      :host([open]) #container {
        pointer-events: auto;
      }
      :host([open]) #container::before {
        opacity: 1;
      }
      :host([open]) #overlay {
        opacity: 1;
        transform: none;
      }
    `;
  }

  render(): TemplateResult {
    return html`
      <div id="container">
        <div id="overlay" class="vertical layout">
          <div class="flex"></div>
          <div class="content">
            <one-card><slot></slot></one-card>
          </div>
          <div class="flex"></div>
        </div>
      </div>
    `;
  }

  updated() {
    if (this.card) {
      this.card.oneRender(true);
    }
  }
}