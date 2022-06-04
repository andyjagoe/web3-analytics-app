import dynamoDb from '../../../lib/dynamo-db'

const tableName = "next-auth"

export default async function handler(req, res) {
    const { userId } = req.query
            
          if (req.method === 'GET') {
            const data = await dynamoDb.get({
                TableName: tableName,
                Key: {
                    pk: `USER#${userId}`,
                    sk: `USER#${userId}`
                },
                ProjectionExpression: "image,#nameVal",
                ExpressionAttributeNames: {
                    '#nameVal': 'name'
                }
            })
        
            res.status(200).json(data)
          }

    res.end()
}