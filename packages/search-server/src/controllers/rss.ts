import fs from 'fs';
import path from 'path';
import { query, Request, Response } from 'express';
import xml from 'xml';
import fetch from 'node-fetch';
import { EsSearchResults } from '../types/es-search-results';

type SearchParameters = {
    query: string;
    count: string;
    offset: string;
    type: string;
}

export function get(req: Request, res: Response) {
    let { q: query, count, offset, type } = req.query as { q: string, count: string, offset: string, type: string };

    if (!query) {
        res.json({ success: false, message: "q parameter (search query) is required" });
        return;
    }

    if (count === undefined || parseInt(count) <= 0) {
        res.json({ success: false, message: "count parameter is required" });
        return;
    }

    if (offset === undefined || parseInt(offset) < 0) {
        res.json({ success: false, message: "offset parameter is required" });
        return;
    }

    query = query.replace(/\+/gm, ' ');

    const url = process.env.ELASTICSEARCH_URL + `fs_index/_doc/_search`;
    const body = JSON.stringify({
        "query": (type) ? {
            "bool": {
                "filter": [
                    {
                        "query_string": {
                            "query": query,
                            "fuzziness": "AUTO",
                            "fields": [
                                "attachment.content",
                                "metadata.name",
                                "metadata.title",
                                "metadata.description"
                            ]
                        }
                    },
                    {
                        "match": {
                            "metadata.type": type
                        }
                    }
                ]
            }
        } : {
            "query_string": {
                "query": query,
                "fuzziness": "AUTO",
                "fields": [
                    "attachment.content",
                    "metadata.name",
                    "metadata.title",
                    "metadata.description"
                ]
            }
        },
        "_source": [
            "metadata"
        ],
        "from": offset,
        "size": count
    });

    fetch(url, { method: 'POST', body, headers: { 'Content-Type': 'application/json' } })
        .then(x => x.json())
        .then((x) => {
            if (x.error) {
                res.statusCode = 500;
                res.json({ success: false, data: x });
            } else {
                const rssSearchResults = convertEsToXml({ query, count, offset, type }, x);
                const xmlString = xml(rssSearchResults as any, { declaration: true });
                res.setHeader('Content-Type', 'text/xml');
                res.send(xmlString);
            }
        })
        .catch(e => {
            res.statusCode = 500;
            res.json({ success: false, message: e.message });
        });

}


