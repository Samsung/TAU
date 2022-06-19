const LOCAL_HOST = 'http://localhost:9000';

describe('One-Dialog', () => {
  let win = null;

  before(async () => {
    win = await cy.visit(`${LOCAL_HOST}/test/fixtures/test.html`);
  });

  describe('Create a one-dialog element', () => {
    it('using createElement', () => {
      const element = win.document.createElement('one-dialog');
      expect(element.tagName).to.eql('ONE-DIALOG');
    });

    it('using html', async () => {
      const html = '<one-dialog></one-dialog>';
      const container = await cy.get('#container');
      container.html(html);
      const element = container.find('one-dialog');
      expect(element[0].tagName).to.eql('ONE-DIALOG');
    });
  });
});
