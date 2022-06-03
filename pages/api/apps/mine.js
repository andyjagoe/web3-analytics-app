import { getSession } from "next-auth/react"
import dynamoDb from '../../../lib/dynamo-db'

const tableName = "web3analytics"

export default async function handler(req, res) {    
    const session = await getSession({ req })

    if (session) {

        if (req.method === 'GET') {
            const data = await dynamoDb.query({
                TableName: tableName,
                KeyConditionExpression: "pk = :pkVal",
                ExpressionAttributeValues: {
                    ":pkVal" : `USER#${session.user.id}`,
                },
            })
        
            res.status(200).json(data)
        }

    } else {
        // Not Signed in
        res.status(401)
    }
    res.end()
}