import { css, CSSResultArray, html, LitElement, PropertyValues, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { BaseCSS } from './one-base'
import { polygon, rectangle } from './one-lib';

interface OneComboItem extends HTMLElement {
  value: string;
  selected: boolean;
}

interface ComboValue {
  value: string;
  text: string;
}

@customElement('one-combo')
export class OneCombo extends LitElement {
  @property({ type: Object }) value?: ComboValue;
  @property({ type: String, reflect: true }) selected?: string;
  @property({ type: Boolean, reflect: true }) disabled = false;

  @query('svg') private svg?: SVGSVGElement;
  @query('#card') private card?: HTMLDivElement;

  private cardShowing = false;
  private itemNodes: OneComboItem[] = [];
  private lastSelectedItem?: OneComboItem;

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
      :host {
        display: inline-block;
        font-family: inherit;
        position: relative;
        outline: none;
        opacity: 0;
      }
      :host(.one-disabled) {
        opacity: 0.5 !important;
        cursor: default;
        pointer-events: none;
        background: rgba(0, 0, 0, 0.02);
      }
      :host(.one-rendered) {
        opacity: 1;
      }
      :host(:focus) path {
        stroke-width: 1.5;
      }
      #container {
        white-space: nowrap;
        position: relative;
      }
      .inline {
        display: inline-block;
        vertical-align: top
      }
      #textPanel {
        min-width: 90px;
        min-height: 18px;
        padding: 8px;
      }    
      #dropPanel {
        width: 34px;
        cursor: pointer;
      }
      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
      }
      svg {
        display: block;
      }    
      path {
        stroke: currentColor;
        stroke-width: 0.7;
        fill: transparent;
      }
      #card {
        display: block;
        position: absolute;
        z-index: 1;
        box-shadow: 1px 5px 15px -6px rgba(1, 1, 1, 0.8);
        padding: 8px;
        border: 1px solid white;
      }  
      ::slotted(one-item) {
        display: block;
      }
    `];
  }

  render(): TemplateResult {
    return html`
    <div id="container" @click="${this.onCombo}">
      <div id="textPanel" class="inline">
        <span>${this.value && this.value.text}</span>
      </div>
      <div id="dropPanel" class="inline"></div>
      <div class="overlay">
        <svg></svg>
      </div>
    </div>
    <one-card id="card" tabindex="-1" role="listbox" @click="${this.onItemClick}" @mousedown="${this.onItemClick}" @touchstart="${this.onItemClick}" style="display: none;">
      <slot id="slot"></slot>
    </one-card>
    `;
  }

  firstUpdated() {
    this.setAttribute('role', 'combobox');
    this.setAttribute('aria-haspopup', 'listbox');
    this.refreshSelection();
  }

  private refreshDisabledState() {
    if (this.disabled) {
      this.classList.add('one-disabled');
    } else {
      this.classList.remove('one-disabled');
    }
  }

  updated(changed: PropertyValues) {
    if (changed) {
      this.refreshDisabledState();
    }
    const svg = this.svg!;
    while (svg.hasChildNodes()) {
      svg.removeChild(svg.lastChild!);
    }
    const s = this.shadowRoot!.getElementById('container')!.getBoundingClientRect();
    svg.setAttribute('width', `${s.width}`);
    svg.setAttribute('height', `${s.height}`);
    const textBounds = this.shadowRoot!.getElementById('textPanel')!.getBoundingClientRect();
    this.shadowRoot!.getElementById('dropPanel')!.style.minHeight = textBounds.height + 'px';
    rectangle(svg, 0, 0, textBounds.width, textBounds.height);
    const dropX = textBounds.width;
    rectangle(svg, dropX, 0, 34, textBounds.height);
    const dropOffset = Math.max(0, Math.abs((textBounds.height - 24) / 2));
    const poly = polygon(svg, [
      [dropX + 8, 5 + dropOffset],
      [dropX + 26, 5 + dropOffset],
      [dropX + 17, dropOffset + Math.min(textBounds.height, 18)]
    ]);
    poly.style.fill = 'currentColor';
    poly.style.cursor = 'pointer';
    this.classList.add('one-rendered');
    this.setAttribute('aria-expanded', `${this.cardShowing}`);

    if (!this.itemNodes.length) {
      this.itemNodes = [];
      const nodes = (this.shadowRoot!.getElementById('slot') as HTMLSlotElement).assignedNodes();
      if (nodes && nodes.length) {
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

  private refreshSelection() {
    if (this.lastSelectedItem) {
      this.lastSelectedItem.selected = false;
      this.lastSelectedItem.removeAttribute('aria-selected');
    }
    setTimeout(() => {
      const slot = this.shadowRoot!.getElementById('slot') as HTMLSlotElement;
      const nodes = slot.assignedNodes();
      if (nodes) {
        let selectedItem: OneComboItem | null = null;
        for (let i = 0; i < nodes.length; i++) {
          const element = nodes[i] as OneComboItem;
          if (element.tagName === 'ONE-ITEM') {
            const value = element.value || element.getAttribute('value') || '';
            if (this.selected && (value === this.selected)) {
              selectedItem = element;
              break;
            }
          }
        }
        this.lastSelectedItem = selectedItem || undefined;
        if (this.lastSelectedItem) {
          this.lastSelectedItem.selected = true;
          this.lastSelectedItem.setAttribute('aria-selected', 'true');
        }
        if (selectedItem) {
          this.value = {
            value: selectedItem.value || '',
            text: selectedItem.textContent || ''
          };
          this.selected = selectedItem.value;
        } else {
          this.value = undefined;
        }
      }
    }, 10);
  }

  private setCardShowing(showing: boolean) {
    if (this.card) {
      this.cardShowing = showing;
      this.card.style.display = showing? '': 'none';
      if (showing) {
        setTimeout(() => {
          const nodes = (this.shadowRoot!.getElementById('slot') as HTMLSlotElement).assignedNodes().filter((d) => {
            return d.nodeType === Node.ELEMENT_NODE;
          });
          nodes.forEach(node => {
            const e = node as LitElement;
            if (e.requestUpdate) {
              e.requestUpdate();
            }
          });
        }, 10);
      }
      this.setAttribute('aria-expanded', `${this.cardShowing}`);
    }
  }

  private onItemClick(event: CustomEvent) {
    event.stopPropagation();
    this.selected = (event.target as OneComboItem).value;
    this.refreshSelection();
    setTimeout(() => {
      this.setCardShowing(false);
    });
  }

  private onCombo(event: Event) {
    event.stopPropagation();
    this.setCardShowing(!this.cardShowing);
  }
}
