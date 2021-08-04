
export class Api {

    async search() {
        await new Promise(r => setTimeout(r, 300));
        return [{
            title: "Search result from Ethereum Swarm",
            views: "10M",
            date: "today",
            channel: "Ethereum Swarm",
            description: "We are injecting search results into YouTube and Google.",
            badges: [{
              label: 'SWARM',
              color: '#ffc300'
            }]
        }, {
            title: "Hidden video from Darknet",
            views: "1M",
            date: "1 month ago",
            channel: "Ethereum Swarm",
            description: "We are injecting search results into YouTube and Google.",
            badges: [{
              label: 'SWARM',
              color: '#ffc300'
            }]
        }];
    }
}