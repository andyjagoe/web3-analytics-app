import { getSession } from "next-auth/react"
import dynamoDb from '../../../lib/dynamo-db'

const tableName = "web3analytics"

export default async function handler(req, res) {    
    const session = await getSession({ req })

    if (session) {

        if (req.method === 'GET') {
            /*
            const data = await dynamoDb.query({
                TableName: tableName,
                KeyConditionExpression: "pk = :pkVal AND begins_with(#sk, :skVal)",
                ExpressionAttributeNames:{
                    "#sk": "sk",
                },
                ExpressionAttributeValues: {
                    ":pkVal" : `USER#${session.user.id}`,
                    ":skVal" : "APP#",
                },
                ScanIndexForward: false
            })
            */
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