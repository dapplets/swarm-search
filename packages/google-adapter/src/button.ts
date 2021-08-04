let stylesAdded = false;

const addStyles = (): void => {
  const styleTag: HTMLStyleElement = document.createElement('style');
  styleTag.innerHTML = `
    .dapplet-widget-menu {
      display: inline-block;
    }

    .dapplet-widget-results {
      display: block;
    }
  `;
  document.head.appendChild(styleTag);
};

export interface IButtonState {
  img: string;
  label: string;
  loading: boolean;
  disabled: boolean;
  hidden: boolean;
  tooltip: string;
  isActive: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exec: (ctx: any, me: IButtonState) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  init: (ctx: any, me: IButtonState) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ctx: any;
  insPointName: string;
}

export class Button {
  public el: HTMLElement;
  public state: IButtonState;
  insPointName: string;

  public static contextInsPoints = {
    MENU: 'MENU',
    SEARCH_RESULT: 'SEARCH_RESULT',
    DAPPLET_SEARCH_RESULT: 'DAPPLET_SEARCH_RESULT',
  }

  public mount(): void {
    if (!this.el) this._createElement();
    if (!stylesAdded) {
      addStyles();
      stylesAdded = true;
    }

    const { img, label, hidden, tooltip, isActive } = this.state;

    if (hidden) {
      this.el.innerHTML = '';
      this.el.style.display = 'none';
      return;
    } else {
      this.el.style.removeProperty('display');
    }

    const activeNavEl: HTMLElement = document.querySelector('.hdtb-msel, .rQEFy');
    if (this.insPointName === 'MENU') {
      this.el.innerHTML = `
        <div style="margin: 1px 1px 0; padding: 16px 12px 12px 10px;
          ${isActive ? 'border-bottom: 3px solid #1a73e8; ' : 'border-bottom: none; '}
          display: inline; cursor: pointer;"
          ${tooltip ? `title="${tooltip}"` : ''}
        >
          <img style="margin-right: 5px; margin-bottom: -3px;" src="${img}"/>
          <div style="display: inline-block; font-size: 13px; line-hight: 16px; -webkit-tap-highlight-color: rgba(0,0,0,.10); color: #5f6368;">${label}</div>
        </div>
      `;
      activeNavEl.style.borderBottom = isActive ? 'none' : '3px solid #1a73e8';
    } else if (
      this.insPointName === 'SEARCH_RESULT' ||
      this.insPointName === 'DAPPLET_SEARCH_RESULT'
    ) {
      this.el.innerHTML = `
        <div 
          style="display: flex; align-items: center; cursor: pointer;"
          ${tooltip ? `title="${tooltip}"` : ''}
        >
          <img style="margin-right: 1em; margin-bottom: 3px;" src="${img}"/>
          <div style="display: inline-block; font-size: 1.1em; color: #F5504A; font-weight: bold;">${label}</div>
        </div>
      `;
    }
  }

  public unmount(): void {
    this.el && this.el.remove();
  }

  private _createElement() {
    this.el = document.createElement('div');
    if (this.insPointName === 'MENU') {
      this.el.classList.add('dapplet-widget-menu');
    } else if (
      this.insPointName === 'SEARCH_RESULT' ||
      this.insPointName === 'DAPPLET_SEARCH_RESULT'
    ) {
      this.el.classList.add('dapplet-widget-results');
    }
    this.el.addEventListener('click', () => {
      if (!this.state.disabled) {
        this.state.exec?.(this.state.ctx, this.state);
      }
    });
    this.mount();
    this.state.init?.(this.state.ctx, this.state);
  }
}
