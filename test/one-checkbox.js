const LOCAL_HOST = 'http://localhost:9000';

describe('One-Checkbox', () => {
  let win = null;
  beforeEach(async () => {
    win = await cy.visit(`${LOCAL_HOST}/test/fixtures/test.html`);
  });

  describe("Create a one-checkbox element", () => {
    it('using createElement', async () => {
      const oneCheckbox = win.document.createElement('one-checkbox');
      oneCheckbox.innerText = 'Test';
      const container = await cy.get('one-circle');
      container.html(oneCheckbox);

      const element = container.find('one-checkbox');
      expect(element.text()).to.eql('Test');
    });

    it('using html', async () => {
      const html = '<one-checkbox>Test</one-checkbox>';
      const container = await cy.get('one-circle');
      container.html(html);

      const element = container.find('one-checkbox');
      expect(element.text()).to.eql('Test');
    });
  });

  describe('Property check', () => {
    it('default checked value', async () => {
      const html = '<one-checkbox>Test</one-checkbox>';
      const container = await cy.get('one-circle');
      container.html(html);

      const element = container.find('one-checkbox');
      expect(element.prop('checked')).to.eql(false);
    });

    it('checked', async () => {
      const html = '<one-checkbox checked>Test</one-checkbox>';
      const container = await cy.get('one-circle');
      container.html(html);

      const element = container.find('one-checkbox');
      expect(element.prop('checked')).to.eql(true);
    });
  });

  describe('Interaction', () => {
    it('Click the checkbox', async () => {
      const html = '<one-checkbox>Test</one-checkbox>';
      const container = win.document.querySelector('one-circle');
      container.innerHTML = html;

      const oneCheckbox = container.querySelector('one-checkbox');
      expect(oneCheckbox.hasAttribute('checked')).to.eql(false);

      // Wait for inserting the shadow element of the one-button
      await cy.wait(100);

      const input = oneCheckbox.shadowRoot.querySelector('input');
      input.click();

      // Wait for changing element properties
      await cy.wait(100);
      expect(oneCheckbox.hasAttribute('checked')).to.eql(true);

      input.click();

      // Wait for changing element properties
      await cy.wait(100);
      expect(oneCheckbox.hasAttribute('checked')).to.eql(false);
    });
  });
});
