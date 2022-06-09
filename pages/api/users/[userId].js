import crypto from 'node:crypto'
import dynamoDb from '../../../lib/dynamo-db'

const tableName = process.env.NEXT_AUTH_DB


export default async function handler(req, res) {
    const { userId } = req.query
            
          if (req.method === 'GET') {
            const data = await dynamoDb.get({
                TableName: tableName,
                Key: {
                    pk: `USER#${userId}`,
                    sk: `USER#${userId}`
                },
                ProjectionExpression: "image,#nameVal,#email,#id",
                ExpressionAttributeNames: {
                    '#nameVal': 'name',
                    '#email': 'email',
                    '#id': 'id'
                }
            })

            // if user doesn't have an avatar, create one
            if (!("image" in data.Item)) {
                const email = `${data.Item.id}@web3analytics.network`
                let hash = crypto.createHash('md5').update(email).digest("hex")
                data.Item.image = `https://www.gravatar.com/avatar/${hash}?s=200&d=retro`
            }
            // remove email and id from response
            delete data.Item.email            
            delete data.Item.id            
        
            res.status(200).json(data)
          }

    res.end()
}