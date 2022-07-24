const LOCAL_HOST = 'http://localhost:9000';

describe('One-Combo', () => {
  let win = null;

  before(async () => {
    win = await cy.visit(`${LOCAL_HOST}/test/fixtures/test.html`);
  });

  describe('Create a one-combo element', () => {
    it('using createElement', () => {
      const element = win.document.createElement('one-combo');
      expect(element.tagName).to.eql('ONE-COMBO');
    });

    it('using html', () => {
      const html = `
        <one-combo>
          <one-item>
            one
          </one-item>
        </one-combo>
      `;
      const container = win.document.querySelector('one-circle');
      container.innerHTML = html;

      const element = container.querySelector('one-combo');
      expect(element.tagName).to.eql('ONE-COMBO');
    });
  });

  describe('Property check', () => {
    it('selected', () => {
      const html = `
        <one-combo selected="one">
          <one-item value="one">
            one
          </one-item>
        </one-combo>
      `;
      const container = win.document.querySelector('one-circle');
      container.innerHTML = html;

      const oneCombo = container.querySelector('one-combo');
      expect(oneCombo.hasAttribute('selected')).to.eql(true);
      expect(oneCombo.getAttribute('selected')).to.eql('one');
    });

    it('disabled', () => {
      const html = `
        <one-combo selected="one" disabled>
          <one-item value="one">
            one
          </one-item>
        </one-combo>
      `;
      const container = win.document.querySelector('one-circle');
      container.innerHTML = html;

      const oneCombo = container.querySelector('one-combo');
      expect(oneCombo.hasAttribute('disabled')).to.eql(true);
    });
  });

  describe('Interaction', () => {
    it('Click the item', async () => {
      const html = `
        <one-combo selected="one">
          <one-item value="one">
            one
          </one-item>
          <one-item value="two">
            two
          </one-item>
        </one-combo>
      `;
      const container = win.document.querySelector('one-circle');
      container.innerHTML = html;

      const oneCombo = container.querySelector('one-combo');
      expect(oneCombo.getAttribute('selected')).to.eql('one');

      // Wait for inserting the shadow element of the one-button
      await cy.wait(100);

      const dropPanel = oneCombo.shadowRoot.querySelector('#dropPanel');
      await cy.get(dropPanel).click();

      // Wait for changing element properties
      await cy.wait(100);
      const itemTwo = win.document.querySelector('one-item[value="two"]');
      await cy.get(itemTwo).click();

      // Wait for changing element properties
      await cy.wait(100);
      expect(oneCombo.getAttribute('selected')).to.eql('two');
    });

    it('Click the item on disabled state', async () => {
      const html = `
        <one-combo selected="one" disabled>
          <one-item value="one">
            one
          </one-item>
        </one-combo>
      `;
      const container = win.document.querySelector('one-circle');
      container.innerHTML = html;

      const oneCombo = container.querySelector('one-combo');
      expect(oneCombo.hasAttribute('disabled')).to.eql(true);

      // Wait for inserting the shadow element of the one-button
      await cy.wait(100);

      const dropPanel = oneCombo.shadowRoot.querySelector('#dropPanel');
      await cy.get(dropPanel).click();

      const oneCard = oneCombo.shadowRoot.querySelector('one-card');
      expect(oneCard.style.display).to.eql('none');
    });
  });
});
