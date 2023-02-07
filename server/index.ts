import express, { Request, Response } from 'express'
import Recommender from '../recommender/index'
import { getIdFromQueryParams } from './utils'

const app = express()
const PORT = 8080

export default (recommender: Recommender) => {
	app.get('/suggest', async (req: Request, res: Response) => {
		try {
			const id = await getIdFromQueryParams(req.query)
			console.log('Recommeding for id: ', id)

			const handles = await recommender.recommend(id, 50)

			res.send(handles)
		}
		catch (e: unknown) {
			if (e instanceof Error) {
				console.log(`[SERVER] ${e.message} for input:`, req.query)
				return res.status(400).send(e.message) //TODO: Parameterize HTTP codes
			}
		}
	})

	app.listen(PORT, async () => {
		await recommender.load()

		console.log(`Magic is happening on port: ${PORT}`)
	})
}