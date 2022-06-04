import MenuAppBar from './MenuAppBar.js'
import {
  Container, 
} from '@mui/material'

export default function Layout({ children }) {
  return (
    <>
      <MenuAppBar />
      <Container component="main" maxWidth="s">
        {children}
      </Container>
    </>
  )
}