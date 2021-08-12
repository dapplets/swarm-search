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
        const metadata = {
          title: message.title,
          description: message.description,
          thumbnailUrl: message.thumbnailUrl,
          channelName: message.channelName,
          channelIconUrl: message.channelIconUrl,
          type: message.type,
          url: ctx.url,
          reference: ctx.reference,
          name: ctx.file.name,
          size: ctx.file.size,
          contentType: ctx.file.type
        };

        const formData = new FormData();
        formData.append("file", ctx.file);
        formData.append("metadata", JSON.stringify(metadata));
        fetch(this.searchEngineUrl + 'files', { method: 'POST', body: formData })
          .then(x => x.ok ? overlay.send('upload_done', 'Cannot upload') : overlay.send('upload_error', 'Error'))
          .catch(x => overlay.send('upload_error', 'Error'));
      }
    });
  }
}
