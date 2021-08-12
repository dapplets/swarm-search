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
    UPLOADED_FILE: 'BUTTONS'
  }

  public mount(): void {
    if (!this.el) this._createElement();

    const { img, label, hidden, tooltip, isActive } = this.state;

    if (hidden) {
      this.el.innerHTML = '';
      this.el.style.display = 'none';
      return;
    } else {
      this.el.style.removeProperty('display');
      this.el.innerHTML = `
        <style>
          .dapplet-widget-button:hover {
            background-color: #dd7200 !important;
            box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);
            color: #fff !important;
          }
          .dapplet-widget-button:hover img {
            filter: invert(100%);
          }
        </style>
        <div styles="padding: 16px; width: 100%;">
            <button style="
              width: 100%;
              background: #fff;
              border: none;
              border-radius: 4px;
              padding: 16px;  
              font-size: 0.9375rem;
              cursor: pointer;
              transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
              color: rgba(0, 0, 0, 0.87);
            " class="dapplet-widget-button" type="button">
                <span style="
                  font-family: 'IBM Plex Mono', monospace;
                  font-weight: 500;
                  line-height: 1.75; 
                  font-stretch: normal;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  padding: 0 auto;
                  text-transform: uppercase;
                ">
                    <img src="${img}" />
                    ${label}
                    <span style="width: 24px;"></span>
                </span>
            </button>
        </div>
  
      `;
    }
  }

  public unmount(): void {
    this.el && this.el.remove();
  }

  private _createElement() {
    this.el = document.createElement('div');
    this.el.addEventListener('click', () => {
      if (!this.state.disabled) {
        this.state.exec?.(this.state.ctx, this.state);
      }
    });
    this.mount();
    this.state.init?.(this.state.ctx, this.state);
  }
}
