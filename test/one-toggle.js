describe('One-Toggle', () => {
  let win = null;
  before(async () => {
    win = await cy.visit('http://localhost:8080/examples/toggle.html');
  });

  describe("Create a one-toggle element", () => {
    it('using createElement', async () => {
      const oneSlider = win.document.createElement('one-toggle');
      const container = await cy.get('one-circle');
      container.html(oneSlider);

      const element = container.find('one-toggle');
      expect(element).to.have.lengthOf(1);
    });

    it('using html', async () => {
      const html = '<one-toggle spinning>Test</one-toggle>';
      const container = await cy.get('one-circle');
      container.html(html);

      const element = container.find('one-toggle');
      expect(element).to.have.lengthOf(1);
    });
  });
});
