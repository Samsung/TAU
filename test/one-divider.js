const LOCAL_HOST = 'http://localhost:8080';

describe('One-Divider', () => {
  let win = null;

  before(async () => {
    win = await cy.visit(`${LOCAL_HOST}/test/fixtures/test.html`);
  });

  describe('Create a one-divider element', () => {
    it('using createElement', () => {
      const element = win.document.createElement('one-divider');
      expect(element.tagName).to.eql('ONE-DIVIDER');
    });

    it('using html', async () => {
      const html = '<one-divider></one-divider>';
      const container = await cy.get('#container');
      container.html(html);
      const element = container.find('one-divider');
      expect(element[0].tagName).to.eql('ONE-DIVIDER');
    });
  });
});
