import MenuAppBar from './MenuAppBar.js'

export default function Layout({ children }) {
  return (
    <>
      <MenuAppBar />
      <main>{children}</main>
    </>
  )
}