const LOCAL_HOST = 'http://localhost:8080';

describe('One-Listbox', () => {
  let win = null;

  before(async () => {
    win = await cy.visit(`${LOCAL_HOST}/test/fixtures/test.html`);
  });

  describe('Create a one-listbox element', () => {
    it('using createElement', () => {
      const element = win.document.createElement('one-listbox');
      expect(element.tagName).to.eql('ONE-LISTBOX');
    });

    it('using html', async () => {
      const html = '<one-listbox><one-item>One</one-item></one-listbox>';
      const container = await cy.get('#container');
      container.html(html);
      const element = container.find('one-listbox');
      expect(element[0].tagName).to.eql('ONE-LISTBOX');
    });
  });
});
