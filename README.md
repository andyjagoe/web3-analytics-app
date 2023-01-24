# Web3 Analytics Dashboard Builder and Main User Interface

This project is a [Next.js](https://nextjs.org/) app bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). It serves as the primary user interface for Web3 Analytics and allows users to register apps, create analytics queries, and build dashboards.

Documentation for Web3 Analytics is available [here](https://web3-analytics.gitbook.io/product-docs/).

## Setup

First, use these [4 cloudformation YAML files](https://github.com/andyjagoe/web3-analytics-app/tree/main/schema) to set up Dynamodb.

Next, create a `.env.local` file in the root directory and configure the below environment variables. You will need to set up and get the correct API keys for the relevant service as well (e.g. AWS SES, AWS Athena, Maxmind, etc).

* `ATHENA_AWS_ACCESS_KEY_ID`: AWS access key with permission to use Athena
* `ATHENA_AWS_SECRET_ACCESS_KEY`: AWS secret for the above access key
* `ATHENA_AWS_REGION`: region name for AWS Athena
* `WEB3ANALYTICS_DYNAMODB`: name of dynamodb database used for Web3 Analytics data
* `NEXT_AUTH_DB`: name of dynamodb database used for Next Auth data
* `NEXT_AUTH_AWS_ACCESS_KEY`: AWS access key with permission to use dynamodb
* `NEXT_AUTH_AWS_SECRET_KEY`: AWS secret for the above access key
* `NEXT_AUTH_AWS_REGION`: region name for Dynamodb
* `EMAIL_SERVER_USER`: smtp username for AWS SES email user
* `EMAIL_SERVER_PASSWORD`: smtp password for AWS SES email user
* `EMAIL_SERVER_HOST`: hostname for AWS SES smtp server
* `EMAIL_SERVER_PORT`: port number for AWS SES smtp server
* `EMAIL_FROM`: email address to send email from
* `GITHUB_ID`: Github ID used for oAuth
* `GITHUB_SECRET`: Github secret used for oAuth
* `DISCORD_ID`: Discord ID used for oAuth
* `DISCORD_SECRET`: Discord secret used for oAuth
* `NEXTAUTH_SECRET`: as specified in [Next Auth documentation](https://next-auth.js.org/deployment)
* `NEXTAUTH_URL`: as specified in [Next Auth documentation](https://next-auth.js.org/deployment)
* `NEXT_PUBLIC_ALCHEMY_ID`: Alchemy ID as found in your Alchemy Console
* `NEXT_PUBLIC_NODE_URL`: Your json RPC Node URL
* `NEXT_PUBLIC_WEB3ANALYTICS`: Address of the deployed Web3 Analytics smart contract to use
* `NEXT_PUBLIC_CHAINS`: JSON array of public chains to allow as documented in [wagmi](https://wagmi.sh/react/chains), e.g.: ["hardhat", "goerli"]
* `NEXT_PUBLIC_CURRENCY`: Currency to display for credits, e.g. `ETH` or `MATIC`
* `MAXMIND_KEY`: [Maxmind key](https://support.maxmind.com/hc/en-us/articles/4407111582235-Generate-a-License-Key) required to use the geo lookup service. 


## Building

To build the project, run:

```shell
npm run build
# or
yarn build
```
Note that the build process downloads the necessary Maxmind geo databases and so `MAXMIND_KEY` must be set for the build process to run successfully.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Then, open [http://localhost:3000](http://localhost:3000) with your browser to use the app.
