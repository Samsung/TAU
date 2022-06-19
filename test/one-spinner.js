const LOCAL_HOST = 'http://localhost:9000';

describe('One-Spinner', () => {
  let win = null;
  before(async () => {
    win = await cy.visit(`${LOCAL_HOST}/test/fixtures/test.html`);
  });

  describe("Create a one-spinner element", () => {
    it('using createElement', async () => {
      const oneSlider = win.document.createElement('one-spinner');
      const container = await cy.get('one-circle');
      container.html(oneSlider);

      const element = container.find('one-spinner');
      expect(element).to.have.lengthOf(1);
    });

    it('using html', async () => {
      const html = '<one-spinner spinning>Test</one-spinner>';
      const container = await cy.get('one-circle');
      container.html(html);

      const element = container.find('one-spinner');
      expect(element).to.have.lengthOf(1);
    });
  });
});
