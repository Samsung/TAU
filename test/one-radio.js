describe('One-Radio', () => {
  let win = null;
  before(async () => {
    win = await cy.visit('http://localhost:8080/examples/radio.html');
  });

  describe("Create a one-radio element", () => {
    it('using createElement', async () => {
      const oneRadio = win.document.createElement('one-radio');
      oneRadio.innerText = 'Radio';
      const container = await cy.get('one-circle');
      container.html(oneRadio);

      const element = container.find('one-radio');
      expect(element).to.have.lengthOf(1);
    });

    it('using html', async () => {
      const html = `
        <one-radio-group selected="two">
            <one-radio name="one">One</one-radio>
            <one-radio name="two">Two</one-radio>
        </one-radio-group>`;
      const container = await cy.get('one-circle');
      container.html(html);

      const element = container.find('one-radio');
      expect(element).to.have.lengthOf(2);
    });
  });
});
