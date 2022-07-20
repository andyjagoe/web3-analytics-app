import { getSession } from "next-auth/react"
import dynamoDb from '../../../../../../lib/dynamo-db'

const tableName = process.env.WEB3ANALYTICS_DYNAMODB


export default async function handler(req, res) {
    const { userId, type, slug } = req.query
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
        } else if (formattedType === "QUERY") {
            projectionExpression = "#pk,#sk,#slug,#name,#query,#status,#type,#address,#createdAt,#starCount"
            expressionAttributeNames = {
                '#pk': 'pk',
                '#sk': 'sk',
                '#slug': 'slug',
                '#name': 'name',
                '#type': 'type',
                '#query': 'query',
                '#status': 'status',
                '#address': 'address',
                '#createdAt': 'createdAt',
                '#starCount': 'starCount'
            }
        } else if (formattedType === "DASHBOARD") {
            projectionExpression = "#pk,#sk,#name,#layout,#slug,#type,#createdAt,#starCount"
            expressionAttributeNames = {
                '#pk': 'pk',
                '#sk': 'sk',
                '#name': 'name',
                '#layout': 'layout',
                '#slug': 'slug',
                '#type': 'type',
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
                sk: `${formattedType}#${slug}`        
            },
            ProjectionExpression: projectionExpression,
            ExpressionAttributeNames: expressionAttributeNames
        })
                        
        res.status(200).json(data)
        return res.end()
        }        


        const session = await getSession({ req })
        if (session) {
            // Signed in
            if (userId !== session.user.id) return res.status(401).end()
            if (type?.toLowerCase() !== 'dashboard') return res.status(400).end()
    
            if (req.method === 'POST') {
                try {
                    const result = await dynamoDb.update({
                        TableName: tableName,
                        Key: {
                            pk: `USER#${session.user.id}`,
                            sk: `DASHBOARD#${slug}`
                        },
                        UpdateExpression: 'set #layout = :newlayout',
                        ExpressionAttributeNames: {'#layout': 'layout'},
                        ExpressionAttributeValues: { ':newlayout': req.body.layout }
                    })

                    res.status(201).json(result)    
                } catch (error) {
                    console.log(error)
                    res.status(500)
                    return res.end()
                }            
            }            
              
        } else {
            // Not Signed in
            res.status(401)
        }
          
    res.end()
}