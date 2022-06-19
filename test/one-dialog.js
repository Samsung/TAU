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

  describe('Property check', () => {
    it('open', () => {
      const html = `
        <one-dialog open>
          <p>
            This is a paragraph and here's a link about wired-button and well
            well well, what do you know, same link with more elevation
            Here's another link that opens in a new tab about wired-input.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
            eiusmod tempor incididunt ut labore et dolore magna aliqua.  
          </p>
        </one-dialog>
      `;
      const container = win.document.querySelector('one-circle');
      container.innerHTML = html;

      const oneDialog = container.querySelector('one-dialog');
      expect(oneDialog.hasAttribute('open')).to.eql(true);
    });
  });

  describe('Interaction', () => {
    it('Open dialog', async () => {
      const html = `
        <one-dialog>
          <p>
            This is a paragraph and here's a link about wired-button and well
            well well, what do you know, same link with more elevation
            Here's another link that opens in a new tab about wired-input.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
            eiusmod tempor incididunt ut labore et dolore magna aliqua.  
          </p>
        </one-dialog>
      `;

      const container = win.document.querySelector('one-circle');
      container.innerHTML = html;

      const oneDialog = container.querySelector('one-dialog');
      oneDialog.open = true;
      
      // Wait for inserting the shadow element of the one-button
      await cy.wait(100);

      const dialogContent = oneDialog.shadowRoot.querySelector('#overlay');
      expect(window.getComputedStyle(dialogContent).opacity).to.eql('1');
    });

    it('Close dialog', async () => {
      const html = `
        <one-dialog open>
          <p>
            This is a paragraph and here's a link about wired-button and well
            well well, what do you know, same link with more elevation
            Here's another link that opens in a new tab about wired-input.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
            eiusmod tempor incididunt ut labore et dolore magna aliqua.  
          </p>
        </one-dialog>
      `;

      const container = win.document.querySelector('one-circle');
      container.innerHTML = html;

      const oneDialog = container.querySelector('one-dialog');
      oneDialog.open = false;
      
      // Wait for inserting the shadow element of the one-button
      await cy.wait(100);

      const dialogContent = oneDialog.shadowRoot.querySelector('#overlay');
      expect(window.getComputedStyle(dialogContent).opacity).to.eql('0');
    });
  });
});
