const LOCAL_HOST = 'http://localhost:9000';

describe('One-Card', () => {
  let win = null;

  before(async () => {
    win = await cy.visit(`${LOCAL_HOST}/test/fixtures/test.html`);
  });

  describe('Create a one-card element', () => {
    it('using createElement', () => {
      const element = win.document.createElement('one-card');
      expect(element.tagName).to.eql('ONE-CARD');
    });

    it('using html', async () => {
      const html = '<one-card>Test</one-card>';
      const container = await cy.get('#container');
      container.html(html);
      const element = container.find('one-card');
      expect(element[0].tagName).to.eql('ONE-CARD');
    });
  });
});
