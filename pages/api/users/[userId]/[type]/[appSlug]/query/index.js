import { getSession } from "next-auth/react"
import { 
    AthenaClient, 
    StartQueryExecutionCommand,
} from "@aws-sdk/client-athena"

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
                const query = await client.send(command)
                res.status(200).json(query)
            } catch (error) {
                const { httpStatusCode } = error.$metadata
                console.log(error.$metadata)
                console.log(error)
                res.status(httpStatusCode)
                return res.end()
            }
        
          }        

    } else {
        // Not Signed in
        res.status(401)
    }
    res.end()
}