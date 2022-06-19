const LOCAL_HOST = 'http://localhost:9000';

describe('One-Progress', () => {
  let win = null;
  before(async () => {
    win = await cy.visit(`${LOCAL_HOST}/test/fixtures/test.html`);
  });

  describe("Create a one-progress element", () => {
    it('using createElement', async () => {
      const oneProgress = win.document.createElement('one-progress');
      const container = await cy.get('one-circle');
      container.html(oneProgress);

      const element = container.find('one-progress');
      expect(element).to.have.lengthOf(1);
    });

    it('using html', async () => {
      const html = '<one-progress value="20">Test</one-progress>';
      const container = await cy.get('one-circle');
      container.html(html);

      const element = container.find('one-progress');
      expect(element).to.have.lengthOf(1);
      expect(element.attr('value')).to.eql('20');
    });
  });
});
