import { getSession } from "next-auth/react"
import dynamoDb from '../../lib/dynamo-db'

const tableName = process.env.WEB3ANALYTICS_DYNAMODB


export default async function handler(req, res) {
    const session = await getSession({ req })

    if (session) {
        // Signed in

        if (req.method === 'GET') {
            const type = req.query.type
            let skVal
            switch(type) {
                case "APP":
                    skVal = "STAR#APP#"
                    break
                default:
                    skVal = "STAR#"
            }

            const data = await dynamoDb.query({
                TableName: tableName,
                KeyConditionExpression: "pk = :pkVal AND begins_with(#sk, :skVal)",
                ExpressionAttributeNames:{
                    "#sk": "sk",
                },
                ExpressionAttributeValues: {
                    ":pkVal" : `USER#${session.user.id}`,
                    ":skVal" : skVal
                },
                ScanIndexForward: false
            })
        
            res.status(200).json(data)
        }
          
    } else {
        // Not Signed in
        res.status(401)
    }
    res.end()
}