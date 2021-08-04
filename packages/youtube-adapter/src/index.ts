import { IFeature } from '@dapplets/dapplet-extension';
//import { IDynamicAdapter } from 'dynamic-adapter.dapplet-base.eth';
import { IButtonState, Button } from './button';
import { Badge } from './badge';
import { Result } from './result';
import ytdl from 'ytdl-core';

@Injectable
export default class TwitterAdapter {

    // ToDo: refactor it
    public exports = featureId => ({
        button: this.adapter.createWidgetFactory(Button),
        badge: this.adapter.createWidgetFactory(Badge),
        result: this.adapter.createWidgetFactory(Result)
    });

    public config = {
        VIDEO: {
            containerSelector: 'ytd-watch-flexy:not([hidden]) #primary',
            contextSelector: "#primary-inner",
            insPoints: {
                MENU: {
                    selector: "#info-contents #menu ytd-menu-renderer #top-level-buttons-computed",
                    insert: 'end'
                }
            },
            contextBuilder: (p: any) => ({
                id: (new URL(document.location.href)).searchParams.get('v'),
                title: p.querySelector('#info-contents h1').innerText,
                views: parseInt(p.querySelector('#info-contents #info-text #count').innerText.match(/[0-9]/g).join('')),
                videoId: (new URL(document.location.href)).searchParams.get('v')
            }),
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
            contextSelector: "#container",
            insPoints: {
                SEARCH_RESULTS: {
                    selector: "ytd-video-renderer",
                    insert: 'begin'
                }
            },
            contextBuilder: (p: any) => {
                return ({
                    search: document.querySelector('#search #search')?.['value']
                })
            },
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
        this.adapter.attachConfig(feature);
    }

    // ToDo: refactor it
    public detachConfig(feature: IFeature): void {
        this.adapter.detachConfig(feature);
    }

    public async getCurrentVideoInfo() {
        return ytdl.getInfo(document.location.href);
    }

    private _getTheme() {
        const isDark = document.querySelector('html').getAttribute('dark') === 'true';
        return (isDark) ? "DARK" : "LIGHT";
    }
}