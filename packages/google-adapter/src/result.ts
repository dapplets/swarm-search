export interface IResultState {
    hidden: boolean;
    img: string;
    title: string;
    views: string;
    date: string;
    channelIcon?: string;
    channel: string;
    url: string;
    description: string;
    disabled: boolean;
    badges: { color: string; tooltip: string; label: string, basic: boolean }[];
    exec: (ctx: any, me: IResultState) => void;
    init: (ctx: any, me: IResultState) => void;
    ctx: any;
    insPointName: string;
}

export class Result {
    public el: HTMLElement;
    public state: IResultState;
    insPointName: string;

    public static contextInsPoints = {
        SEARCH_RESULT_GROUP: 'SEARCH_RESULTS'
    }

    public mount() {
        if (!this.el) this._createElement();

        const { img, title, hidden, views, date, channelIcon, channel, description, badges, url } = this.state;

        if (hidden) {
            this.el.innerHTML = '';
            return;
        } else {
            this.el.innerHTML = `
                <div style="margin: 0 52px 30px 0;">
                    <div><a style="font-size: 14px; cursor: pointer; color: #000;">${url}</a></div>
                    <div style="margin: 5px 0 5px 0;">
                        <a style="cursor: pointer;"><h3>${title}</h3></a>
                    </div>
                    <div style="display: flex;">
                        <div><img style="cursor: pointer; display: block; min-width: 116px; width: 116px; height: 65px; border-radius: 8px; margin-right: 9px; object-fit: contain; background: #000;" src="${img}" alt="${title}"/></div>
                        <div style="font-size: 14px; color: #4d5156; line-height: 22.12px;">
                            ${(!img) ? 
                                `<span>${date}</span> — ${description}` : 
                                `<div>${description}</div><div>${date} · Uploaded by ${channel}</div>`}
                        </div>
                    </div>
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