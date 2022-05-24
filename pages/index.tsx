import * as React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head'
import Image from 'next/image'
import { useSession, signIn, signOut } from "next-auth/react"
import styles from '../styles/Home.module.css' assert { type: 'css' }

const Home: NextPage = () => {
  const { data: session } = useSession()

  return (
    <div className={styles.container}>
      <Head>
        <title>Web3 Analytics</title>
        <meta name="description" content="A decentralized anlaytics platform where users own their data." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

      {!session && (
        <>
          <h1 className={styles.title}>
            Web3 Analytics
          </h1>

          <p className={styles.description}>
            Decentralized analytics. Where users own their data.
          </p>
        </>
      )}

      </main>

    </div>
  )
}

export default Home;