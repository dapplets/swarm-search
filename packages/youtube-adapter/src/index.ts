import { IFeature } from '@dapplets/dapplet-extension';
//import { IDynamicAdapter } from 'dynamic-adapter.dapplet-base.eth';
import { IButtonState, Button } from './button';
import { Badge } from './badge';
import { Result } from './result';
import { MoreResults } from './moreResults';
import ytdl from 'ytdl-core';

@Injectable
export default class YoutubeAdapter {

    // ToDo: refactor it
    public exports = featureId => ({
        button: this.adapter.createWidgetFactory(Button),
        badge: this.adapter.createWidgetFactory(Badge),
        result: this.adapter.createWidgetFactory(Result),
        moreResults: this.adapter.createWidgetFactory(MoreResults),
    });

    public config = {
        VIDEO: {
            containerSelector: 'ytd-page-manager',
            contextSelector: 'ytd-watch-flexy[video-id]',
            insPoints: {
                MENU: {
                    selector: "#menu #top-level-buttons-computed",
                    insert: 'end'
                }
            },
            contextBuilder: (p: any) => {
                if (p.querySelector('.ad-showing')) return;
                return ({
                    id: (new URL(document.location.href)).searchParams.get('v'),
                    title: p.querySelector('#primary-inner #info-contents h1').innerText,
                    views: parseInt(p.querySelector('#primary-inner #info-contents #info-text #count .view-count').innerText.match(/[0-9]/g).join('')),
                    videoId: (new URL(document.location.href)).searchParams.get('v')
                });
            },
            theme: this._getTheme
        },
        SEARCH_RESULT: {
            containerSelector: 'ytd-search',
            contextSelector: "ytd-video-renderer",
            insPoints: {
                SEARCH_RESULT_BADGES: {
                    selector: "#badges",
                    insert: 'inside'
                }
            },
            contextBuilder: (p: any) => {
                p.querySelector('#badges')?.removeAttribute("hidden"); // make badges div visible

                return ({
                    id: p.querySelector('#title-wrapper h3 a').getAttribute('href').substring(9),
                    title: p.querySelector('#title-wrapper h3').innerText,
                    videoId: p.querySelector('#title-wrapper h3 a').getAttribute('href').substring(9)
                })
            },
            theme: this._getTheme
        },
        SEARCH_RESULT_GROUP: {
            containerSelector: 'ytd-search',
            insPoints: {
                SEARCH_RESULTS: {
                    selector: "ytd-item-section-renderer #header",
                    insert: 'inside'
                },
                PLUS: {
                    selector: "ytd-item-section-renderer #header",
                    insert: 'end'
                },
            },
            contextBuilder: (p: any) => ({
                id: document.location.href,
                query: document.querySelector('#search #search')?.['value'],
                type: 'video'
            }),
            theme: this._getTheme
        }
    };

    constructor(
        @Inject("dynamic-adapter.dapplet-base.eth")
        readonly adapter: any
    ) {
        this.adapter.configure(this.config);
    }

    // ToDo: refactor it
    public attachConfig(feature: IFeature): void { // ToDo: automate two-way dependency handling(?)
        return this.adapter.attachConfig(feature);
    }

    // ToDo: refactor it
    public detachConfig(feature: IFeature): void {
        this.adapter.detachConfig(feature);
    }

    public async getCurrentVideoInfo() {
        return ytdl.getInfo(document.location.href);
    }

    private _getTheme() {
        const isDark = document.documentElement.getAttribute('dark') === 'true';
        return (isDark) ? "DARK" : "LIGHT";
    }
}