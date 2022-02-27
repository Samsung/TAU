import {css, CSSResultArray, html, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { BaseCSS, OneBase, Point} from './one-base';
import { rectangle } from './one-lib';

interface OneComboItem extends HTMLElement {
  value: string;
  selected: boolean;
}

interface ListboxValue {
  value: string;
  text: string;
}

@customElement('one-listbox')
export class OneListbox extends OneBase {
  @property({ type: Object }) value?: ListboxValue;
  @property({ type: String }) selected?: string;
  @property({ type: Boolean }) horizontal = false;

  private itemNodes: OneComboItem[] = [];

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
        :host {
          display: inline-block;
          position: relative;
          font-family: inherit;
          padding: 5px;
          outline: none;
        }
        :host(:focus) path {
          stroke-width: 1.5;
        }
        ::slotted(one-item) {
          display: block;
        }
        :host(.one-horizontal) ::slotted(one-item) {
          display: inline-block;
        }
      `
    ]
  }

  render(): TemplateResult {
    return html`
    <slot id="slot" @slotchange="${() => this.requestUpdate()}"></slot>
    <div id="overlay">
        <svg id="svg"></svg>
    </div>
    `;
  }

  firstUpdated() {
    this.setAttribute('role', 'listbox');
    this.tabIndex = +((this.getAttribute('tabindex') || 0));
  }

  updated() {
    super.updated();
    if (this.horizontal) {
      this.classList.add('one-horizontal');
    } else {
      this.classList.remove('one-horizontal');
    }
    if (!this.itemNodes.length) {
      this.itemNodes = [];
      const nodes = (this.shadowRoot!.getElementById('slot') as HTMLSlotElement).assignedNodes();
      if (nodes?.length) {
        for (let i = 0; i < nodes.length; i++) {
          const element = nodes[i] as OneComboItem;
          if (element.tagName === 'ONE-ITEM') {
            element.setAttribute('role', 'option');
            this.itemNodes.push(element);
          }
        }
      }
    }
  }

  protected canvasSize(): Point {
    const size = this.getBoundingClientRect();
    return [size.width, size.height];
  }

  protected draw(svg: SVGSVGElement, size: Point): void {
    rectangle(svg, 0, 0, size[0], size[1]);
  }
}
