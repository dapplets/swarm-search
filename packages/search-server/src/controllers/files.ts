import { Request, Response } from 'express';
import fetch from 'node-fetch';
import cbor from 'cbor';

export function post(req: Request, res: Response) {
    try {
        if (!req.file) {
            res.json({ success: false, message: "file is required" });
            return;
        }

        if (!req.body.metadata) {
            res.json({ success: false, message: "metadata is required" });
            return;
        }

        const metadata = JSON.parse(req.body.metadata);

        if (!metadata.reference) {
            res.json({ success: false, message: "metadata.reference is required" });
            return;
        }

        const { ELASTICSEARCH_URL } = process.env;
        const url = ELASTICSEARCH_URL + `fs_index/_doc/${metadata.reference}?pipeline=attachment`;

        const body = JSON.stringify({
            data: req.file.buffer.toString('base64'),
            metadata
        });

        fetch(url, { method: 'PUT', body, headers: { 'Content-Type': 'application/json' } })
            .then(x => x.json())
            .then((x) => {
                if (x.error) {
                    res.statusCode = 500;
                    res.json({ success: false, data: x });
                } else {
                    res.json({ success: true, data: x });
                }
            })
            .catch(e => {
                res.statusCode = 500;
                res.json({ success: false, message: e.message });
            });

    } catch (err) {
        res.statusCode = 500;
        res.json({ success: false, message: err.message });
    }
}