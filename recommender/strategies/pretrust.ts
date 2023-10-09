import  path from 'path'
import { Pretrust } from '../../types'
import { config } from '../config'
import { getDB } from '../../utils';
import { readFile } from 'fs/promises';

export type PretrustStrategy = (pretrustFile?: string) => Promise<Pretrust<string>>

const db = getDB()


const pretrustCommunity = async(pretrustFile?: string) => {
	const data = await readFile(path.resolve(__dirname, pretrustFile!), 'utf-8')
	const json = JSON.parse(data);
	const profiles = json.data.items
	const pretrust: Pretrust<string> = []

	profiles.forEach(({ profileId }: { profileId: string }) => {
		pretrust.push({
			i: profileId,
			v: 1 / profiles.length
		})		
	})
	return pretrust
}

const pretrustCommunity1: PretrustStrategy = 
	async(pretrustFile?: string) => pretrustCommunity('../../pretrusts/community1.json')
const pretrustCommunity2: PretrustStrategy = 
	async(pretrustFile?: string) => pretrustCommunity('../../pretrusts/community2.json')
const pretrustCommunity3: PretrustStrategy = 
	async(pretrustFile?: string) => pretrustCommunity('../../pretrusts/community3.json')


const pretrustAllEqually: PretrustStrategy = async () => {
	return []
}

const pretrustFirstFifty: PretrustStrategy = async () => {
	const ids = await db('k3l_profiles').select('profile_id').orderBy('profile_id', 'asc').limit(50)
	const pretrust: Pretrust<string> = []

	ids.forEach(({ profileId }: { profileId: string }) => {
		pretrust.push({
			i: profileId,
			v: 1 / ids.length
		})
	})

	return pretrust
}

const pretrustOGs: PretrustStrategy = async () => {
	const ids = await db('k3l_profiles').select('profile_id').whereIn('handle', config.ogs)
	const pretrust: Pretrust<string> = []

	ids.forEach(({ profileId }: { profileId: string }) => {
		pretrust.push({
			i: profileId,
			v: 1 / ids.length
		})
	})

	return pretrust
}

export const strategies: Record<string, PretrustStrategy> = {
	pretrustOGs,
	pretrustFirstFifty,
	pretrustAllEqually,
	pretrustCommunity1,
	pretrustCommunity2,
	pretrustCommunity3
}