function convertEsToXml(parameters: SearchParameters, obj: EsSearchResults): any {
    return [
        {
            "rss": [
                {
                    "_attr": {
                        "version": "2.0",
                        "xmlns:media": "http://search.yahoo.com/mrss/",
                        "xmlns:atom": "http://www.w3.org/2005/Atom",
                        "xmlns:creativeCommons": "http://backend.userland.com/creativeCommonsRssModule"
                    }
                },
                {
                    "channel": [
                        {
                            "title": "Swarm Search: " + parameters.query
                        },
                        {
                            "link": "/"
                        },
                        {
                            "description": "Swarm Search RSS for " + parameters.query
                        },
                        {
                            "language": "en-us"
                        },
                        {
                            "copyright": "Copyright 2021, dapplets.org"
                        },
                        {
                            "pubDate": new Date().toUTCString()
                        },
                        {
                            "generator": "dapplets.org"
                        },
                        {
                            "docs": "http://blogs.law.harvard.edu/tech/rss"
                        },
                        {
                            "atom:icon": "/favicon.png"
                        },
                        {
                            "atom:link": {
                                "_attr": {
                                    "type": "application/rss+xml",
                                    "rel": "self",
                                    "href": `/rss?q=${parameters.query}&count=${parameters.count}&offset=${parameters.offset}${(parameters.type) ? `&type=${parameters.type}` : ''}`
                                }
                            }
                        },
                        // ToDo: show only is data available
                        ...((obj.hits.total.value > parseInt(parameters.offset) + parseInt(parameters.count)) ? [
                            {
                                "atom:link": {
                                    "_attr": {
                                        "rel": "next",
                                        "href": `/rss?q=${parameters.query}&count=${parameters.count}&offset=${parseInt(parameters.offset) + parseInt(parameters.count)}${(parameters.type) ? `&type=${parameters.type}` : ''}`
                                    }
                                }
                            }
                        ] : []),
                        ...obj.hits.hits.map(x => ({
                            "item": [
                                ...((x._source.metadata.title) ? [{ "title": x._source.metadata.title }] : []),
                                ...((x._source.metadata.description) ? [{ "description": x._source.metadata.description }] : []),
                                ...((x._source.metadata.url) ? [{ "link": x._source.metadata.url }] : []),
                                ...((x._source.metadata.url) ? [{
                                    "guid": [
                                        {
                                            "_attr": {
                                                "isPermaLink": true
                                            }
                                        },
                                        x._source.metadata.url
                                    ]
                                }] : []),
                                ...((x._source.metadata.date) ? [{ "pubDate": x._source.metadata.date }] : []),
                                // ...((x._source.metadata.title) ? [{
                                //     "media:title": [
                                //         {
                                //             "_attr": {
                                //                 "type": "plain"
                                //             }
                                //         },
                                //         x._source.metadata.title
                                //     ]
                                // }] : []),
                                // {
                                //     "media:keywords": []
                                // },
                                // {
                                //     "media:rating": "nonadult"
                                // },
                                // {
                                //     "media:category": [
                                //         {
                                //             "_attr": {
                                //                 "label": "Other"
                                //             }
                                //         },
                                //         "resources/tutorials/other"
                                //     ]
                                // },
                                ...((x._source.metadata.channelName) ? [{
                                    "media:credit": [
                                        {
                                            "_attr": {
                                                "role": "author",
                                                "scheme": "urn:ebu"
                                            }
                                        },
                                        x._source.metadata.channelName
                                    ]
                                }] : []),
                                ...((x._source.metadata.channelIconUrl) ? [{
                                    "media:credit": [
                                        {
                                            "_attr": {
                                                "role": "author",
                                                "scheme": "urn:ebu"
                                            }
                                        },
                                        x._source.metadata.channelIconUrl
                                    ]
                                }] : []),
                                // {
                                //     "media:copyright": [
                                //         {
                                //             "_attr": {
                                //                 "url": "https://www.deviantart.com/kibbitzer"
                                //             }
                                //         },
                                //         "Copyright 2016-2021 Kibbitzer"
                                //     ]
                                // },
                                // {
                                //     "creativeCommons:license": "http://creativecommons.org/licenses/by-nc-nd/3.0/"
                                // },
                                ...((x._source.metadata.description) ? [{
                                    "media:description": [
                                        {
                                            "_attr": {
                                                "type": "html"
                                            }
                                        },
                                        x._source.metadata.description
                                    ]
                                }] : []),
                                ...((x._source.metadata.thumbnailUrl) ? [{
                                    "media:thumbnail": [
                                        {
                                            "_attr": {
                                                "url": x._source.metadata.thumbnailUrl,
                                                // "height": "140",
                                                // "width": "150"
                                            }
                                        }
                                    ]
                                }] : []),
                                // {
                                //     "media:thumbnail": [
                                //         {
                                //             "_attr": {
                                //                 "url": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/a6843f1a-bf5a-490a-8c5d-ce6f92811539/da7i85q-5dcd6b4d-7fb3-437b-a68c-1381d812e850.jpg/v1/fit/w_300,h_560,q_70,strp/cats_reference_sheet_2_by_kibbitzer_da7i85q-300w.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2E2ODQzZjFhLWJmNWEtNDkwYS04YzVkLWNlNmY5MjgxMTUzOVwvZGE3aTg1cS01ZGNkNmI0ZC03ZmIzLTQzN2ItYTY4Yy0xMzgxZDgxMmU4NTAuanBnIiwiaGVpZ2h0IjoiPD01NjAiLCJ3aWR0aCI6Ijw9NjAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLndhdGVybWFyayJdLCJ3bWsiOnsicGF0aCI6Ilwvd21cL2E2ODQzZjFhLWJmNWEtNDkwYS04YzVkLWNlNmY5MjgxMTUzOVwva2liYml0emVyLTQucG5nIiwib3BhY2l0eSI6OTUsInByb3BvcnRpb25zIjowLjQ1LCJncmF2aXR5IjoiY2VudGVyIn19.mCnzCqul0-86xdXLZ_So9R1itYQ3vfZA5H_JW4f632o",
                                //                 "height": "280",
                                //                 "width": "300"
                                //             }
                                //         }
                                //     ]
                                // },
                                // {
                                //     "media:thumbnail": [
                                //         {
                                //             "_attr": {
                                //                 "url": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/a6843f1a-bf5a-490a-8c5d-ce6f92811539/da7i85q-5dcd6b4d-7fb3-437b-a68c-1381d812e850.jpg/v1/fill/w_215,h_200,q_70,strp/cats_reference_sheet_2_by_kibbitzer_da7i85q-200h.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2E2ODQzZjFhLWJmNWEtNDkwYS04YzVkLWNlNmY5MjgxMTUzOVwvZGE3aTg1cS01ZGNkNmI0ZC03ZmIzLTQzN2ItYTY4Yy0xMzgxZDgxMmU4NTAuanBnIiwiaGVpZ2h0IjoiPD01NjAiLCJ3aWR0aCI6Ijw9NjAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLndhdGVybWFyayJdLCJ3bWsiOnsicGF0aCI6Ilwvd21cL2E2ODQzZjFhLWJmNWEtNDkwYS04YzVkLWNlNmY5MjgxMTUzOVwva2liYml0emVyLTQucG5nIiwib3BhY2l0eSI6OTUsInByb3BvcnRpb25zIjowLjQ1LCJncmF2aXR5IjoiY2VudGVyIn19.mCnzCqul0-86xdXLZ_So9R1itYQ3vfZA5H_JW4f632o",
                                //                 "height": "200",
                                //                 "width": "214"
                                //             }
                                //         }
                                //     ]
                                // },
                                // {
                                //     "media:content": [
                                //         {
                                //             "_attr": {
                                //                 "url": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/a6843f1a-bf5a-490a-8c5d-ce6f92811539/da7i85q-5dcd6b4d-7fb3-437b-a68c-1381d812e850.jpg/v1/fill/w_600,h_560,q_75,strp/cats_reference_sheet_2_by_kibbitzer_da7i85q-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2E2ODQzZjFhLWJmNWEtNDkwYS04YzVkLWNlNmY5MjgxMTUzOVwvZGE3aTg1cS01ZGNkNmI0ZC03ZmIzLTQzN2ItYTY4Yy0xMzgxZDgxMmU4NTAuanBnIiwiaGVpZ2h0IjoiPD01NjAiLCJ3aWR0aCI6Ijw9NjAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLndhdGVybWFyayJdLCJ3bWsiOnsicGF0aCI6Ilwvd21cL2E2ODQzZjFhLWJmNWEtNDkwYS04YzVkLWNlNmY5MjgxMTUzOVwva2liYml0emVyLTQucG5nIiwib3BhY2l0eSI6OTUsInByb3BvcnRpb25zIjowLjQ1LCJncmF2aXR5IjoiY2VudGVyIn19.mCnzCqul0-86xdXLZ_So9R1itYQ3vfZA5H_JW4f632o",
                                //                 "height": "560",
                                //                 "width": "600",
                                //                 "medium": "image"
                                //             }
                                //         }
                                //     ]
                                // }
                            ]
                        }))
                    ]
                }
            ]
        }
    ];
}