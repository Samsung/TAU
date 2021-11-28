describe('One-Button', () => {
  let win = null;
  before(async () => {
    win = await cy.visit('http://localhost:8080/examples/button.html');
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
    })
  });
});