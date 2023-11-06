export const config = {
  ogs: ["orbapp.lens", "nilesh.lens", "kipto.lens", "sankalpk.lens"],
  localtrustStrategies: [
    "existingConnectionsTimed",
    "f1c8m3enhancedConnectionsTimed",
    "f1c8m3col12enhancedConnectionsTimed",
    "f1c8m3col12PriceTimed",
  ],
  pretrustStrategies: [
    "pretrustCommunity1",
    "pretrustCommunity2",
    "pretrustCommunity3",
    "pretrustOGs",
    "pretrustFirstFifty",
    "pretrustAllEqually",
  ],
  contentStrategies: ["viralPosts"],
  rankingStrategies: [
    {
      name: "photoArtCreator",
      pretrust: "pretrustCommunity1",
      localtrust: "f1c8m3col12PriceTimed",
      alpha: 0.5,
    },
    {
      name: "defiCreator",
      pretrust: "pretrustCommunity2",
      localtrust: "f1c8m3col12PriceTimed",
      alpha: 0.5,
    },
    {
      name: "animeCreator",
      pretrust: "pretrustCommunity3",
      localtrust: "f1c8m3col12PriceTimed",
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
