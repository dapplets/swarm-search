// import { IWidget } from 'dynamic-adapter.dapplet-base.eth';

export interface IButtonState {
    img: string;
    label: string;
    loading: boolean;
    disabled: boolean;
    hidden: boolean;
    tooltip: string;
    exec: (ctx: any, me: IButtonState) => void;
    init: (ctx: any, me: IButtonState) => void;
    ctx: any;
    insPointName: string;
}

export class Button {
    public el: HTMLElement;
    public state: IButtonState;
    insPointName: string;

    public static contextInsPoints = {
        VIDEO: 'MENU'
    }

    public mount() {
        if (!this.el) this._createElement();

        const { img, label, loading, disabled, hidden, tooltip } = this.state;

        if (hidden) {
            this.el.innerHTML = '';
            return;
        } else {
            this.el.innerHTML = `
                <style>
                  .loader {
                    position: relative;
                    margin: 0 auto;
                    width: 24px;
                    margin: 0 6px;
                  }
                  .loader:before {
                    content: "";
                    display: block;
                    padding-top: 100%;
                  }
                  
                  .circular {
                    -webkit-animation: rotate 2s linear infinite;
                            animation: rotate 2s linear infinite;
                    height: 100%;
                    transform-origin: center center;
                    width: 100%;
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    margin: auto;
                    stroke: ${disabled ? '#5a5a5a' : '#909090'};
                  }
                  
                  .path {
                    stroke-dasharray: 1, 200;
                    stroke-dashoffset: 0;
                    -webkit-animation: dash 1.5s ease-in-out infinite;
                            animation: dash 1.5s ease-in-out infinite;
                    stroke-linecap: round;
                  }
                  
                  @-webkit-keyframes rotate {
                    100% {
                      transform: rotate(360deg);
                    }
                  }
                  
                  @keyframes rotate {
                    100% {
                      transform: rotate(360deg);
                    }
                  }
                  @-webkit-keyframes dash {
                    0% {
                      stroke-dasharray: 1, 200;
                      stroke-dashoffset: 0;
                    }
                    50% {
                      stroke-dasharray: 89, 200;
                      stroke-dashoffset: -35px;
                    }
                    100% {
                      stroke-dasharray: 89, 200;
                      stroke-dashoffset: -124px;
                    }
                  }
                  @keyframes dash {
                    0% {
                      stroke-dasharray: 1, 200;
                      stroke-dashoffset: 0;
                    }
                    50% {
                      stroke-dasharray: 89, 200;
                      stroke-dashoffset: -35px;
                    }
                    100% {
                      stroke-dasharray: 89, 200;
                      stroke-dashoffset: -124px;
                    }
                  }
                  body {
                    background-color: #fff;
                  }
                  
                  .showbox {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 5%;
                  }

                  .dapplet-widget-button {
                    color: ${disabled ? '#5a5a5a' : '#606060'};
                  }

                  html[dark] .dapplet-widget-button {
                    color: ${disabled ? '#5a5a5a' : '#aaaaaa'};
                  }
                </style>
                <div 
                  class="dapplet-widget-button"
                    style="
                        display: flex;
                        font-family: Roboto, Arial, sans-serif;
                        font-size: 14px;
                        text-transform: uppercase;
                        font-weight: 500;
                        letter-spacing: 0.007px;
                        cursor: pointer;
                        margin: 0 8px;
                    " 
                    ${(tooltip) ? `title="${tooltip}"` : ''}
                >
                    ${(!loading) ? `<div style="
                        width: 24px; 
                        padding: 6px 6px;
                    ">
                        <img src="${img}" />
                    </div>` : `<div class="loader">
                        <svg class="circular" viewBox="25 25 50 50">
                        <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"/>
                        </svg>
                    </div>`}
                    <div style="
                        line-height: 38px;
                    ">${label}</div>
                </div>
            `;
        }
    }

    public unmount() {
        this.el && this.el.remove();
    }

    private _createElement() {
        this.el = document.createElement('div');
        this.el.addEventListener("click", e => {
            if (!this.state.disabled) {
                this.state.exec?.(this.state.ctx, this.state);
            }
        });
        this.mount();
        this.state.init?.(this.state.ctx, this.state);
    }
}