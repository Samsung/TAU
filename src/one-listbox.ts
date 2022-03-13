import { css, CSSResultArray, html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseCSS, OneBase, Point } from './one-base';
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

  private itemNodes: OneComboItem[] = [];
  private lastSelectedItem?: OneComboItem;
  private itemClickHandler = this.onItemClick.bind(this);

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
    // FIXME: delay the selection to refresh correctly
    setTimeout(() => {
      this.refreshSelection();      
    }, 100);
    this.addEventListener('click', this.itemClickHandler);
  }

  updated() {
    super.updated();
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

  private onItemClick(event: Event) {
    event.stopPropagation();
    this.selected = (event.target as OneComboItem).value;
    this.refreshSelection();
    this.fireSelected();
  }

  private fireSelected() {
    this.fire('selected', { selected: this.selected });
  }

  private refreshSelection() {
    if (this.lastSelectedItem) {
      this.lastSelectedItem.selected = false;
      this.lastSelectedItem.removeAttribute('aria-selected');
    }
    const slot = this.shadowRoot!.getElementById('slot') as HTMLSlotElement;
    const nodes = slot.assignedNodes();
    if (nodes) {
      let selectedItem = null;
      for (let i = 0; i < nodes.length; i++) {
        const element = nodes[i] as OneComboItem;
        if (element.tagName === 'ONE-ITEM') {
          const value = element.value || '';
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
      } else {
        this.value = undefined;
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
