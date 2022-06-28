import { getSession } from "next-auth/react"
import dynamoDb from '../../lib/dynamo-db'
import slug from "slug"

const tableName = process.env.WEB3ANALYTICS_DYNAMODB


export default async function handler(req, res) {
    const session = await getSession({ req })
    if (session) {
        // Signed in
        //console.log("Session", JSON.stringify(session, null, 2))

        if (req.method === 'PUT') {
            let mySlug = slug(req.body.name)
            const myDate = Date.now()

            const item = {
                pk: `USER#${session.user.id}`,
                sk: `DASHBOARD#${mySlug}`,
                name: req.body.name,
                type: "DASHBOARD",
                slug: mySlug,
                starCount: 0,
                createdAt: myDate,
                GSI1PK: "DASHBOARD",
                GSI1SK: 0,
                GSI2PK: `USER#${session.user.id}#DASHBOARD`,
            };

            try {
                await dynamoDb.put({
                    TableName: tableName,
                    Item: item,
                    ConditionExpression: "pk <> :pkVal AND sk <> :skVal",
                    ExpressionAttributeValues: {
                        ":pkVal" : `USER#${session.user.id}`,
                        ":skVal": `DASHBOARD#${req.body.sk}`
                    }
                })        
            } catch (error) {
                console.log(error)
                if (error.name === "ConditionalCheckFailedException") {
                    console.log("Dashboard name already in use")
                    res.status(400)
                    return res.end()
                }
                res.status(500)
                return res.end()
            }
        
            res.status(201).json(item)
          }

          
          if (req.method === 'GET') {
            const data = await dynamoDb.get({
                TableName: tableName,
                Key: {
                    pk: `USER#${session.user.id}`,
                    sk: `DASHBOARD#${req.query.sk}`
                }
            })
        
            res.status(200).json(data)
          }


    } else {
        // Not Signed in
        res.status(401)
    }
    res.end()
}