import { OpenMosMMIPage } from './app.po';

describe('open-mos-mmi App', () => {
  let page: OpenMosMMIPage;

  beforeEach(() => {
    page = new OpenMosMMIPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
