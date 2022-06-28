import { getSession } from "next-auth/react"
import dynamoDb from '../../../../../../lib/dynamo-db'

const tableName = process.env.WEB3ANALYTICS_DYNAMODB


export default async function handler(req, res) {
    const session = await getSession({ req })
    const { userId, type, appSlug } = req.query
    const formattedType = type.toUpperCase()

    if (session) {
        // Signed in

        if (req.method === 'PUT') {
            const myDate = Date.now()

            const item = {
                pk: `USER#${session.user.id}`,
                sk: `STAR#${formattedType}#${userId}#${appSlug}`,
                type: "STAR",
                createdAt: myDate,
            };

            try {
                await dynamoDb.put({
                    TableName: tableName,
                    Item: item,
                    ConditionExpression: "pk <> :pkVal AND sk <> :skVal",
                    ExpressionAttributeValues: {
                        ":pkVal" : `USER#${session.user.id}`,
                        ":skVal": `STAR#${formattedType}#${userId}#${appSlug}`
                    }
                })

                await dynamoDb.update({
                    TableName: tableName,
                    Key: {
                        pk: `USER#${userId}`,
                        sk: `${formattedType}#${appSlug}`
                    },
                    UpdateExpression: "SET #starCount = #starCount + :incVal, GSI1SK = GSI1SK + :incVal",
                    ExpressionAttributeNames: { "#starCount": "starCount" },
                    ExpressionAttributeValues: { ":incVal": 1 }
                })
    
            } catch (error) {
                console.log(error)
                if (error.name === "ConditionalCheckFailedException") {
                    //User has already starred this item
                    return res.status(400).end()
                }
                return res.status(500).end()
            }
        
            res.status(201).json(item)
          }
        
          if (req.method === 'DELETE') {
            await dynamoDb.delete({
                TableName: tableName,
                Key: {
                    pk: `USER#${session.user.id}`,
                    sk: `STAR#${formattedType}#${userId}#${appSlug}`,
                }
            });

            await dynamoDb.update({
                TableName: tableName,
                Key: {
                    pk: `USER#${userId}`,
                    sk: `${formattedType}#${appSlug}`
                },
                UpdateExpression: "SET #starCount = #starCount - :decVal, GSI1SK = GSI1SK - :decVal",
                ExpressionAttributeNames: { "#starCount": "starCount" },
                ExpressionAttributeValues: { ":decVal": 1 }
            })
        
            res.status(204);
          }
          
    } else {
        // Not Signed in
        res.status(401)
    }
    res.end()
}