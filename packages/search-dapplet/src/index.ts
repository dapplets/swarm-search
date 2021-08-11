import { } from '@dapplets/dapplet-extension';
import { Api } from './api';
import SWARM_PLUS_ICON from './icons/swarm-plus-icon.svg';
import PLUS_SMALL_ICON from './icons/plus_small.svg';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

@Injectable
export default class GoogleFeature {

  @Inject('search-adapter')
  public adapter: any;

  private _api = new Api();
  private _config: any;
  private _searchQuery: string;
  private _searchResults: any[] = [];
  private _showingResultsNmbr = 3;
  private _setConfig: any;
  private _searchOffset = 0;

  activate() {
    this.adapter.getCurrentVideoInfo().then(console.log).catch(console.error);
    TimeAgo.addDefaultLocale(en);
    const timeAgo = new TimeAgo('en-US');
    const { result, moreResults } = this.adapter.exports;
    this._setConfig = () => {
      this._config = {
        SEARCH_RESULT_GROUP: async (ctx) => {
          if (ctx.query !== this._searchQuery) {
            this._searchQuery = ctx.query;
            this._searchOffset = 0;
            this._showingResultsNmbr = 3;
            console.log(`searching of ${ctx.types?.join(', ')} ...`);
            this._searchResults = await this._api.search(this._searchQuery, this._searchOffset++);
          }
          if (this._showingResultsNmbr >= this._searchResults.length - 5) {
            console.log(`searching of ${ctx.types?.join(', ')} ...`);
            const newSearchResults = await this._api.search(this._searchQuery, this._searchOffset++);
            this._searchResults = this._searchResults.concat(newSearchResults);
          }
          const showingResults = this._searchResults
            .filter((value, index) => index < this._showingResultsNmbr)
            .map(x => result({
              DEFAULT: {
                title: x.title,
                // views: "10M",
                url: x.link,
                date: timeAgo.format(x.pubDate),
                channelIcon: x.author?.icon,
                channel: x.author?.name,
                description: x.description.substr(0, 130) + ' ...',
                img: x.thumbnail.reverse()[0]?.url,
                badges: [{
                  label: 'Swarm Search',
                  color: '#ffc300'
                }],
                exec: () => window.open(x.link, '_blank')
              }
            }));
          showingResults.push(
            moreResults({
              DEFAULT: {
                title: 'More from Swarm',
                color: '#FF9519',
                icon: {
                  youtube: PLUS_SMALL_ICON,
                  google: SWARM_PLUS_ICON,
                },
                exec: () => {
                  this._showingResultsNmbr += 5
                  this.adapter.detachConfig(this._config);
                  this.adapter.attachConfig(this._setConfig());
                },
              }
            })
          );
          return showingResults;
        },
      };
      return this._config;
    };
    this.adapter.attachConfig(this._setConfig());
  }
}
