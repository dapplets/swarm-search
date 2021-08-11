import { } from '@dapplets/dapplet-extension';
import { Api } from './api';
import SWARM_PLUS_ICON from './icons/swarm-plus-icon.svg';
import PLUS_SMALL_ICON from './icons/plus_small.svg';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { deepEqual } from './helpers';

const RESULTS_PER_PAGE = 3;

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

@Injectable
export default class GoogleFeature {

  @Inject('search-adapter')
  public adapter: any;

  private _api = new Api();

  state = {
    results: [],
    isNextAvailable: false,
    isQueryChanged: false,
    isInitialized: false,
    query: '',
    types: [],
    offset: 0
  };

  private _config = null;

  activate() {
    this.loadData();
  }

  async loadData() {
    const { query, types, offset, isQueryChanged } = this.state;

    const newState: any = { isInitialized: true };

    if (isQueryChanged) {
      newState.results = [];
      newState.offset = 0;
    }

    if (query && query !== '') {
      const response = await this._api.search(query, types, offset);
      newState.isNextAvailable = response.isNextAvailable;
      newState.results.push(...response.results);
    }

    this.setState(newState);
  }

  render() {
    const { result, moreResults } = this.adapter.exports;
    console.log('render')

    return {
      SEARCH_RESULT_GROUP: async ({ query, types }) => {
        console.log('new ctx')
        this.setState({ query, types, isQueryChanged: query !== this.state.query });

        const widgets = this.state.results
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

        if (this.state.isNextAvailable) {
          widgets.push(
            moreResults({
              DEFAULT: {
                title: 'More from Swarm',
                color: '#FF9519',
                icon: {
                  youtube: PLUS_SMALL_ICON,
                  google: SWARM_PLUS_ICON,
                },
                exec: async () => {
                  this.state.offset += RESULTS_PER_PAGE;
                  await this.loadData();
                },
              }
            })
          );
        }

        return widgets;
      },
    }
  }

  private setState(changes: any) {
    const copy = Object.assign({}, this.state);
    const newState = Object.assign(copy, changes);
    const isStateChanged = !deepEqual(this.state, newState);
    console.log('isStateChanged', isStateChanged, this.state, newState)
    if (isStateChanged) {
      this.state = newState;
      if (this._config) this.adapter.detachConfig(this._config);
      this._config = this.render();
      this.adapter.attachConfig(this._config);
    }
  }
}
