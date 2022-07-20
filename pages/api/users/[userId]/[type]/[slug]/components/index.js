import { getSession } from "next-auth/react"
import dynamoDb from '../../../../../../../lib/dynamo-db'
import { v4 as uuidv4 } from 'uuid'


const tableName = process.env.WEB3ANALYTICS_DYNAMODB


export default async function handler(req, res) {
    const session = await getSession({ req })
    const { userId, type, slug } = req.query

    if (req.method === 'GET') {        
        // Get list of component items for this dashboard
        const result = await dynamoDb.query({
            TableName: tableName,
            KeyConditionExpression: "pk = :pkVal AND begins_with(sk, :skVal)",
            ExpressionAttributeValues: {
                ":pkVal" : `USER#${userId}#DASHBOARD#${slug}`,
                ":skVal" : `COMPONENT#`
            },
            ScanIndexForward: false
        })
        res.status(201).json(result)
        return res.end()
    }


    if (session) {
        // Signed in
        if (userId !== session.user.id) return res.status(401).end()
        if (type?.toLowerCase() !== 'dashboard') return res.status(400).end()

        if (req.method === 'PUT') {
            if (req.body.name === '') return res.status(400).end()
            if (req.body.format === '') return res.status(400).end()
            if (req.body.query === '') return res.status(400).end()

            const myDate = Date.now()
            const uid = uuidv4()            

            const item = {
                pk: `USER#${session.user.id}#DASHBOARD#${slug}`,
                sk: `COMPONENT#${uid}`,
                name: req.body.name,
                format: req.body.format,
                query: req.body.query,
                uid: uid,
                type: "COMPONENT",
                starCount: 0,
                createdAt: myDate,
                GSI1PK: "COMPONENT",
                GSI1SK: 0,
                GSI2PK: `USER#${session.user.id}#DASHBOARD#${slug}#COMPONENT`,
            };

            try {
                await dynamoDb.put({
                    TableName: tableName,
                    Item: item,
                    ConditionExpression: "pk <> :pkVal AND sk <> :skVal",
                    ExpressionAttributeValues: {
                        ":pkVal" : `USER#${session.user.id}}#DASHBOARD#${slug}`,
                        ":skVal": `COMPONENT#${uid}`
                    }
                })
                
                await dynamoDb.update({
                    TableName: tableName,
                    Key: {
                        pk: `USER#${userId}`,
                        sk: `DASHBOARD#${slug}`
                    },
                    UpdateExpression: "SET #layout = list_append(#layout, :newItems)",
                    ExpressionAttributeNames: { "#layout": "layout" },
                    ExpressionAttributeValues: { 
                        ":newItems": [{
                            i: uid,
                            x: 0,
                            y: 0,
                            w: 2,
                            h: 3,
                            minH: 3,
                            minW: 1
                        }]
                    }
                })
                
            } catch (error) {
                console.log(error)
                if (error.name === "ConditionalCheckFailedException") {
                    console.log("Component id already in use")
                    res.status(400)
                    return res.end()
                }
                res.status(500)
                return res.end()
            }
        
            res.status(201).json(item)
        }
                  
    } else {
        // Not Signed in
        res.status(401)
    }
    res.end()
}