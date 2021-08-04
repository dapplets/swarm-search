// import { IWidget } from 'dynamic-adapter.dapplet-base.eth';

export interface IBadgeState {
    img: string;
    label: string;
    loading: boolean;
    disabled: boolean;
    hidden: boolean;
    tooltip: string;
    color: string;
    basic: boolean;
    exec: (ctx: any, me: IBadgeState) => void;
    init: (ctx: any, me: IBadgeState) => void;
    ctx: any;
    insPointName: string;
}

export class Badge {
    public el: HTMLElement;
    public state: IBadgeState;
    insPointName: string;

    public static contextInsPoints = {
        SEARCH_RESULT: 'SEARCH_RESULT_BADGES'
    }

    public mount() {
        if (!this.el) this._createElement();

        const { img, label, loading, disabled, hidden, tooltip, color, basic } = this.state;

        if (hidden) {
            this.el.innerHTML = '';
            return;
        } else {
            this.el.innerHTML = `
                <div 
                    style="
                        ${(!basic) ? `background-color: ${color};` : ''}
                        padding: 3px 4px;
                        font-size: 12px;
                        font-weight: 500;
                        border-radius: 2px;
                        font-family: Roboto, Arial, sans-serif;
                        line-height: 12px;
                        ${(basic) ? (`color: ${color ?? 'color: rgb(96,96,96)'};`) : 'color: rgb(96,96,96);'}
                        margin-left: 4px;
                        text-transform: uppercase;
                    "
                    ${(tooltip) ? `title="${tooltip}"` : ''}
                >${label}</div>
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