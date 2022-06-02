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

            const slugItem = {
                pk: `USER#${session.user.id}`,
                sk: `SLUG#${mySlug}`,
                type: "SLUG",
                slug: mySlug,
                address: req.body.sk,
                createdAt: myDate,
            };

            try {
                await dynamoDb.put({
                    TableName: tableName,
                    Item: slugItem,
                    ConditionExpression: "pk <> :pkVal AND sk <>  :skVal",
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
                    slugItem.sk = `SLUG#${mySlug}`
                    slugItem.slug = mySlug
                    await dynamoDb.put({
                        TableName: tableName,
                        Item: slugItem,
                        ConditionExpression: "pk <> :pkVal AND sk <>  :skVal",
                        ExpressionAttributeValues: {
                            ":pkVal" : `USER#${session.user.id}`,
                            ":skVal": `APP#${req.body.sk}`
                        }
                    })    
                }
            }

            const item = {
              pk: `USER#${session.user.id}`,
              sk: `APP#${req.body.sk}`,
              type: "APP",
              slug: mySlug,
              address: req.body.sk,
              createdAt: myDate,
            };
        
            await dynamoDb.put({
                TableName: tableName,
                Item: item,
                ConditionExpression: "pk <> :pkVal AND sk <>  :skVal",
                ExpressionAttributeValues: {
                    ":pkVal" : `USER#${session.user.id}`,
                    ":skVal": `APP#${req.body.sk}`
                }
            })    
        
            res.status(201).json(item)
          }
        
          if (req.method === 'GET') {
            const { Item } = await dynamoDb.get({
                TableName: tableName,
                Key: {
                    pk: `USER#${session.user.id}`,
                    sk: `APP#${req.query.sk}`
                }
            })
        
            res.status(200).json(Item)
          }
        
          /*
          if (req.method === 'POST') {
            const { Attributes } = await dynamoDb.update({
                TableName: tableName,
                Key: {
                    pk: req.query.pk,
                    sk: req.query.sk
                },
                UpdateExpression: 'SET content = :content',
                ExpressionAttributeValues: {
                    ':content': req.body.content || null
                },
                ReturnValues: 'ALL_NEW'
            });
        
            res.status(200).json(Attributes);
          }
          */
        
          /*
          if (req.method === 'DELETE') {
            await dynamoDb.delete({
                TableName: tableName,
                Key: {
                    pk: req.query.pk,
                    sk: req.query.sk
                }
            });
        
            res.status(204).json({});
          }
          */
    } else {
        // Not Signed in
        res.status(401)
    }
    res.end()
}