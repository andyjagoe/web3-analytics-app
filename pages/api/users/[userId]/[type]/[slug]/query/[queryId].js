import { getSession } from "next-auth/react"
import dynamoDb from '../../../../../../../lib/dynamo-db'
import { AthenaClient, GetQueryExecutionCommand } from "@aws-sdk/client-athena"
import { S3Client, CopyObjectCommand } from "@aws-sdk/client-s3"

const tableName = process.env.WEB3ANALYTICS_DYNAMODB

const config = {
    credentials: {
      accessKeyId: process.env.ATHENA_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.ATHENA_AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.ATHENA_AWS_REGION
}
const client = new AthenaClient(config)
const s3Client = new S3Client(config)


export default async function handler(req, res) {
    const session = await getSession({ req })    
    if (session) {
        // Signed in
        const { queryId, userId, type, slug } = req.query
        if (userId !== session.user.id) return res.status(401).end()
        if (type?.toLowerCase() !== 'query') return res.status(400).end()

        if (req.method === 'GET') {
            const params = {
                QueryExecutionId: queryId
            }
            const command = new GetQueryExecutionCommand(params)

            try {
                // check query execution
                const query = await client.send(command)

                // format date objects so we can store in dynamodb
                const status = query?.QueryExecution?.Status
                status.CompletionDateTime = status?.CompletionDateTime?.toISOString()
                status.SubmissionDateTime = status?.SubmissionDateTime?.toISOString()

                // update dyanmodb with new status
                await dynamoDb.update({
                    TableName: tableName,
                    Key: {
                        pk: `USER#${session.user.id}`,
                        sk: `QUERY#${slug}`
                    },
                    UpdateExpression: 'set #status = :newstatus',
                    ExpressionAttributeNames: {'#status': 'status'},
                    ExpressionAttributeValues: { 
                        ':newstatus': status 
                    }
                })    

                // if state isn't succeeded, stop here
                if (query?.QueryExecution?.Status?.State !== 'SUCCEEDED') {
                    res.status(200).json(query)
                    return res.end()
                }

                // copy csv to permanent bucket
                const s3params = {
                    Bucket: 'web3analytics-query-results',
                    Key: `users/${userId}/query/${slug}.csv`,
                    CopySource: `web3analytics-athena-results/${queryId}.csv`
                };
                const s3Command = new CopyObjectCommand(s3params)
                await s3Client.send(s3Command)

                res.status(200).json(query)

            } catch (error) {
                console.log(error.$metadata)
                console.log(error)
                return res.status(500).end()
            }        
        }     

    } else {
        // Not Signed in
        res.status(401)
    }
    res.end()
}