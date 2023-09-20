import { LocalTrust } from '../../types'
import { getDB } from '../../utils';

export type LocaltrustStrategy = () => Promise<LocalTrust<string>>
const db = getDB()

type LocaltrustPrams = {
	followsWeight?: number,
	commentsWeight?: number,
	mirrorsWeight?: number,
	collectsWeight?: number,
	collectPriceWeight?: number
}

// TODO define a proper type instead of any
let ijfollows:any
let ijcomments:any
let ijmirrors:any
let ijcollects:any
let ijprices:any


/**
 * Generates basic localtrust by transforming all existing connections
*/

const getFollows = async () => {

	if (ijfollows) {
		return ijfollows
	} 

	const follows = await db('k3l_follows')
		.select('profile_id', 'to_profile_id')

	console.time('parsing follows')
	ijfollows = {}
	for (const { profileId, toProfileId } of follows) {
		ijfollows[profileId] = ijfollows[profileId] || []
		ijfollows[profileId][toProfileId] = 1
	}
	console.timeEnd('parsing follows')

	return ijfollows
}

const getCommentCounts = async () => {

	if (ijcomments) {
		return ijcomments
	}

	const comments = await db('k3l_comments')
		.select('profile_id', 'to_profile_id', db.raw('count(1) as count'))
		.groupBy('profile_id', 'to_profile_id')
	
	ijcomments = {}
	for (const { profileId, toProfileId, count } of comments) {
		ijcomments[profileId] = ijcomments[profileId] || {}
		ijcomments[profileId][toProfileId] = +count
	}

	console.log('length of comments', comments.length)
	return ijcomments
}

const getMirrorCounts = async () => {

	if (ijmirrors) {
		return ijmirrors
	}

	const mirrors = await db('k3l_mirrors')
		.select('profile_id', 'to_profile_id', db.raw('count(1) as count'))
		.groupBy('profile_id', 'to_profile_id')

		ijmirrors = {}
	for (const { profileId, toProfileId, count } of mirrors) {
		ijmirrors[profileId] = ijmirrors[profileId] || {}
		ijmirrors[profileId][toProfileId] = +count 
	}

	console.log('length of mirrors', mirrors.length)
	return ijmirrors
}

const getCollectCounts = async () => {

	if (ijcollects) {
		return ijcollects
	}

	const collects = await db('k3l_collect_nft')
		.select('profile_id', 'to_profile_id', db.raw('count(1) as count'))
		.groupBy('profile_id', 'to_profile_id')

	ijcollects = {}
	for (const { profileId, toProfileId, count } of collects) {
		ijcollects[profileId] = ijcollects[profileId] || {}
		ijcollects[profileId][toProfileId] = +count 
	}

	console.log('length of collects', collects.length)
	return ijcollects
}

const getCollectsPrice = async () => {

	if (ijprices) {
		return ijprices
	}

	const price_expr = 
	`sum(case when (matic_price is null or matic_price = 0) 
						then 1e-20 
						else matic_price
			end) as price`
	const collects = await db('k3l_collect_nft')
		.select('profile_id', 'to_profile_id', db.raw(price_expr))
		.groupBy('profile_id', 'to_profile_id')

	ijprices = {}
	for (const { profileId, toProfileId, price } of collects) {
		ijprices[profileId] = ijprices[profileId] || {}
		ijprices[profileId][toProfileId] = +price
	}

	return ijprices
}

const getLocaltrust = async ({followsWeight, commentsWeight, mirrorsWeight, collectsWeight}: LocaltrustPrams, withPrice = false): Promise<LocalTrust<string>> => {
	const follows = followsWeight ? await getFollows() : null
	const commentsMap = commentsWeight ? await getCommentCounts() : null
	const mirrorsMap = mirrorsWeight ? await getMirrorCounts() : null
	const collectsMap = collectsWeight ? (withPrice ? await getCollectsPrice() : await getCollectCounts()) : null

	let localtrust: LocalTrust<string> = []

	const from = new Set([
		...Object.keys(follows || {}),
		...Object.keys(commentsMap || {}),
		...Object.keys(mirrorsMap || {}),
		...Object.keys(collectsMap || {}),
	])

	for (const i of from) {
		const to = new Set([
			...Object.keys(follows && follows[i] || {}),
			...Object.keys(commentsMap && commentsMap[i] || {}),
			...Object.keys(mirrorsMap && mirrorsMap[i] || {}),
			...Object.keys(collectsMap && collectsMap[i] || {}),
		])

		for (const j of to) {
			if (i === j) continue
			const follow = follows && follows[i] && follows[i][j] || 0
			const commentsCount = commentsMap && commentsMap[i] && commentsMap[i][j] || 0
			const mirrorsCount = mirrorsMap && mirrorsMap[i] && mirrorsMap[i][j] || 0
			const collectsCount = collectsMap && collectsMap[i] && collectsMap[i][j] || 0
			
			localtrust.push({
				i,
				j,
				v: (followsWeight || 0) * follow +
				(commentsWeight || 0) * commentsCount +
				(mirrorsWeight || 0) * mirrorsCount + 
				(collectsWeight || 0) * collectsCount
			})
		}
	}

	console.log('Length of localtrust', localtrust.length)

	return localtrust
}

const existingConnections: LocaltrustStrategy = async (): Promise<LocalTrust<string>> => {
	return getLocaltrust({ followsWeight: 1 })
}

const f6c3m8enhancedConnections: LocaltrustStrategy = async (): Promise<LocalTrust<string>> => {
	return getLocaltrust({ followsWeight: 6, commentsWeight: 3, mirrorsWeight: 8 })
}

const f6c3m8col12enhancedConnections: LocaltrustStrategy = async (): Promise<LocalTrust<string>> => {
	return getLocaltrust({ followsWeight: 6, commentsWeight: 3, mirrorsWeight: 8, collectsWeight: 12 })
}

const f6c3m8col12Price: LocaltrustStrategy = async (): Promise<LocalTrust<string>> => {
	return getLocaltrust({ followsWeight: 6, commentsWeight: 3, mirrorsWeight: 8, collectsWeight: 12 }, true)
}

export const strategies: Record<string, LocaltrustStrategy> = {
	existingConnections,
	f6c3m8enhancedConnections,
	f6c3m8col12enhancedConnections,
	f6c3m8col12Price
}