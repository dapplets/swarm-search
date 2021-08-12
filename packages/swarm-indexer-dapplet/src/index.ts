import { } from '@dapplets/dapplet-extension';
import ADD_ICON from './icons/add24.png';

@Injectable
export default class SwarmIndexerDapplet {

  @Inject('swarm-gateway-adapter')
  public adapter: any;

  searchEngineUrl: string;

  async activate() {

    const searchEngineUrl = await Core.storage.get('searchEngineUrl');
    if (!searchEngineUrl) throw new Error("Search Engine URL is required. Check dapplet's settings.");
    this.searchEngineUrl = searchEngineUrl;

    const { button } = this.adapter.exports;

    this.adapter.attachConfig({
      UPLOADED_FILE: [
        button({
          DEFAULT: {
            label: 'Add file to the Swarm Search Index',
            img: ADD_ICON,
            exec: (ctx) => this._openOverlay(ctx)
          }
        })
      ]
    });

  }

  private _openOverlay(ctx) {
    const overlay = Core.overlay({ name: "swarm-indexer-overlay", title: "Swarm Indexer" });
    overlay.sendAndListen('file', {
      url: ctx.url,
      reference: ctx.reference,
      name: ctx.file.name,
      size: ctx.file.size,
      type: ctx.file.type
    }, {
      'upload': (_, { message }) => {
        message.url = ctx.url;
        message.reference = ctx.reference;
        message.name = ctx.file.name;
        message.size = ctx.file.size;
        message.type = ctx.file.type;
        const formData = new FormData();
        formData.append("file", ctx.file);
        formData.append("metadata", JSON.stringify(message));
        fetch(this.searchEngineUrl + 'files', { method: 'POST', body: formData })
          .then(x => x.ok ? overlay.send('upload_done', 'Cannot upload') : overlay.send('upload_error', 'Error'))
          .catch(x => overlay.send('upload_error', 'Error'));
      }
    });
  }
}
