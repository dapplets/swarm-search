export interface Shards {
    total: number;
    successful: number;
    skipped: number;
    failed: number;
}

export interface Total {
    value: number;
    relation: string;
}

export interface Metadata {
    reference: string;
    channelIconUrl: string;
    size: number;
    name: string;
    description: string;
    channelName: string;
    title: string;
    type: string;
    url: string;
    thumbnailUrl: string;
    date: string;
}

export interface Source {
    metadata: Metadata;
}

export interface Hit {
    _index: string;
    _type: string;
    _id: string;
    _score: number;
    _ignored: string[];
    _source: Source;
}

export interface Hits {
    total: Total;
    max_score: number;
    hits: Hit[];
}

export interface EsSearchResults {
    took: number;
    timed_out: boolean;
    _shards: Shards;
    hits: Hits;
}