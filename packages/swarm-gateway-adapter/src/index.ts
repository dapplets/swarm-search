import { IFeature } from '@dapplets/dapplet-extension';
import { Button } from './button';

@Injectable
export default class SwarmGatewayAdapter {
  private _currentInput: HTMLInputElement = null;

  public exports = () => ({
    button: this.adapter.createWidgetFactory(Button)
  });

  public config = {
    UPLOADED_FILE: {
      containerSelector: '#root',
      insPoints: {
        BUTTONS: {
          selector: '.jss5:nth-child(2)',
          insert: 'inside',
        },
      },
      contextBuilder: (node) => {
        const link = node.querySelector('.MuiPaper-root > span.MuiTypography-root');
        return link ? ({
          id: link.innerText,
          url: link.innerText,
          reference: /[0-9a-fA-F]{64}/gm.exec(link.innerText)[0],
          file: this._currentInput.files[0]
        }) : null
      },
    },
    ATTACHED_FILE: {
      containerSelector: '#root',
      contextSelector: 'input',
      contextBuilder: (node) => {
        this._currentInput = node;
        return ({
          id: 'file'
        });
      },
    }
  };

  constructor(
    @Inject('dynamic-adapter.dapplet-base.eth') readonly adapter: any,
  ) {
    this.adapter.configure(this.config);
  }

  public attachConfig(feature: IFeature): void {
    return this.adapter.attachConfig(feature);
  }

  public detachConfig(feature: IFeature): void {
    this.adapter.detachConfig(feature);
  }
}
