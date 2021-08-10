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
      if (!this.el) this._createElement();

      const { title, color, icon, hidden, theme } = this.state;

      if (hidden) {
          this.el.innerHTML = '';
          return;
      } else {
          const container = document.createElement('div');
          container.classList.add('dapplet-more-results');
          container.classList.add('MXl0lf');
          container.classList.add('mtqGb');
           
          container.style.display = 'inline-flex';
          container.style.position = 'relative';
          container.style.marginBottom = '24px';
          container.style.alignItems = 'center';
          container.style.justifyContent = 'space-between';
          container.style.cursor = 'pointer';
          const imageContainer = document.createElement('div');
          imageContainer.style.display = 'flex';
          imageContainer.style.flexGrow = '2';
          imageContainer.style.width = '24px';
          if (icon) {
              const img = document.createElement('img');
              img.src = typeof icon === 'string' ? icon : icon.google;
              imageContainer.appendChild(img);
          }
          container.appendChild(imageContainer);
          if (title) {
              const text = document.createElement('div');
              text.style.display = 'flex';
              text.style.flexGrow = '3';
              text.textContent = title;
              if (color) {
                typeof color === 'string' ? text.style.color = color
                  : theme === 'DARK' ? color.DARK : color.LIGHT;
              } else {
                text.style.color = theme === 'DARK' ? '#8ab4f8' : '#1a0dab';
              };
              text.style.fontFamily = 'Roboto, sans-serif';
              text.style.fontStyle = 'normal';
              text.style.fontWeight = '500';
              text.style.fontSize = '16px';
              text.style.lineHeight = '19px';
              text.style.margin = '0 10px';
              container.appendChild(text);
          }
          const line = document.createElement('hr');
          line.classList.add('hideline');
          line.classList.add('pb5vrc');
          this.el.appendChild(line);
          this.el.appendChild(container);
      }
  }

  public unmount() {
      this.el && this.el.remove();
  }

  private _createElement() {
      this.el = document.createElement('g-more-link');
      this.el.classList.add('dGWpb');
      this.el.style.display = 'block';
      this.el.addEventListener("click", e => {
          if (!this.state.disabled) {
              this.state.exec?.(this.state.ctx, this.state);
          }
      });
      const styleTag: HTMLStyleElement = document.createElement('style');
      styleTag.title = 'add-roboto-font';
      styleTag.innerText = `
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap');
        
        .hideline {
          position: absolute;
          border: 0;
        }`;
      document.head.appendChild(styleTag);
      this.state.init?.(this.state.ctx, this.state);
  }
}