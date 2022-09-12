import { css, html, CSSResultArray, LitElement, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { BaseCSS } from './one-base';
import { hasCircleContainer } from './one-lib';

interface OneTabItem extends HTMLElement {
  name: string;
  label: string;
  oneRender(force?: boolean): void;
}

@customElement('one-tabs')
export class OneTabs extends LitElement {
  @property({ type: String }) selected?: string;
  @query('slot') private slotElement?: HTMLSlotElement;

  private pages: OneTabItem[] = [];
  private pageMap = new Map<string, OneTabItem>();
  private current?: OneTabItem;

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
        :host {
          display: block;
          opacity: 1;
        }
        ::slotted(.hidden) {
          display: none !important;
        }
        :host ::slotted(.hidden) {
          display: none !important;
        }
        :host(.circle) {
          position: absolute;
          top: 50px;
          left: 0;
          padding: 0 50px;
        }
        #bar {
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
          -ms-flex-direction: row;
          -webkit-flex-direction: row;
          flex-direction: row;
          justify-content: center;
        }
      `
    ];
  }

  render(): TemplateResult {
    return html`
      <div id="bar">
        ${this.pages.map((p) => html`
          <one-item role="tab" .value="${p.name}" .selected="${p.name === this.selected}" ?aria-selected="${p.name === this.selected}"
            @click="${() => this.selected = p.name}">${p.label || p.name}</one-item>
        `)}
      </div>
      <div>
        <slot @slotchange="${this.mapPages}"></slot>
      </div>
    `;
  }

  private mapPages() {
    this.pages = [];
    this.pageMap.clear();
    if (this.slotElement) {
      const assigned = this.slotElement.assignedNodes();
      if (assigned && assigned.length) {
        for (let i = 0; i < assigned.length; i++) {
          const n = assigned[i];
          if (n.nodeType === Node.ELEMENT_NODE && (n as HTMLElement).tagName.toLowerCase() === 'one-tab') {
            const e = n as OneTabItem;
            this.pages.push(e);
            const name = e.getAttribute('name') || '';
            if (name) {
              name.trim().split(' ').forEach((nameSegment) => {
                if (nameSegment) {
                  this.pageMap.set(nameSegment, e);
                }
              });
            }            
          }
        }
        if (!this.selected) {
          if (this.pages.length) {
            this.selected = this.pages[0].name;
          }
        }
        this.requestUpdate();
      }
    }
  }

  firstUpdated() {
    this.mapPages();
    this.tabIndex = +((this.getAttribute('tabIndex') || 0));    
  }

  updated() {
    if (hasCircleContainer(this)) {
      if (!this.classList.contains('circle')) {
        this.classList.add('circle');
      }
    }
    const newPage = this.getElement();
    for (let i = 0; i < this.pages.length; i++) {
      const p = this.pages[i];
      if (p === newPage as any) {
        p.classList.remove('hidden');
      } else {
        p.classList.add('hidden');
      }
    }
    this.current = newPage || undefined;
    if (this.current && this.current.oneRender) {
      requestAnimationFrame(() => requestAnimationFrame(() => this.current!.oneRender()));
    }
  }

  private getElement(): OneTabItem | null {
    let e: OneTabItem | undefined = undefined;
    if (this.selected) {
      e = this.pageMap.get(this.selected);
    }
    if (!e) {
      e = this.pages[0];
    }
    return e || null;
  }
}