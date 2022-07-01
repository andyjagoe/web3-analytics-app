import { getSession } from "next-auth/react"
import { AthenaClient, GetQueryResultsCommand } from "@aws-sdk/client-athena"
import { S3Client, CopyObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"


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
        const { queryId, userId, type, appSlug } = req.query
        if (userId !== session.user.id) return res.status(401).end()
        if (type !== 'query') return res.status(400).end()

        if (req.method === 'GET') {
            let query
            const params = {
                MaxResults: 5,
                QueryExecutionId: queryId
            }
            const command = new GetQueryResultsCommand(params)

            try {
                query = await client.send(command)
            } catch (error) {
                const { httpStatusCode } = error.$metadata
                console.log(error.$metadata)
                console.log(error)
                res.status(httpStatusCode)
                return res.end()
            }        

            try {
                //TODO: update dyanmodb with new results pointer

                // copy csv results to new bucket
                const s3params = {
                    Bucket: 'web3analytics-query-results',
                    Key: `users/${userId}/query/${appSlug}.csv`,
                    CopySource: `web3analytics-athena-results/${queryId}.csv`
                };
                const s3Command = new CopyObjectCommand(s3params)
                const s3Result = await s3Client.send(s3Command)
    
                // generate url for user to access csv file
                const getObjectParams = {
                    Bucket: 'web3analytics-query-results',
                    Key: `users/${userId}/query/${appSlug}.csv`
                }
                const objCommand = new GetObjectCommand(getObjectParams)
                const url = await getSignedUrl(s3Client, objCommand, { expiresIn: 3600 })

                query.signedUrl = url

            } catch (error) {
                console.log(error.$metadata)
                console.log(error)
                res.status(500)
                return res.end()
            } 

            res.status(200).json(query)
        }     

    } else {
        // Not Signed in
        res.status(401)
    }
    res.end()
}