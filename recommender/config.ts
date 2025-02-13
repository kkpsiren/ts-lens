export const config = {
  ogs: ["orbapp.lens", "nilesh.lens", "kipto.lens", "sankalpk.lens"],
  localtrustStrategies: [
    "existingConnections",
    "f6c3m8enhancedConnections",
    "f6c3m8col12enhancedConnections",
    "f6c3m8col12Price",
  ],
  pretrustStrategies: [
    "pretrustOGs",
    "pretrustFirstFifty",
    "pretrustAllEqually",
  ],
  contentStrategies: ["viralPosts"],
  rankingStrategies: [
    {
      name: "followship",
      pretrust: "pretrustOGs",
      localtrust: "existingConnections",
      alpha: 0.5,
    },
    {
      name: "engagement",
      pretrust: "pretrustOGs",
      localtrust: "f6c3m8enhancedConnections",
      alpha: 0.5,
    },
    {
      name: "influencer",
      pretrust: "pretrustOGs",
      localtrust: "f6c3m8col12enhancedConnections",
      alpha: 0.5,
    },
    {
      name: "creator",
      pretrust: "pretrustOGs",
      localtrust: "f6c3m8col12Price",
      alpha: 0.5,
    },
  ],
  sqlFeedStrategies: [
    {
      name: "popular",
      feed: "viralFeedWithEngagement",
      limit: 100,
    },
    {
      name: "recent",
      feed: "latestFeed",
      limit: 100,
    },
  ],
  algoFeedStrategies: [
    {
      name: "recommended",
      feed: "ml-xgb-followship",
      limit: 100,
    },
    {
      name: "crowdsourced",
      feed: "hubs-and-authorities",
      limit: 100,
    },
  ],
  personalFeedStrategies: [
    {
      name: "following",
      feed: "followingViralFeedWithEngagement",
      limit: 100,
    },
  ],
  personalization: {
    globaltrust: "followship",
    ltStrategyName: "existingConnections",
    limitGlobaltrust: 100,
  },
  content: {
    strategy: "viralPosts",
    limitUsers: 50,
  },
};
