import AbstractBridge from '@dapplets/dapplet-overlay-bridge';

export interface Info {
    videoInfo: any;
    swarmGatewayUrl: string;
    contractAddress: string;
}

class Bridge extends AbstractBridge {
    _subId = 0;

    onInfo(callback: (info: Info) => void) {
        this.subscribe('info', (data: Info) => {
            callback(data);
            return (++this._subId).toString();
        });
    }

    download(url: string, filename: string) {
        return this.call('download', { url, filename }, 'downloaded');
    }

    onDownloadStatus(callback: (value: number) => void) {
        this.subscribe('download_status', callback);
    }

    onUploadStatus(callback: (value: number) => void) {
        this.subscribe('upload_status', callback);
    }

    public async call(method: string, args: any, callbackEvent: string): Promise<any> {
        return new Promise((res, rej) => {
            this.publish(this._subId.toString(), {
                type: method,
                message: args
            });
            this.subscribe(callbackEvent, (result: any) => {
                this.unsubscribe(callbackEvent);
                res(result);
                // ToDo: add reject call
            });
        });
    }
}

const bridge = new Bridge();

export { bridge };