import { getSession } from "next-auth/react"
import dynamoDb from '../../../lib/dynamo-db'

const tableName = process.env.WEB3ANALYTICS_DYNAMODB


export default async function handler(req, res) {    
    const session = await getSession({ req })
    const { type } = req.query
    const formattedType = type.toUpperCase()

    if (session) {

        if (req.method === 'GET') {

            // Get list of starred items
            const result = await dynamoDb.query({
                TableName: tableName,
                KeyConditionExpression: "pk = :pkVal AND begins_with(sk, :skVal)",
                ExpressionAttributeValues: {
                    ":pkVal" : `USER#${session.user.id}`,
                    ":skVal" : `STAR#${formattedType}#`
                },
                ScanIndexForward: false
            })

            // Get items (that contain star counts) from user's list
            let keys = []
            for (const item of result.Items) {
                const parts = item.sk.split("#")
                keys.push(
                    {
                        pk: `USER#${parts[2]}`,
                        sk: `${formattedType}#${parts[3]}`,
                    }
                )
            }

            let data = {}
            if (keys.length > 0) {
                const params = {
                    RequestItems: {
                        [tableName]: {
                            Keys: keys.slice(0,100)
                        }
                    }
                }
                data = await dynamoDb.batchGet(params)                    
            }
            if (!data.Responses) data.Responses = []

            res.status(200).json(data)
        }

    } else {
        // Not Signed in
        res.status(401)
    }
    res.end()
}