import { getIds } from '../recommender/utils'
import { config } from '../recommender/config'
import LocaltrustGenerator from '../recommender/LocaltrustGenerator'
import Rankings from '../recommender/RankingsRecommender'
import Feed from '../recommender/FeedRecommender'

const main = async () => {
	const ids = await getIds()
	const localtrustGenerator = new LocaltrustGenerator()

	console.time("Generated localtrust")
	for (const ltStrategy of config.localtrustStrategies) {
		console.log(`Generating localtrust for ${ltStrategy}`)
		const localtrust = await localtrustGenerator.generateLocaltrust(ltStrategy)
		console.log(`Slice of localtrust: ${JSON.stringify(localtrust.slice(0,10))}`)
		await localtrustGenerator.saveLocaltrust(ltStrategy, localtrust)
		await localtrustGenerator.uploadLocaltrust(ltStrategy, localtrust, ids)
	}
	console.timeEnd("Generated localtrust")

	console.time("Generated rankings")
	for (const rkStrategy of config.rankingStrategies) {
		console.log(`Generating rankings for ${rkStrategy.name}`)
		const rankings = await Rankings.calculateByStrategy(ids, rkStrategy)
		console.log(`Slice of rankings: ${JSON.stringify(rankings.slice(0,10))}`)
		await Rankings.saveGlobaltrust(rkStrategy.name, rankings)
	}
	console.timeEnd("Generated rankings")

	console.time("Generated feed")
	for (const fStrategy of config.sqlFeedStrategies) {
		console.log(`Generating rankings for ${fStrategy.name}`)
		const feed = await Feed.calculateByStrategy(fStrategy.name, 5000)
		await Feed.saveFeed(fStrategy.feed, feed)
	}
	console.timeEnd("Generated feed")
}

main().then(() => {
	console.log("Done!")
	process.exit()
})
