const LOCAL_HOST = 'http://localhost:9000';

describe('One-Slider', () => {
  let win = null;
  before(async () => {
    win = await cy.visit(`${LOCAL_HOST}/test/fixtures/test.html`);
  });

  describe("Create a one-slider element", () => {
    it('using createElement', async () => {
      const oneSlider = win.document.createElement('one-slider');
      const container = await cy.get('one-circle');
      container.html(oneSlider);

      const element = container.find('one-slider');
      expect(element).to.have.lengthOf(1);
    });

    it('using html', async () => {
      const html = '<one-slider value="20">Test</one-slider>';
      const container = await cy.get('one-circle');
      container.html(html);

      const element = container.find('one-slider');
      expect(element).to.have.lengthOf(1);
      expect(element.attr('value')).to.eql('20');
    });
  });
});
