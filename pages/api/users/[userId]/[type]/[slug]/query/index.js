import { getSession } from "next-auth/react"
import dynamoDb from '../../../../../../../lib/dynamo-db'
import { 
    AthenaClient, 
    StartQueryExecutionCommand,
} from "@aws-sdk/client-athena"

const tableName = process.env.WEB3ANALYTICS_DYNAMODB

const config = {
    credentials: {
      accessKeyId: process.env.ATHENA_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.ATHENA_AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.ATHENA_AWS_REGION
}
const client = new AthenaClient(config);




export default async function handler(req, res) {
    const session = await getSession({ req })
    if (session) {
        // Signed in
        const { userId, type, slug } = req.query
        if (userId !== session.user.id) return res.status(401).end()
        if (type?.toLowerCase() !== 'query') return res.status(400).end()

        if (req.method === 'PUT') {
            const params = {
                QueryString: req.body.sql,
                QueryExecutionContext: { 
                    Catalog: "AwsDataCatalog",
                    Database: "web3analytics"
                },
                WorkGroup: "web3analytics"
            };
            const command = new StartQueryExecutionCommand(params)            

            try {
                // send query for execution
                const query = await client.send(command)
                // update database with new query
                await dynamoDb.update({
                    TableName: tableName,
                    Key: {
                        pk: `USER#${session.user.id}`,
                        sk: `QUERY#${slug}`
                    },
                    UpdateExpression: 'set #query = :newquery',
                    ExpressionAttributeNames: {'#query': 'query'},
                    ExpressionAttributeValues: { ':newquery': req.body.sql }
                })    
                res.status(200).json(query)
            } catch (error) {
                console.log(error.$metadata)
                console.log(error)
                const { httpStatusCode } = error.$metadata
                res.status(httpStatusCode).send(error.message)
                return res.end()
            }
        }        

    } else {
        // Not Signed in
        res.status(401)
    }
    res.end()
}