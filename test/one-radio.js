const LOCAL_HOST = 'http://localhost:9000';

describe('One-Radio', () => {
  let win = null;
  beforeEach(async () => {
    win = await cy.visit(`${LOCAL_HOST}/test/fixtures/test.html`);
  });

  describe("Create a one-radio element", () => {
    it('using createElement', async () => {
      const oneRadio = win.document.createElement('one-radio');
      oneRadio.innerText = 'Radio';
      const container = await cy.get('one-circle');
      container.html(oneRadio);

      const element = container.find('one-radio');
      expect(element).to.have.lengthOf(1);
    });

    it('using html', async () => {
      const html = `
        <one-radio-group selected="two">
            <one-radio name="one">One</one-radio>
            <one-radio name="two">Two</one-radio>
        </one-radio-group>`;
      const container = await cy.get('one-circle');
      container.html(html);

      const element = container.find('one-radio');
      expect(element).to.have.lengthOf(2);
    });
  });

  describe('Interaction', () => {
    it('Select radio', (done) => {
      const html = `
        <one-radio-group selected="two">
          <one-radio name="one">One</one-radio>
          <one-radio name="two">Two</one-radio>
        </one-radio-group>`;

      const container = win.document.querySelector('one-circle');
      container.innerHTML = html;

      const oneRadioGroup = win.document.querySelector('one-radio-group');
      oneRadioGroup.addEventListener('selected', () => {
        done();
      });

      cy.get('one-radio[name=one]').click();
    });

    it('Select next radio by right key', (done) => {
      const html = `
        <one-radio-group selected="one">
          <one-radio name="one">One</one-radio>
          <one-radio name="two">Two</one-radio>
        </one-radio-group>`;

      const container = win.document.querySelector('one-circle');
      container.innerHTML = html;

      cy.get('one-radio-group')
        .click()
        .type('{rightArrow}')
        .then((group) => {
          expect(group.get(0).getAttribute('selected')).to.eql('two');
        })
        .type('{rightArrow}')
        .then((group) => {
          expect(group.get(0).getAttribute('selected')).to.eql('one');
          done();
        });
    });

    it('Select previous radio by left key', (done) => {
      const html = `
        <one-radio-group selected="two">
          <one-radio name="one">One</one-radio>
          <one-radio name="two">Two</one-radio>
        </one-radio-group>`;

      const container = win.document.querySelector('one-circle');
      container.innerHTML = html;

      cy.get('one-radio-group')
        .click()
        .type('{leftArrow}')
        .then((group) => {
          expect(group.get(0).getAttribute('selected')).to.eql('one');
        })
        .type('{leftArrow}')
        .then((group) => {
          expect(group.get(0).getAttribute('selected')).to.eql('two');
          done();
        });
    });
  });
});
