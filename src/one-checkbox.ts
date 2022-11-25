import { css, CSSResultArray, html, LitElement, PropertyValues, TemplateResult } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { BaseCSS, fireEvent } from './one-base'
import { line, rectangle, svgNode } from './one-lib';

@customElement('one-checkbox')
export class OneCheckbox extends LitElement {
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @state() private focused = false;

  @query('input') private input?: HTMLInputElement;

  private svgCheck?: SVGElement;

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
      :host {
        display: inline-block;
        font-family: inherit;
        opacity: 0;
      }
      :host(.one-disabled) {
        opacity: 0.6 !important;
        cursor: default;
        pointer-events: none;
      }
      #container {
        display: flex;
        flex-direction: row;
        position: relative;
        user-select: none;
        min-height: 24px;
        cursor: pointer;
      }
      #container.focused {
        --one-checkbox-default-width: 1.5;
      }
      span {
        margin-left: 1.5ex;
        line-height: 24px;
      }
      input {
        opacity: 0;
      }
      path {
        stroke: currentColor;
        stroke-width: var(--one-checkbox-default-width, 0.7);
      }
      g path {
        stroke-width: 2.5;
      }
    `];
  }

  focus() {
    if (this.input) {
      this.input.focus();
    } else {
      super.focus();
    }
  }

  render(): TemplateResult {
    return html`
    <label id="container" class="${this.focused ? 'focused' : ''}">
      <input type="checkbox"
        .checked="${this.checked}"
        @change="${this.onChange}"
        @focus="${() => this.focused = true}"
        @blur="${() => this.focused = false}"
      >
      <span><slot></slot></span>
      <div id="overlay"><svg id="svg"></svg></div>
    </label>
    `;
  }

  updated(changed: PropertyValues) {
    if (changed.has('disabled')) {
      this.refreshDisabledState();
    }

    const svg = (this.shadowRoot!.getElementById('svg') as any) as SVGSVGElement;
    while (svg.hasChildNodes()) {
      svg.removeChild(svg.lastChild!);
    }

    const size = [24, 24];
    rectangle(svg, 0, 0, size[0], size[1]);
    this.svgCheck = svgNode('g');
    svg.appendChild(this.svgCheck);
    line(this.svgCheck, size[0] * 0.3, size[1] * 0.4, size[0] * 0.5, size[1] * 0.7)
    line(this.svgCheck, size[0] * 0.5, size[1] * 0.7, size[0] + 5, -5);
    this.refreshCheckVisibility();
    this.classList.add('one-rendered');
  }

  private onChange() {
    this.checked = this.input!.checked;
    this.refreshCheckVisibility();
    fireEvent(this, 'change', { checked: this.checked });
  }

  private refreshCheckVisibility() {
    if (this.svgCheck) {
      this.svgCheck.style.display = this.checked ? '' : 'none';
    }
  }

  private refreshDisabledState() {
    if (this.disabled) {
      this.classList.add('one-disabled');
    } else {
      this.classList.remove('one-disabled');
    }
  }
}
