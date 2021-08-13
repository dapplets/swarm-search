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

        /**
         * Base: https://www.deviantart.com/bellhenge/art/SS-and-BotW-2-821305796
         * Minify: https://www.deviantart.com/
         */
        const minifyUrl = url.match(/(http:\/\/|https:\/\/)?(www)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\s\.-\?\%\&]*)\//i)[0];

        if (hidden) {
            this.el.innerHTML = '';
            return;
        } else {
            this.el.innerHTML = `
                <div style="position: relative; margin: 0 52px 30px 0;">
                    <div style="display: flex; align-items: center; margin-bottom: 7px;">
                        <div style="
                            min-width: 18px;
                            width: 18px;
                            height: 18px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            background: #FF951A;
                            border-radius: 50%;
                            margin-right: 6px;
                        "
                        >
                            ${getIcon()}
                        </div>
                        <a style="font-size: 14px; cursor: pointer; color: #000;">${minifyUrl}</a>
                    </div>
                    
                    <div style="margin: 5px 0 5px 0;">
                        <a style="cursor: pointer;"><h3>${title}</h3></a>
                    </div>

                    <div style="display: flex;">
                        ${(img) ? `
                            <div>
                                <img style="cursor: pointer; display: block; min-width: 116px; width: 116px; height: 65px; border-radius: 8px; margin-right: 9px; object-fit: contain; background: #000;" 
                                src="${img}" alt="${title}"/>
                            </div>
                        `: ''}
                        <div style="font-size: 14px; color: #4d5156; line-height: 22.12px;">
                            ${(!channel)
                                ? `${(date) ? `<span>${date}</span>` : ''}${(date && description) ? ' — ' : ''}${description ?? ''}`
                                : `
                                    ${description ? `<div>${description}</div>` : ''}
                                    ${date ?? ''}${(date && channel) ? ' · ' : ''}${channel ? `Uploaded by ${channel}` : ''}
                                `}
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
        this.el.addEventListener("click", (e: any) => {
            if (this.state.disabled) return;
            if (e.target.tagName.toLowerCase() !== 'a' && e.target.parentElement.tagName.toLowerCase() !== 'a') return;
            this.state.exec?.(this.state.ctx, this.state);
        });
        this.mount();
        this.state.init?.(this.state.ctx, this.state);
    }
}


function getIcon(): string {
    return `
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.45">
            <g opacity="0.45">
            <path opacity="0.45" d="M9.18834 1.42192V2.76581L7.99463 2.09386V0.749969L9.18834 1.42192Z" fill="black"/>
            </g>
            </g>
            <g opacity="0.6">
            <g opacity="0.6">
            <path opacity="0.6" d="M7.99463 2.09385V3.43774L9.18834 2.7658V1.42191L7.99463 2.09385Z" fill="black"/>
            </g>
            </g>
            <g opacity="0.3">
            <g opacity="0.3">
            <path opacity="0.3" d="M0.124756 9.60741L2.51474 10.9513L4.90473 9.60741L2.51474 8.26352L0.124756 9.60741Z" fill="black"/>
            </g>
            </g>
            <g opacity="0.45">
            <g opacity="0.45">
            <path opacity="0.45" d="M2.51475 8.26354V10.9513L0.124756 9.60743V6.91965L2.51475 8.26354Z" fill="black"/>
            </g>
            </g>
            <g opacity="0.45">
            <g opacity="0.45">
            <path opacity="0.45" d="M4.90488 6.91961V9.60739L2.51489 8.2635V5.57571L4.90488 6.91961Z" fill="black"/>
            </g>
            </g>
            <g opacity="0.6">
            <g opacity="0.6">
            <path opacity="0.6" d="M2.51489 8.26354V10.9513L4.90488 9.60743V6.91965L2.51489 8.26354Z" fill="black"/>
            </g>
            </g>
            <g opacity="0.6">
            <g opacity="0.6">
            <path opacity="0.6" d="M0.124756 6.91961V9.60739L2.51475 8.2635V5.57571L0.124756 6.91961Z" fill="black"/>
            </g>
            </g>
            <g opacity="0.8">
            <g opacity="0.8">
            <path opacity="0.8" d="M5.15674 3.73808L6.35046 4.41002L7.54673 3.73808L6.35046 3.06613L5.15674 3.73808Z" fill="black"/>
            </g>
            </g>
            <g opacity="0.8">
            <g opacity="0.8">
            <path opacity="0.8" d="M0.124756 6.91961L2.51474 8.2635L4.90473 6.91961L2.51474 5.57571L0.124756 6.91961Z" fill="black"/>
            </g>
            </g>
            <g opacity="0.3">
            <g opacity="0.3">
            <path opacity="0.3" d="M5.47241 9.60741L7.85986 10.9513L10.2498 9.60741L7.85986 8.26352L5.47241 9.60741Z" fill="black"/>
            </g>
            </g>
            <g opacity="0.45">
            <g opacity="0.45">
            <path opacity="0.45" d="M7.85986 8.26354V10.9513L5.47241 9.60743V6.91965L7.85986 8.26354Z" fill="black"/>
            </g>
            </g>
            <g opacity="0.45">
            <g opacity="0.45">
            <path opacity="0.45" d="M10.2498 6.91961V9.60739L7.85986 8.2635V5.57571L10.2498 6.91961Z" fill="black"/>
            </g>
            </g>
            <g opacity="0.6">
            <g opacity="0.6">
            <path opacity="0.6" d="M7.85986 8.26354V10.9513L10.2498 9.60743V6.91965L7.85986 8.26354Z" fill="black"/>
            </g>
            </g>
            <g opacity="0.6">
            <g opacity="0.6">
            <path opacity="0.6" d="M5.47241 6.91961V9.60739L7.85986 8.2635V5.57571L5.47241 6.91961Z" fill="black"/>
            </g>
            </g>
            <g opacity="0.8">
            <g opacity="0.8">
            <path opacity="0.8" d="M5.47241 6.91961L7.85986 8.2635L10.2498 6.91961L7.85986 5.57571L5.47241 6.91961Z" fill="black"/>
            </g>
            </g>
            <g opacity="0.6">
            <g opacity="0.6">
            <path opacity="0.6" d="M5.15674 2.39421V3.7381L6.35046 3.06615V1.72226L5.15674 2.39421Z" fill="black"/>
            </g>
            </g>
            <g opacity="0.3">
            <g opacity="0.3">
            <path opacity="0.3" d="M2.7666 5.08202L5.15659 6.42591L7.54658 5.08202L5.15659 3.73813L2.7666 5.08202Z" fill="black"/>
            </g>
            </g>
            <g opacity="0.45">
            <g opacity="0.45">
            <path opacity="0.45" d="M5.15659 3.73809V6.42587L2.7666 5.08198V2.3942L5.15659 3.73809Z" fill="black"/>
            </g>
            </g>
            <g opacity="0.6">
            <g opacity="0.6">
            <path opacity="0.6" d="M2.7666 2.39422V5.082L5.15659 3.73811V1.05032L2.7666 2.39422Z" fill="black"/>
            </g>
            </g>
            <g opacity="0.6">
            <g opacity="0.6">
            <path opacity="0.6" d="M6.35046 4.41002V3.06613L5.15674 3.73808V5.08197V6.42586L6.35046 5.75391L7.54673 5.08197V3.73808L6.35046 4.41002Z" fill="black"/>
            </g>
            </g>
            <g opacity="0.45">
            <g opacity="0.45">
            <path opacity="0.45" d="M6.35046 1.72227L5.15674 1.05032V3.73811L7.54673 5.082V3.73811L6.35046 3.06616V1.72227Z" fill="black"/>
            </g>
            </g>
            <g opacity="0.8">
            <g opacity="0.8">
            <path opacity="0.8" d="M5.15659 1.05032L6.35031 1.72227L5.15659 2.39421V3.73811L2.7666 2.39421L5.15659 1.05032Z" fill="black"/>
            </g>
            </g>
            <g opacity="0.8">
            <g opacity="0.8">
            <path opacity="0.8" d="M6.79834 1.42191L7.9946 2.09386L9.18832 1.42191L7.9946 0.749969L6.79834 1.42191Z" fill="black"/>
            </g>
            </g>
        </svg>`
}