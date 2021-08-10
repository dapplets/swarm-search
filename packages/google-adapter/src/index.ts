import { IFeature } from '@dapplets/dapplet-extension';
import { Button } from './button';
import { ResultContainer } from './resultContainer';
import { Result } from './result';
import { MoreResults } from './moreResults';

type ContextBuilder = {
  [propName: string]: any;
};
type Exports = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [propName: string]: any;
};

@Injectable
export default class GoogleAdapter {
  public exports = (): Exports => ({
    button: this.adapter.createWidgetFactory(Button),
    resultContainer: this.adapter.createWidgetFactory(ResultContainer),
    result: this.adapter.createWidgetFactory(Result),
    moreResults: this.adapter.createWidgetFactory(MoreResults),
  });

  public config = {
    MENU: {
      containerSelector: '#cnt, .ndYZfc',
      contextSelector: '#top_nav, .jZWadf',
      insPoints: {
        MENU: {
          selector: '.MUFPAc, .T47uwc',
          insert: 'inside',
        },
      },
      contextBuilder: (): ContextBuilder => ({
        id: '',
        insertPoint: '#rcnt, .mJxzWe',
      }),
    },
    SEARCH_RESULT: {
      containerSelector: '#search',
      contextSelector: '#rso > .g > div > .tF2Cxc, #rso > div > .g > div > .tF2Cxc',
      insPoints: {
        SEARCH_RESULT: {
          selector: '.yuRUbf',
          insert: 'inside',
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      contextBuilder: (searchNode: any): ContextBuilder => ({
        id: searchNode.querySelector('.yuRUbf > a').href,
        title: searchNode.querySelector('h3').textContent,
        link: searchNode.querySelector('.yuRUbf > a').href,
        description: searchNode.querySelector('.IsZvec').textContent,
      }),
    },
    DAPPLET_SEARCH_RESULT: {
      containerSelector: '#search',
      contextSelector: '.hlcw0c-dapp .tF2Cxc',
      insPoints: {
        DAPPLET_SEARCH_RESULT: {
          selector: '.yuRUbf',
          insert: 'inside',
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      contextBuilder: (searchNode: any): ContextBuilder => ({
        id: searchNode.querySelector('.yuRUbf > a').href,
        title: searchNode.querySelector('h3 > span').textContent,
        link: searchNode.querySelector('.yuRUbf > a').href,
        description: searchNode.querySelector('.IsZvec').textContent,
      }),
    },
    WIDGETS: {
      containerSelector: '#search',
      contextSelector: '#rso',
      insPoints: {
        WIDGETS: {
          selector: '.ULSxyf',
          insert: 'begin',
        },
      },
      contextBuilder: (): ContextBuilder => ({
        id: '',
      }),
    },
    SEARCH_RESULT_GROUP: {
      containerSelector: 'body',
      insPoints: {
        SEARCH_RESULTS: {
          selector: '#rso > *',
          insert: 'begin',
        },
        PLUS: {
          selector: '#rso > *',
          insert: 'begin',
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      contextBuilder: (x: any): ContextBuilder => {
        const type = (document.querySelector('#top_nav .MUFPAc .hdtb-mitem[aria-current=page]') as any)?.innerText;
        const map = {
          'All': ['all'],
          'Videos': ['video']
        };
        return ({
          id: new URL(document.location.href).searchParams.get('q'),
          query: new URL(document.location.href).searchParams.get('q'),
          types: map[type] ?? []
        });
      },
    }
  };

  constructor(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    @Inject('dynamic-adapter.dapplet-base.eth') readonly adapter: any,
  ) {
    this.adapter.configure(this.config);
  }

  public attachConfig(feature: IFeature): void {
    this.adapter.attachConfig(feature);
  }

  public detachConfig(feature: IFeature): void {
    this.adapter.detachConfig(feature);
  }
}
