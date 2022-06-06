import { getSession } from "next-auth/react"
import dynamoDb from '../../../../../lib/dynamo-db'

const tableName = "web3analytics"

export default async function handler(req, res) {
    const session = await getSession({ req })
    const { userId, appSlug } = req.query

    if (session) {
        // Signed in

        if (req.method === 'PUT') {
            const myDate = Date.now()

            const item = {
                pk: `USER#${session.user.id}`,
                sk: `STAR#APP#${userId}#${appSlug}`,
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
                        ":skVal": `STAR#APP#${userId}#${appSlug}`
                    }
                })

                await dynamoDb.update({
                    TableName: tableName,
                    Key: {
                        pk: `USER#${userId}`,
                        sk: `APP#${appSlug}`
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
                    sk: `STAR#APP#${userId}#${appSlug}`,
                }
            });

            await dynamoDb.update({
                TableName: tableName,
                Key: {
                    pk: `USER#${userId}`,
                    sk: `APP#${appSlug}`
                },
                UpdateExpression: "SET #starCount = #starCount - :decVal, GSI1SK = GSI1SK - :decVal",
                ExpressionAttributeNames: { "#starCount": "starCount" },
                ExpressionAttributeValues: { ":decVal": 1 }
            })
        
            res.status(204).json({});
          }
          
    } else {
        // Not Signed in
        res.status(401)
    }
    res.end()
}