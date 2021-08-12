import { } from '@dapplets/dapplet-extension';
import ADD_ICON from './icons/add24.png';

@Injectable
export default class SwarmIndexerDapplet {

  @Inject('swarm-gateway-adapter')
  public adapter: any;

  async activate() {
    const { button } = this.adapter.exports;
    const { reset } = this.adapter.attachConfig({
      UPLOADED_FILE: () => [
        button({
          DEFAULT: {
            // label: 'Add file to the Swarm Search Index',
            // img: ADD_ICON,
            exec: (ctx) => {
              console.log(ctx)
            }
          }
        })
      ]
    });
  }
}
