// import { IWidget } from 'dynamic-adapter.dapplet-base.eth';

export interface IResultState {
    hidden: boolean;
    img: string;
    title: string;
    views: string;
    date: string;
    channelIcon?: string;
    channel: string;
    description: string;
    disabled: boolean;
    badges: { color: string; tooltip: string; label: string, basic: boolean }[];
    exec: (ctx: any, me: IResultState) => void;
    init: (ctx: any, me: IResultState) => void;
    ctx: any;
    insPointName: string;
    theme: "DARK" | "LIGHT";
}

export class Result {
    public el: HTMLElement;
    public state: IResultState;
    insPointName: string;

    public static contextInsPoints = {
        SEARCH_RESULT_GROUP: 'SEARCH_RESULTS'
    }

    public mount() {
        this._injectStyles();
        if (!this.el) this._createElement();

        const { img, title, hidden, views, date, channelIcon, channel, description, badges, theme } = this.state;

        if (hidden) {
            this.el.innerHTML = '';
            return;
        } else {
            this.el.innerHTML = `
                <div style="display: flex; cursor: pointer; margin-top: 22px; position: relative;">
                    <div 
                        style="width: 42px; 
                        height: 42px; 
                        background-color: #FF951A;
                        border-radius: 50%;
                        position: absolute;
                        left: -10px;
                        top: -7px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 1;
                    ">
                        ${getIcon()}
                    </div>

                    <div style="
                        max-width: 354px; 
                        min-width: 240px; 
                        position: relative; 
                        width: 100%;
                        flex: 1;
                        margin-right: 21px;"
                        class="dapplet-before-styles">
                        <div style="
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            display: block;
                            background: #000;
                            border: 3px solid #FF9519;
                        ">
                            <img
                                style="
                                    display: block;
                                    width: 100%;
                                    object-fit: contain;
                                    height: 100%;"
                                src="${img}"
                            />
                        </div>
                    </div>
                     

                    <div style="display: flex; flex-direction: column; min-width: 0; flex: 1; flex-basis: 0.000000001px;">
                    
                        <div style="font-size: 18px; 
                                    font-weight: 400; 
                                    line-height: 24px; 
                                    ${(theme === "DARK") ? "color: #fff;" : 'color: #000;'}
                                    -ms-text-overflow: ellipsis;
                                    -o-text-overflow: ellipsis;
                                    text-overflow: ellipsis;
                                    overflow: hidden;
                                    -ms-line-clamp: 2;
                                    -webkit-line-clamp: 2;
                                    line-clamp: 2;
                                    display: -webkit-box;
                                    display: box;
                                    word-wrap: break-word;
                                    -webkit-box-orient: vertical;
                                    box-orient: vertical;">
                            ${title}
                        </div>

                        <div style="font-size: 13px; 
                            font-weight: 400; 
                            line-height: 18px; 
                            ${(theme === "DARK") ? "color: #aaa;" : 'color: rgb(96, 96, 96);'}
                        ">
                            ${(views) ? `${views} views · ` : ''}${date}
                        </div>

                        <div style="font-size: 13px; font-weight: 400; ${(theme === "DARK") ? "color: #aaa;" : 'color: rgb(96, 96, 96);'} margin: 10px 0; display: flex;">
                            ${(channelIcon) ? `<img style="border-radius: 12px; width: 24px; height: 24px; object-fit: cover; margin-right: 8px;" src="${channelIcon}" alt="${channel}" width="24" height="24" />` : ''}
                            <div style="line-height: 24px;">${channel}</div>
                        </div>

                        <div style="font-size: 13px; 
                            font-weight: 400; 
                            line-height: 18px; 
                            ${(theme === "DARK") ? "color: #aaa;" : 'color: rgb(96, 96, 96);'} 
                            -ms-text-overflow: ellipsis;
                            -o-text-overflow: ellipsis;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            -ms-line-clamp: 2;
                            -webkit-line-clamp: 2;
                            line-clamp: 2;
                            display: -webkit-box;
                            display: box;
                            word-wrap: break-word;
                            -webkit-box-orient: vertical;
                            box-orient: vertical;">
                            ${description}
                        </div>
    
                        <div style="margin-top: 10px;">
                            ${(badges) ? (badges.map(x => (`<div 
                                style="
                                    ${(!x.basic) ? `background-color: ${x.color};` : ''}
                                    padding: 3px 4px;
                                    font-size: 12px;
                                    font-weight: 500;
                                    border-radius: 2px;
                                    font-family: Roboto, Arial, sans-serif;
                                    line-height: 12px;
                                    ${(x.basic) ? (`color: ${x.color ?? 'color: rgb(96,96,96)'};`) : 'color: rgb(96,96,96);'}
                                    margin-right: 4px;
                                    float: left;
                                "
                                ${(x.tooltip) ? `title="${x.tooltip}"` : ''}
                            >${x.label}</div>`)).join('')) : ''}
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

    private _injectStyles(): void {
        if (!!document.getElementById('dapplet-before-styles')) return;

        const styleTag: HTMLStyleElement = document.createElement('style');
        styleTag.id = 'dapplet-before-styles';
        styleTag.innerText = `
            .dapplet-before-styles:before {
                display: block;
                content: "";
                padding-top: 56.11%;
            }
        `;
        document.head.appendChild(styleTag);
    }
}


function getIcon(): string {
    return `
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.45">
        <g opacity="0.45">
        <path opacity="0.45" d="M21.7731 2.31787V5.45362L18.9878 3.88575V0.75L21.7731 2.31787Z" fill="black"/>
        </g>
        </g>
        <g opacity="0.6">
        <g opacity="0.6">
        <path opacity="0.6" d="M18.9878 3.88575V7.02149L21.7731 5.45362V2.31787L18.9878 3.88575Z" fill="black"/>
        </g>
        </g>
        <g opacity="0.3">
        <g opacity="0.3">
        <path opacity="0.3" d="M0.624756 21.4174L6.2014 24.5531L11.778 21.4174L6.2014 18.2816L0.624756 21.4174Z" fill="black"/>
        </g>
        </g>
        <g opacity="0.45">
        <g opacity="0.45">
        <path opacity="0.45" d="M6.2014 18.2817V24.5532L0.624756 21.4175V15.146L6.2014 18.2817Z" fill="black"/>
        </g>
        </g>
        <g opacity="0.45">
        <g opacity="0.45">
        <path opacity="0.45" d="M11.7783 15.1459V21.4174L6.20166 18.2816V12.0101L11.7783 15.1459Z" fill="black"/>
        </g>
        </g>
        <g opacity="0.6">
        <g opacity="0.6">
        <path opacity="0.6" d="M6.20166 18.2817V24.5532L11.7783 21.4175V15.146L6.20166 18.2817Z" fill="black"/>
        </g>
        </g>
        <g opacity="0.6">
        <g opacity="0.6">
        <path opacity="0.6" d="M0.624756 15.1459V21.4174L6.2014 18.2816V12.0101L0.624756 15.1459Z" fill="black"/>
        </g>
        </g>
        <g opacity="0.8">
        <g opacity="0.8">
        <path opacity="0.8" d="M12.3662 7.72217L15.1516 9.29005L17.9429 7.72217L15.1516 6.1543L12.3662 7.72217Z" fill="black"/>
        </g>
        </g>
        <g opacity="0.8">
        <g opacity="0.8">
        <path opacity="0.8" d="M0.624756 15.1459L6.2014 18.2816L11.778 15.1459L6.2014 12.0101L0.624756 15.1459Z" fill="black"/>
        </g>
        </g>
        <g opacity="0.3">
        <g opacity="0.3">
        <path opacity="0.3" d="M13.1025 21.4174L18.6732 24.5531L24.2499 21.4174L18.6732 18.2816L13.1025 21.4174Z" fill="black"/>
        </g>
        </g>
        <g opacity="0.45">
        <g opacity="0.45">
        <path opacity="0.45" d="M18.6732 18.2817V24.5532L13.1025 21.4175V15.146L18.6732 18.2817Z" fill="black"/>
        </g>
        </g>
        <g opacity="0.45">
        <g opacity="0.45">
        <path opacity="0.45" d="M24.25 15.1459V21.4174L18.6733 18.2816V12.0101L24.25 15.1459Z" fill="black"/>
        </g>
        </g>
        <g opacity="0.6">
        <g opacity="0.6">
        <path opacity="0.6" d="M18.6733 18.2817V24.5532L24.25 21.4175V15.146L18.6733 18.2817Z" fill="black"/>
        </g>
        </g>
        <g opacity="0.6">
        <g opacity="0.6">
        <path opacity="0.6" d="M13.1025 15.1459V21.4174L18.6732 18.2816V12.0101L13.1025 15.1459Z" fill="black"/>
        </g>
        </g>
        <g opacity="0.8">
        <g opacity="0.8">
        <path opacity="0.8" d="M13.1025 15.1459L18.6732 18.2816L24.2499 15.1459L18.6732 12.0101L13.1025 15.1459Z" fill="black"/>
        </g>
        </g>
        <g opacity="0.6">
        <g opacity="0.6">
        <path opacity="0.6" d="M12.3662 4.58655V7.7223L15.1516 6.15442V3.01868L12.3662 4.58655Z" fill="black"/>
        </g>
        </g>
        <g opacity="0.3">
        <g opacity="0.3">
        <path opacity="0.3" d="M6.78931 10.8582L12.3659 13.9939L17.9426 10.8582L12.3659 7.72241L6.78931 10.8582Z" fill="black"/>
        </g>
        </g>
        <g opacity="0.45">
        <g opacity="0.45">
        <path opacity="0.45" d="M12.3659 7.7223V13.9938L6.78931 10.858V4.58655L12.3659 7.7223Z" fill="black"/>
        </g>
        </g>
        <g opacity="0.6">
        <g opacity="0.6">
        <path opacity="0.6" d="M6.78931 4.58655V10.858L12.3659 7.7223V1.45081L6.78931 4.58655Z" fill="black"/>
        </g>
        </g>
        <g opacity="0.6">
        <g opacity="0.6">
        <path opacity="0.6" d="M15.1516 9.29004V6.1543L12.3662 7.72217V10.8579V13.9937L15.1516 12.4258L17.9429 10.8579V7.72217L15.1516 9.29004Z" fill="black"/>
        </g>
        </g>
        <g opacity="0.45">
        <g opacity="0.45">
        <path opacity="0.45" d="M15.1516 3.01868L12.3662 1.45081V7.7223L17.9429 10.858V7.7223L15.1516 6.15443V3.01868Z" fill="black"/>
        </g>
        </g>
        <g opacity="0.8">
        <g opacity="0.8">
        <path opacity="0.8" d="M12.3659 1.45081L15.1513 3.01868L12.3659 4.58655V7.7223L6.78931 4.58655L12.3659 1.45081Z" fill="black"/>
        </g>
        </g>
        <g opacity="0.8">
        <g opacity="0.8">
        <path opacity="0.8" d="M16.1965 2.31787L18.9878 3.88574L21.7732 2.31787L18.9878 0.75L16.1965 2.31787Z" fill="black"/>
        </g>
        </g>
    </svg>`
}