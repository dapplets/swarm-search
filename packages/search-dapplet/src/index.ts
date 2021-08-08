import { } from '@dapplets/dapplet-extension';
import { Api } from './api';
import DEVIANART_LOGO from './icons/deviantart.svg';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

@Injectable
export default class GoogleFeature {

  @Inject('search-adapter')
  public adapter: any;

  private _api = new Api();

  activate() {
    TimeAgo.addDefaultLocale(en);
    const timeAgo = new TimeAgo('en-US');
    const { button, result } = this.adapter.exports;
    this.adapter.attachConfig({
      SEARCH_RESULT_GROUP: async (ctx) => {
        console.log(`searching of ${ctx.types?.join(', ')} ...`);
        const results = await this._api.search(ctx.query, 0);
        return results.splice(0, 3).map(x => result({
          "DEFAULT": {
            title: x.title,
            // views: "10M",
            url: x.link,
            date: timeAgo.format(x.pubDate),
            channelIcon: x.author?.icon,
            channel: x.author?.name,
            description: x.description.substr(0, 130) + ' ...',
            img: x.thumbnail.reverse()[0].url,
            badges: [{
              label: 'Swarm Search',
              color: '#ffc300'
            }],
            exec: (ctx, me) => window.open(x.link, '_blank')
          }
        }));
      },
    });
  }
}
