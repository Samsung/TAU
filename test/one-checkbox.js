const LOCAL_HOST = 'http://localhost:9000';

describe('One-Checkbox', () => {
  let win = null;
  before(async () => {
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
});
