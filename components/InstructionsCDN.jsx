import {
    Typography,
} from '@mui/material'
import useOnChainApp from "../hooks/useOnChainApp.jsx"
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import js from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript'
import agate from 'react-syntax-highlighter/dist/cjs/styles/hljs/agate'
import styles from '../styles/InstructionsDialog.module.css' assert { type: 'css' }

SyntaxHighlighter.registerLanguage('javascript', js)

const InstructionsCDN = ({userId, appSlug}) => {
    const {myOnChainApp} = useOnChainApp(userId, appSlug)
        
    return (
        <>
        <Typography variant="body1">
            Usage in plain HTML (see also&nbsp;      
            <a href="https://github.com/andyjagoe/web3analytics-test-html" className={styles.instructions}
            rel="noreferrer noopener" target="_blank" >example app</a> and&nbsp;
            <a href="https://getanalytics.io/" target="_blank" className={styles.instructions}
            rel="noreferrer noopener">instrumentation documentation</a>):
        </Typography>
        <SyntaxHighlighter language="javascript" style={agate}>
          {`<!-- Include libraries from CDN -->
<script defer src="https://unpkg.com/analytics/dist/analytics.min.js"></script>
<script defer src="https://unpkg.com/analytics-plugin-web3analytics/dist/web3analytics.min.js"></script>

<script type="text/javascript">
window.addEventListener('load', function() {
    /* Initialize analytics */
    var Analytics = _analytics.init({
        app: 'web3analytics-html-demo',
        plugins: [
            // attach web3analytics plugin
            web3analytics.default({
                appId: '${myOnChainApp? myOnChainApp.appAddress:'YOUR_WEB3ANALYTICS_APP_ID'}',
                jsonRpcUrl: 'https://rinkeby.infura.io/v3/your_api_key'
            })
        ]
    })
    /* Fire page view */
    Analytics.page()            
});
</script>`}
        </SyntaxHighlighter>
        </>
    )
}
    
export default InstructionsCDN