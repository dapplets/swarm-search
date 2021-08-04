import { } from '@dapplets/dapplet-extension';
import { Api } from './api';
import THUMBNAIL_IMG from './icons/thumbnail.png';

@Injectable
export default class GoogleFeature {

  @Inject('search-adapter')
  public adapter: any;

  private _api = new Api();

  activate() {
    const { button, result } = this.adapter.exports;
    this.adapter.attachConfig({
      SEARCH_RESULT_GROUP: async (ctx) => {
        const results = await this._api.search();
        return results.map(x => result({
          "DEFAULT": {
            ...x,
            title: ctx.query,
            img: THUMBNAIL_IMG,
            exec: (ctx, me) => {
              window.open('https://gateway.ethswarm.org/files/6995fd78ab680c53d6cc4003082e5cf9b5225644ae6e0f1892ecf966075f0248', '_blank')
            }
          }
        }));
      },
    });
  }
}
