const LOCAL_HOST = 'http://localhost:9000';

describe('One-Input', () => {
  let win = null;
  before(async () => {
    win = await cy.visit(`${LOCAL_HOST}/test/fixtures/test.html`);
  });

  describe("Create a one-input element", () => {
    it('using createElement', async () => {
      const oneInput = win.document.createElement('one-input');
      const container = await cy.get('one-circle');
      container.html(oneInput);

      const element = container.find('one-input');
      expect(element).to.have.lengthOf(1);
    });

    it('using html', async () => {
      const html = '<one-input>Test</one-input>';
      const container = await cy.get('one-circle');
      container.html(html);

      const element = container.find('one-input');
      expect(element).to.have.lengthOf(1);
    });
  });

  describe('Property check', () => {
    it('maxlength', async () => {
      const html = `
        <one-input maxlength="5">input</one-input>
      `;
      const container = win.document.querySelector('one-circle');
      container.innerHTML = html;

      const oneInput = container.querySelector('one-input');
      await cy.wait(100);

      const input = oneInput.shadowRoot.querySelector('input');

      await cy.get(input).type('123456789');

      await cy.get(input);
      await cy.wait(100);

      expect(input.value).to.eql('12345');
    });
  });
});
