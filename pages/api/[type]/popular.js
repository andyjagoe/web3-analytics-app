import dynamoDb from '../../../lib/dynamo-db'

const tableName = process.env.WEB3ANALYTICS_DYNAMODB


export default async function handler(req, res) {    
    const { type } = req.query
    const formattedType = type.toUpperCase()

    if (req.method === 'GET') {
        const data = await dynamoDb.query({
            TableName: tableName,
            IndexName: 'GSI1',
            KeyConditionExpression: "GSI1PK = :GSI1PKVal",
            ExpressionAttributeValues: {
                ":GSI1PKVal" : `${formattedType}`,
            },
            ScanIndexForward: false
        })
    
        res.status(200).json(data)
    }

    res.end()
}