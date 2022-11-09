import {
    Typography,
} from '@mui/material'
import useOnChainApp from "../hooks/useOnChainApp.jsx"
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import js from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript'
import bash from 'react-syntax-highlighter/dist/cjs/languages/hljs/bash'
import agate from 'react-syntax-highlighter/dist/cjs/styles/hljs/agate'
import styles from '../styles/InstructionsDialog.module.css' assert { type: 'css' }

SyntaxHighlighter.registerLanguage('javascript', js)
SyntaxHighlighter.registerLanguage('bash', bash)


const InstructionsNPM = ({userId, appSlug}) => {
    const {myOnChainApp} = useOnChainApp(userId, appSlug)
        
    return (
        <>
        <SyntaxHighlighter language="bash" style={agate}>
          {`npm install analytics\nnpm install analytics-plugin-web3analytics`}
        </SyntaxHighlighter>
        <Typography variant="body1">
            Usage (see also&nbsp;      
            <a href="https://github.com/andyjagoe/web3-analytics-demo" className={styles.instructions}
            rel="noreferrer noopener" target="_blank" >example app</a> and&nbsp;
            <a href="https://getanalytics.io/" target="_blank" className={styles.instructions}
            rel="noreferrer noopener">instrumentation documentation</a>):
        </Typography>
        <SyntaxHighlighter language="javascript" style={agate}>
          {`import Analytics from 'analytics'
import web3Analytics from 'analytics-plugin-web3analytics'

/* Initialize analytics & load plugins */
const analytics = Analytics({
  app: 'awesome-app',
  plugins: [
    web3Analytics({
      appId: '${myOnChainApp? myOnChainApp.appAddress:'YOUR_WEB3ANALYTICS_APP_ID'}',
      jsonRpcUrl: 'https://eth-goerli.g.alchemy.com/v2/your_key_here'
    })
  ]
})`}
        </SyntaxHighlighter>
        </>
    )
}
    
export default InstructionsNPM