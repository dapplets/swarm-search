import { } from '@dapplets/dapplet-extension';
import { Api } from './api';
import THUMBNAIL_IMG from './icons/thumbnail.png';

const searchResults = [
  {
    title: 'Typesss of Clouds | NOAA SciJinks - All About Weather',
    link: 'https://scijinks.gov/clouds/',
    description:
      'Mammatus clouds. Mammatus clouds are actually altocumulus, cirrus,\
      cumulonimbus, or other types of clouds that have these pouch-like shapes hanging \
      out of the bottom. The pouches are created when cold air within the cloud sinks down \
      toward the Earth. Weather prediction: Severe weather might be on its way!',
  },
  {
    title: 'Clouds—facts and information - Science',
    link: 'https://www.nationalgeographic.com/science/article/clouds-1',
    description:
      'Altostratus clouds may portend a storm. Nimbostratus clouds are thick \
      and dark and can produce both rain and snow. Low clouds fall into four divisions: \
      cumulus, stratus, cumulonimbus, and ...',
  },
  {
    title: 'Types of Clouds | Live Science',
    link: 'https://www.livescience.com/29436-clouds.html',
    description:
      'Clouds of great vertical development: These are the cumulonimbus clouds, \
      often called a thunderhead because torrential rain, vivid lightning and thunder come \
      from it. The tops of such clouds may ...',
  },
];

@Injectable
export default class GoogleFeature {

  @Inject('search-adapter')
  public adapter: any;

  private _api = new Api();

  activate() {
    const { button, result } = this.adapter.exports;
    this.adapter.attachConfig({
      SEARCH_RESULT_GROUP: async () => {
        const search = await this._api.search();
        return search.map(x => result({
          "DEFAULT": {
            ...x,
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
