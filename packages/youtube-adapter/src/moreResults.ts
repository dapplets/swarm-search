// import { IWidget } from 'dynamic-adapter.dapplet-base.eth';

export interface IMoreResultsState {
  title?: string
  color?: string | { DARK: string, LIGHT: string }
  icon?: any
  hidden: boolean
  disabled: boolean
  exec: (ctx: any, me: IMoreResultsState) => void
  init: (ctx: any, me: IMoreResultsState) => void
  ctx: any
  insPointName: string
  theme: "DARK" | "LIGHT"
}

export class MoreResults {
  public el: HTMLElement;
  public state: IMoreResultsState;
  insPointName: string;

  public static contextInsPoints = {
      SEARCH_RESULT_GROUP: 'PLUS'
  }

  public mount() {
      const { title, color, icon, hidden, theme } = this.state;

      if (!this.el) this._createElement(theme);

      if (hidden) {
          this.el.innerHTML = '';
          return;
      } else {
          const container = document.createElement('div');
          container.classList.add('dapplet-more-results');
          container.style.display = 'flex';
          container.style.position = 'relative';
          container.style.margin = '24px 0';
          container.style.alignItems = 'center';
          container.style.justifyContent = 'center';
          container.style.width = 'fit-content';
          container.style.cursor = 'pointer';
          if (icon) {
              const img = document.createElement('img');
              img.src = typeof icon === 'string' ? icon : icon.youtube;
              container.appendChild(img);
          }
          if (title) {
              const text = document.createElement('div');
              text.textContent = title;
              if (color) {
                typeof color === 'string' ? text.style.color = color
                  : theme === 'DARK' ? color.DARK : color.LIGHT;
              } else {
                container.style.color = theme === 'DARK' ? 'rgb(170, 170, 170)' : 'rgb(96, 96, 96)';
              }
              text.style.fontFamily = 'Roboto';
              text.style.fontStyle = 'normal';
              text.style.fontWeight = '500';
              text.style.fontSize = '16px';
              text.style.lineHeight = '19px';
              text.style.margin = '0 1px';
              container.appendChild(text);
          }
          this.el.appendChild(container);
      }
  }

  public unmount() {
      this.el && this.el.remove();
  }

  private _createElement(theme) {
      this.el = document.createElement('div');
      this.el.style.borderBottom = `1px solid ${theme === 'DARK' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`;
      this.el.style.display = 'flex';
      this.el.style.justifyContent = 'center';
      this.el.addEventListener("click", e => {
          if (!this.state.disabled) {
              this.state.exec?.(this.state.ctx, this.state);
          }
      });
      this.state.init?.(this.state.ctx, this.state);
  }
}