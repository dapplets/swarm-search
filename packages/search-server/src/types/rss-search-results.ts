
export interface Attr {
    version: string;
    "xmlns:media": string;
    "xmlns:atom": string;
    "xmlns:creativeCommons": string;
}

export interface Attr2 {
    type: string;
    rel: string;
    href: string;
}

export interface AtomLink {
    _attr: Attr2;
}

export interface Attr3 {
    url: string;
    height: string;
    width: string;
}

export interface MediaThumbnail {
    _attr: Attr3;
}

export interface Attr4 {
    url: string;
    height: string;
    width: string;
    medium: string;
}

export interface MediaContent {
    _attr: Attr4;
}

export interface Item {
    title: string;
    link: string;
    guid: any[];
    pubDate: string;
    "media:title": any[];
    "media:keywords": any[];
    "media:rating": string;
    "media:category": any[];
    "media:credit": any[];
    "media:copyright": any[];
    "creativeCommons:license": string;
    "media:description": any[];
    "media:thumbnail": MediaThumbnail[];
    "media:content": MediaContent[];
    "description": string;
}

export interface Channel {
    title: string;
    link: string;
    description: string;
    language: string;
    copyright: string;
    pubDate: string;
    generator: string;
    docs: string;
    "atom:icon": string;
    "atom:link": AtomLink;
    item: Item[];
}

export interface Rss {
    _attr: Attr;
    channel: Channel[];
}

export interface RssSearchResults {
    rss: Rss[];
}