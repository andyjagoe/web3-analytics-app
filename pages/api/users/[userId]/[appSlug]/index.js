import { getSession } from "next-auth/react"
import dynamoDb from '../../../../../lib/dynamo-db'

const tableName = process.env.WEB3ANALYTICS_DYNAMODB


export default async function handler(req, res) {
    const session = await getSession({ req })
    const { userId, appSlug } = req.query

    if (session) {
        // Signed in

        if (req.method === 'GET') {

            const data = await dynamoDb.get({
                TableName: tableName,
                Key: {
                    pk: `USER#${userId}`,
                    sk: `APP#${appSlug}`        
                },
                ProjectionExpression: "#address,#createdAt,#starCount",
                ExpressionAttributeNames: {
                    '#address': 'address',
                    '#createdAt': 'createdAt',
                    '#starCount': 'starCount'
                }
            })
        
            res.status(200).json(data)
            }        
          
    } else {
        // Not Signed in
        res.status(401)
    }
    res.end()
}