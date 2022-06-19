const LOCAL_HOST = 'http://localhost:9000';

describe('One-Combo', () => {
  let win = null;

  before(async () => {
    win = await cy.visit(`${LOCAL_HOST}/test/fixtures/test.html`);
  });

  describe('Create a one-combo element', () => {
    it('using createElement', () => {
      const element = win.document.createElement('one-combo');
      expect(element.tagName).to.eql('ONE-COMBO');
    });

    it('using html', async () => {
      const html = '<one-combo><one-item>one</one-item></one-combo>';
      const container = await cy.get('#container');
      container.html(html);
      const element = container.find('one-combo');
      expect(element[0].tagName).to.eql('ONE-COMBO');
    });
  });
});
