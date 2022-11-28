import { css, CSSResultArray, html, PropertyValueMap, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { BaseCSS, OneBase, Point } from './one-base'
import { rectangle } from './one-lib';

@customElement('one-input')
export class OneInput extends OneBase {
  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean }) type = 'text';
  @property({ type: Number }) minlength?: number;
  @property({ type: Number }) maxlength?: number;
  @property({ type: Number }) size?: number;

  @query('input') private textInput?: HTMLInputElement;
  private pendingValue?: string;

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
      :host {
        display: inline-block;
        position: relative;
        padding: 5px;
        font-family: inherit;
        width: 150px;
        outline: none;
      }
      input {
        display: block;
        width: 100%;
        box-sizing: border-box;
        outline: none;
        border: none;
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
        padding: 6px;
      }
    `];
  }

  oneRender(force: boolean = false) {
    super.oneRender(force);
  }

  render(): TemplateResult {
    return html`
    <input type="${this.type}" size="${this.size}" maxlength="${this.maxlength}" minlength="${this.minlength}"
      @change="${this.refire}" @input="${this.refire}"
    >
    <div id="overlay">
      <svg></svg>
    </div>
    `;
  }

  get input(): HTMLInputElement | undefined {
    return this.textInput;
  }

  get value(): string {
    const input = this.input;
    return (input && input.value) || '';
  }

  set value(v: string) {
    if (this.shadowRoot) {
      const input = this.input;
      if (input) {
        input.value = v;
        return;
      }
    }
    this.pendingValue = v;
  }

  firstUpdated(): void {
    this.value = this.pendingValue || this.value || this.getAttribute('value') || '';
    delete this.pendingValue;
  }

  private refire(event: Event) {
    event.stopPropagation();
    this.fire(event.type, { sourceEvent: event });
  }

  protected canvasSize(): Point {
    const size = this.getBoundingClientRect();
    return [size.width, size.height];
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    rectangle(svg, 2, 2, size[0] - 2, size[1] - 2);
  }
}
