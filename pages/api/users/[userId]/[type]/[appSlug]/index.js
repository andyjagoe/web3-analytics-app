import dynamoDb from '../../../../../../lib/dynamo-db'

const tableName = process.env.WEB3ANALYTICS_DYNAMODB


export default async function handler(req, res) {
    const { userId, type, appSlug } = req.query
    const formattedType = type.toUpperCase()

    if (req.method === 'GET') {
        let projectionExpression = ""
        let expressionAttributeNames = {}

        if (formattedType === "APP") {
            projectionExpression = "#pk,#sk,#slug,#type,#address,#createdAt,#starCount"
            expressionAttributeNames = {
                '#pk': 'pk',
                '#sk': 'sk',
                '#slug': 'slug',
                '#type': 'type',
                '#address': 'address',
                '#createdAt': 'createdAt',
                '#starCount': 'starCount'
            }
        } else {
            projectionExpression = "#pk,#sk,#name,#slug,#type,#createdAt,#starCount"
            expressionAttributeNames = {
                '#pk': 'pk',
                '#sk': 'sk',
                '#name': 'name',
                '#slug': 'slug',
                '#type': 'type',
                '#createdAt': 'createdAt',
                '#starCount': 'starCount'
            }
        }

        const data = await dynamoDb.get({
            TableName: tableName,
            Key: {
                pk: `USER#${userId}`,
                sk: `${formattedType}#${appSlug}`        
            },
            ProjectionExpression: projectionExpression,
            ExpressionAttributeNames: expressionAttributeNames
        })
                
        res.status(200).json(data)
        }        
          
    res.end()
}