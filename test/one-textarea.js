const LOCAL_HOST = 'http://localhost:8080';

describe('One-Textarea', () => {
  let win = null;

  before(async () => {
    win = await cy.visit(`${LOCAL_HOST}/test/fixtures/test.html`);
  });

  describe('Create a one-textarea element', () => {
    it('using createElement', () => {
      const element = win.document.createElement('one-textarea');
      expect(element.tagName).to.eql('ONE-TEXTAREA');
    });

    it('using html', async () => {
      const html = '<one-textarea></one-textarea>';
      const container = await cy.get('#container');
      container.html(html);
      const element = container.find('one-textarea');
      expect(element[0].tagName).to.eql('ONE-TEXTAREA');
    });
  });
});
