import {} from '@dapplets/dapplet-extension';
import EXAMPLE_IMG from './icons/icon19.png';
import GRAY_IMG from './icons/icon19gray.png';

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
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  @Inject('my-virtual-adapter.dapplet-base.eth') public adapter: any;

  activate() {
    const { button, result } = this.adapter.exports;
    this.adapter.attachConfig({
      MENU: () => [
        button({
          initial: 'RESULTS',
          RESULTS: {
            label: 'Hi',
            img: GRAY_IMG,
            tooltip: 'Hi, friend!',
            isActive: false,
            exec: (ctx, me) => {
              const el = document.querySelector(ctx.insertPoint);
              el.style.display = 'none';
              if (!('replacedEl' in ctx)) {
                ctx.replacedEl = document.createElement('div');
                ctx.replacedEl.style.justifyContent = 'center';
                const elImg = document.createElement('img');
                elImg.src = `${EXAMPLE_IMG}`;
                ctx.replacedEl.appendChild(elImg);
                el.parentElement.appendChild(ctx.replacedEl);
              }
              ctx.replacedEl.style.display = 'flex';
              me.state = 'FRIENDS';
            },
          },
          FRIENDS: {
            label: 'Hi',
            img: EXAMPLE_IMG,
            tooltip: 'Go to results',
            isActive: true,
            exec: (ctx, me) => {
              const el = document.querySelector(ctx.insertPoint);
              el.style.display = 'block';
              ctx.replacedEl.style.display = 'none';
              me.state = 'RESULTS';
            },
          },
        }),
      ],
      SEARCH_RESULT: () => [
        button({
          initial: 'DEFAULT',
          DEFAULT: {
            label: 'Get data',
            tooltip: 'Show in the alert',
            img: EXAMPLE_IMG,
            exec: (ctx) => {
              const { title, link, description } = ctx;
              alert(`  title: ${title}\n  link: ${link}\n  description: ${description}`);
            },
          },
        }),
      ],
      WIDGETS: () => [
        result({
          initial: 'DEFAULT',
          DEFAULT: {
            img: EXAMPLE_IMG,
            title: 'clouds',
            searchResults,
          },
        }),
      ],
      DAPPLET_SEARCH_RESULT: () => [
        button({
          initial: 'DEFAULT',
          DEFAULT: {
            label: 'Get data',
            tooltip: 'Show in the alert',
            img: EXAMPLE_IMG,
            exec: (ctx) => {
              const { title, link, description } = ctx;
              alert(`  title: ${title}\n  link: ${link}\n  description: ${description}`);
            },
          },
        }),
      ],
    });
  }
}
