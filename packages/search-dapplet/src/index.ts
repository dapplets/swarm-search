import { } from '@dapplets/dapplet-extension';
import { Api } from './api';
import SWARM_PLUS_ICON from './icons/swarm-plus-icon.svg';
import PLUS_SMALL_ICON from './icons/plus_small.svg';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

const RESULTS_PER_PAGE = 3;

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

@Injectable
export default class GoogleFeature {

  @Inject('search-adapter')
  public adapter: any;

  private _api: Api;
  private _resultsPerPage: number;

  private _query: string;
  private _results: any[] = [];
  private _offset = 0;
  private _isNextAvailable = false;
  private _searchType = null;

  async activate() {
    const searchEngineUrl = await Core.storage.get('searchEngineUrl');
    const resultsPerPage = await Core.storage.get('resultsPerPage');

    if (!searchEngineUrl) throw new Error('Parameter "searchEngineUrl" is required. Check dapplet\'s settings.');
    if (!resultsPerPage) throw new Error('Parameter "resultsPerPage" is required. Check dapplet\'s settings.');

    this._api = new Api(searchEngineUrl);
    this._resultsPerPage = parseInt(resultsPerPage);

    const { result, moreResults } = this.adapter.exports;
    const { reset } = this.adapter.attachConfig({
      SEARCH_RESULT_GROUP: async (ctx) => {
        // new search query
        if (ctx.query !== this._query) {
          this._query = ctx.query;
          this._searchType = ctx.type;
          this._offset = 0;
          this._results = [];
          await this._loadData();
        }

        const showingResults = this._results.map(x => result({
          DEFAULT: {
            title: x.title,
            url: x.link,
            date: x.pubDate ? timeAgo.format(x.pubDate) : null,
            channelIcon: x.author?.icon,
            channel: x.author?.name,
            description: x.description ? (x.description.length > 130 ? x.description.substr(0, 130) + ' ...' : x.description) : null,
            img: x.thumbnail.reverse()[0]?.url,
            exec: () => window.open(x.link, '_blank'),
            caption: x.link ? 'bzz://' + /[0-9a-fA-F]{64}/gm.exec(x.link)?.[0] : null
          }
        }));

        // show button "more from swarm" if next data is available
        if (this._isNextAvailable) {
          showingResults.push(
            moreResults({
              DEFAULT: {
                title: 'More from Swarm',
                color: '#FF9519',
                icon: {
                  youtube: PLUS_SMALL_ICON,
                  google: SWARM_PLUS_ICON,
                },
                exec: async () => {
                  this._offset += this._resultsPerPage;
                  await this._loadData();
                  reset();
                },
              }
            })
          );
        }

        return showingResults;
      }
    });
  }

  private async _loadData() {
    const response = await this._api.search(this._query, this._offset, this._resultsPerPage, this._searchType);
    this._results.push(...response.results);
    this._isNextAvailable = response.isNextAvailable;
  }
}
