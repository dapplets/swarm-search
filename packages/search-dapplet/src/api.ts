export class Api {
    async search() {
        return [{
            title: "Search result from Ethereum Swarm",
            views: "10M",
            date: "today",
            channel: "Ethereum Swarm",
            description: "We are injecting search results into YouTube and Google.",
            badges: [{
              label: 'AVAILABLE IN SWARM',
              color: '#ffc300'
            }]
        }];
    }
}