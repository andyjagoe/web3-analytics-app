import { getSession } from "next-auth/react"
import dynamoDb from '../../lib/dynamo-db'
import slug from "slug"

const tableName = "web3analytics"

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
                sk: `APP#${mySlug}`,
                type: "APP",
                slug: mySlug,
                address: req.body.sk,
                starCount: 0,
                createdAt: myDate,
                GSI1PK: "APP",
                GSI1SK: 0
            };

            try {
                await dynamoDb.put({
                    TableName: tableName,
                    Item: item,
                    ConditionExpression: "pk <> :pkVal AND sk <> :skVal",
                    ExpressionAttributeValues: {
                        ":pkVal" : `USER#${session.user.id}`,
                        ":skVal": `APP#${req.body.sk}`
                    }
                })        
            } catch (error) {
                console.log(error)
                if (error.name === "ConditionalCheckFailedException") {
                    //retry with slug guaranteed to be unique
                    mySlug = `${mySlug}-${myDate}`
                    item.sk = `APP#${mySlug}`
                    item.slug = mySlug
                    await dynamoDb.put({
                        TableName: tableName,
                        Item: item,
                        ConditionExpression: "pk <> :pkVal AND sk <>  :skVal",
                        ExpressionAttributeValues: {
                            ":pkVal" : `USER#${session.user.id}`,
                            ":skVal": `APP#${req.body.sk}`
                        }
                    })    
                }
            }
        
            res.status(201).json(item)
          }

          
          if (req.method === 'GET') {
            const data = await dynamoDb.get({
                TableName: tableName,
                Key: {
                    pk: `USER#${session.user.id}`,
                    sk: `APP#${req.query.sk}`
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