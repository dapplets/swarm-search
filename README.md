# Swarm Search

The set of modules augmenting Google and YouTube search pages with data from OpenSearch-compatible engines.

## Demo

### Google Search

[![Watch the video](https://github.com/dapplets/swarm-search/raw/master/docs/demo-google-search-preview.png)](https://github.com/dapplets/swarm-search/raw/master/docs/demo-google-search.mp4)

### YouTube Search

[![Watch the video](https://github.com/dapplets/swarm-search/raw/master/docs/demo-youtube-search-preview.png)](https://github.com/dapplets/swarm-search/raw/master/docs/demo-youtube-search.mp4)

### Swarm Gateway

[![Watch the video](https://github.com/dapplets/swarm-search/raw/master/docs/demo-gateway-preview.png)](https://github.com/dapplets/swarm-search/raw/master/docs/demo-gateway.mp4)

### Media Downloader

[![Watch the video](https://github.com/dapplets/swarm-search/raw/master/docs/demo-media-downloader-preview.png)](https://github.com/dapplets/swarm-search/raw/master/docs/demo-media-downloader.mp4)

### Change Search Engine

Two search engines were verified at the development:

DevianArt's backend containing a huge collection of media content.

```
https://backend.deviantart.com/rss.xml?q={searchTerms}&offset={startIndex}&limit={count}
```

Swarm Search server written as a mock of non-developed yet search engine which allows to add files uploaded to Swarm via dapplets working on Swarm Gateway and Media Downloader.

```
https://swarm-search-server.herokuapp.com/rss?q={searchTerms}&count={count}&offset={startIndex}&type={type?}
```

Any [OpenSearch-compatible](https://github.com/dewitt/opensearch/blob/master/opensearch-1-1-draft-6.md) search engine can be specified in the dapplet's settings. 

The instruction about how to change a search engine in the dapplet's settings is in following video.

[![Watch the video](https://github.com/dapplets/swarm-search/raw/master/docs/demo-change-search-engine-preview.png)](https://github.com/dapplets/swarm-search/raw/master/docs/demo-change-search-engine.mp4)

## Project Architecture

![Communication diagram](https://github.com/dapplets/swarm-search/raw/master/docs/communication.png)

## Getting Started

This project is designed as monorepo, so NPM Workspaces feature is required to install dependencies.

```
npm install
```

To start the development server use command:

```
npm start
```