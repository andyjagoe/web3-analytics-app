import dynamoDb from '../../../../../lib/dynamo-db'

const tableName = process.env.WEB3ANALYTICS_DYNAMODB


export default async function handler(req, res) {
    const { userId, appSlug } = req.query

    if (req.method === 'GET') {

        const data = await dynamoDb.get({
            TableName: tableName,
            Key: {
                pk: `USER#${userId}`,
                sk: `APP#${appSlug}`        
            },
            ProjectionExpression: "#pk,#sk,#slug,#address,#createdAt,#starCount",
            ExpressionAttributeNames: {
                '#pk': 'pk',
                '#sk': 'sk',
                '#slug': 'slug',
                '#address': 'address',
                '#createdAt': 'createdAt',
                '#starCount': 'starCount'
            }
        })
                
        res.status(200).json(data)
        }        
          
    res.end()
}