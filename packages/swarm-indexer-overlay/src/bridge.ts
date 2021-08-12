import AbstractBridge from '@dapplets/dapplet-overlay-bridge';

export interface FileInfo {
    url: string;
    reference: string;
    name: string;
    size: number;
    type: string;
}

class Bridge extends AbstractBridge {
    _subId = 0;

    onFile(callback: (info: FileInfo) => void) {
        this.subscribe('file', (data: FileInfo) => {
            callback(data);
            return (++this._subId).toString();
        });
    }

    upload(metadata: any) {
        return this.call('upload', metadata, 'upload_done', 'upload_error');
    }

    // onDownloadStatus(callback: (value: number) => void) {
    //     this.subscribe('download_status', callback);
    // }

    // onUploadStatus(callback: (value: number) => void) {
    //     this.subscribe('upload_status', callback);
    // }

    public async call(method: string, args: any, successEvent: string, errorEvent: string): Promise<any> {
        return new Promise((res, rej) => {
            this.publish(this._subId.toString(), {
                type: method,
                message: args
            });
            this.subscribe(successEvent, (result: any) => {
                this.unsubscribe(successEvent);
                this.unsubscribe(errorEvent);
                res(result);
            });
            this.subscribe(errorEvent, (error: any) => {
                this.unsubscribe(successEvent);
                this.unsubscribe(errorEvent);
                rej(error);
            });
        });
    }
}

const bridge = new Bridge();

export { bridge };