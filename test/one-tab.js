const LOCAL_HOST = 'http://localhost:9000';

describe('One-Tab', () => {
  let win = null;
  before(async () => {
    win = await cy.visit(`${LOCAL_HOST}/test/fixtures/test.html`);
  });

  describe('Create a one-tabs element', () => {
    it('using createElement', async () => {
      const oneTabs = win.document.createElement('one-tabs');
      const container = await cy.get('one-circle');
      container.html(oneTabs);

      const element = container.find('one-tabs');
      expect(element).to.have.lengthOf(1);
    });

    it('using html', async () => {
      const html = '<one-tabs></one-tabs>';
      const container = await cy.get('one-circle');
      container.html(html);

      const element = container.find('one-tabs');
      expect(element).to.have.lengthOf(1);
    });
  });

  describe('Property check', () => {
    it('selected', async () => {
      const html = '<one-tabs selected="two"><one-tab name="one"></one-tab><one-tab name="two"></one-tab></one-tabs>';
      const container = win.document.querySelector('one-circle');
      container.innerHTML = html;

      // Wait for inserting the shadow element of the one-button
      await cy.wait(100);

      const oneTab = container.querySelector('one-tab[name="one"]');
      expect(oneTab.classList.contains('hidden')).to.eql(true);
      const twoTab = container.querySelector('one-tab[name="two"]');
      expect(twoTab.classList.contains('hidden')).to.eql(false);
    });
  });

  describe('Interaction', () => {
    it('click other tab', async () => {
      const html = '<one-tabs selected="two"><one-tab name="one"></one-tab><one-tab name="two"></one-tab></one-tabs>';
      const container = win.document.querySelector('one-circle');
      container.innerHTML = html;

      // Wait for inserting the shadow element
      await cy.wait(100);

      const oneTab = container.querySelector('one-tab[name="one"]');
      expect(oneTab.classList.contains('hidden')).to.eql(true);

      const oneTabs = container.querySelector('one-tabs');
      const items = oneTabs.shadowRoot.querySelectorAll('one-item');
      const oneTabBtn = items[0];
      oneTabBtn.click();

      await cy.wait(100);

      expect(oneTab.classList.contains('hidden')).to.eql(false);
    });
  });
});
