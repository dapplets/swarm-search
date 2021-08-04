export interface IResultState {
  hidden: boolean;
  img: string;
  title: string;
  searchResults: {
    title: string;
    link: string;
    description: string;
  }[];
  disabled: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exec: (ctx: any, me: IResultState) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  init: (ctx: any, me: IResultState) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ctx: any;
}

export class Result {
  public el: HTMLElement;
  public state: IResultState;

  public static contextInsPoints = {
    WIDGETS: 'WIDGETS',
  }

  public mount(): void {
    if (!this.el) this._createElement();

    const { img, title, searchResults, hidden } = this.state;

    if (hidden) {
      this.el.innerHTML = '';
      return;
    } else {
      this.el.innerHTML = `
        <div class="e2BEnf U7izfe mfMhoc">
          <title-with-lhs-icon>
            <div class="iv236">
              <span class="iJddsb" style="height:20px;width:20px">
                <img src="${img}" alt="image for title">
              </span>
            </div>
            <div class="iJ1Kvb">
              <h3 class="GmE3X" aria-level="2" role="heading">Dapplet Search for ${title}</h3>
            </div>
          </title-with-lhs-icon>
        </div>
        <div class="hlcw0c-dapp">
          ${searchResults
            .map(
              (searchResult) => `
                <div class="g">
                  <h2 class="Uo8X3b">Web results</h2>
                  <div class="tF2Cxc">
                    <div class="yuRUbf">
                      <a href="${searchResult.link}">
                        <h3 class="LC20lb DKV0Md"><span>${searchResult.title}</span></h3>
                      </a>
                    </div>
                    <div class="IsZvec">
                      <div><span class="aCOpRe">${searchResult.description}</span></div>
                    </div>
                  </div>
                </div>`,
            )
            .join('')}
        </div>
      `;
    }
  }

  public unmount(): void {
    this.el && this.el.remove();
  }

  private _createElement() {
    this.el = document.createElement('div');
    this.el.style.border = '1px solid #EB9EA4';
    this.el.style.borderRadius = '8px';
    this.el.style.marginBottom = '30px';
    this.el.style.padding = '28px 0 10px 28px';
    this.el.addEventListener('click', () => {
      if (!this.state.disabled) {
        this.state.exec?.(this.state.ctx, this.state);
      }
    });
    this.mount();
    this.state.init?.(this.state.ctx, this.state);
  }
}
