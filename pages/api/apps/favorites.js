import { getSession } from "next-auth/react"
import dynamoDb from '../../../lib/dynamo-db'

const tableName = "web3analytics"

export default async function handler(req, res) {    
    const session = await getSession({ req })

    if (session) {

        if (req.method === 'GET') {

            // Get list of starred items
            const result = await dynamoDb.query({
                TableName: tableName,
                KeyConditionExpression: "pk = :pkVal AND begins_with(sk, :skVal)",
                ExpressionAttributeValues: {
                    ":pkVal" : `USER#${session.user.id}`,
                    ":skVal" : "STAR#APP#"
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
                        sk: `APP#${parts[3]}`,
                    }
                )
            }
            if (keys.length === 0) res.status(200).json({})

            var params = {
                RequestItems: {
                    web3analytics: {
                        Keys: keys.slice(0,100)
                    }
                }
            }

            const data = await dynamoDb.batchGet(params)
            
            res.status(200).json(data)
        }

    } else {
        // Not Signed in
        res.status(401)
    }
    res.end()
}