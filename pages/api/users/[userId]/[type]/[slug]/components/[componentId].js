import { getSession } from "next-auth/react"
import dynamoDb from '../../../../../../../lib/dynamo-db'


const tableName = process.env.WEB3ANALYTICS_DYNAMODB


export default async function handler(req, res) {
    const session = await getSession({ req })
    const { userId, type, slug, componentId } = req.query


    if (session) {
        // Signed in
        if (userId !== session.user.id) return res.status(401).end()
        if (type?.toLowerCase() !== 'dashboard') return res.status(400).end()
          
        if (req.method === 'DELETE') {
            await dynamoDb.delete({
                TableName: tableName,
                Key: {
                    pk: `USER#${session.user.id}#DASHBOARD#${slug}`,
                    sk: `COMPONENT#${componentId}`,    
                }
            })

            res.status(204)
        }


    } else {
        // Not Signed in
        res.status(401)
    }
    res.end()
}