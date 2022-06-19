const LOCAL_HOST = 'http://localhost:9000';

describe('One-Button', () => {
  let win = null;
  beforeEach(async () => {
    win = await cy.visit(`${LOCAL_HOST}/test/fixtures/test.html`);
  });

  describe("Create a one-button element", () => {
    it('using createElement', () => {
      const element = win.document.createElement('one-button');
      expect(element.tagName).to.eql('ONE-BUTTON');
    });

    it('using html', async () => {
      const html = '<one-button>Test</one-button>';
      const container = await cy.get('#container');
      container.html(html);
      const element = container.find('one-button');
      expect(element.text()).to.eql('Test');
    });
  });

  describe('Property check', () => {
    it('focus', async () => {
      const html = '<one-button>Focus</one-button>';
      const container = await cy.get('#container');
      container.html(html);

      // Wait for inserting the shadow element of the one-button
      await cy.wait(500);

      const oneButton = win.document.body.querySelector('one-button');
      const button = oneButton.shadowRoot.querySelector('button');
      const path = oneButton.shadowRoot.querySelector('path');
      button.focus();

      const styles = win.getComputedStyle(path);
      expect(styles.strokeWidth).to.eql('1.5px');
    });

    it('disabled', async () => {
      const html = '<one-button disabled>Disabled</one-button>';
      const container = await cy.get('#container');
      container.html(html);

      // Wait for inserting the shadow element of the one-button
      await cy.wait(500);

      const oneButton = win.document.body.querySelector('one-button');
      const button = oneButton.shadowRoot.querySelector('button');
      expect(button.hasAttribute('disabled')).to.be.ok;
      const styles = win.getComputedStyle(button);
      expect(styles.opacity).to.eql('0.6');
      expect(styles.cursor).to.eql('default');
      expect(styles.pointerEvents).to.eql('none');
    });

    it('color', async () => {
      const html = '<one-button color="red">Red</one-button>';
      const container = await cy.get('#container');
      container.html(html);

      // Wait for inserting the shadow element of the one-button
      await cy.wait(500);

      const oneButton = win.document.body.querySelector('one-button');
      const button = oneButton.shadowRoot.querySelector('button');
      expect(button.hasAttribute('color')).to.eql(true);
    });

    it('size', async () => {
      const html = '<one-button size="small">Small</one-button>';
      const container = await cy.get('#container');
      container.html(html);

      // Wait for inserting the shadow element of the one-button
      await cy.wait(500);

      const oneButton = win.document.body.querySelector('one-button');
      const button = oneButton.shadowRoot.querySelector('button');
      expect(button.hasAttribute('size')).to.eql(true);
    });
  });
});