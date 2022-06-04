import dynamoDb from '../../../lib/dynamo-db'

const tableName = "web3analytics"

export default async function handler(req, res) {    

    if (req.method === 'GET') {
        const data = await dynamoDb.query({
            TableName: tableName,
            IndexName: 'GSI1',
            KeyConditionExpression: "GSI1PK = :GSI1PKVal",
            ExpressionAttributeValues: {
                ":GSI1PKVal" : "APP",
            },
            ScanIndexForward: false
        })
    
        res.status(200).json(data)
    }

    res.end()
}