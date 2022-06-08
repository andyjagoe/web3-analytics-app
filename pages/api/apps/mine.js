import { getSession } from "next-auth/react"
import dynamoDb from '../../../lib/dynamo-db'

const tableName = process.env.WEB3ANALYTICS_DYNAMODB


export default async function handler(req, res) {    
    const session = await getSession({ req })

    if (session) {

        if (req.method === 'GET') {
            const data = await dynamoDb.query({
                TableName: tableName,
                IndexName: 'GSI2',
                KeyConditionExpression: "GSI2PK = :GSI2PKVal",
                ExpressionAttributeValues: {
                    ":GSI2PKVal" : `USER#${session.user.id}#APP`,
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