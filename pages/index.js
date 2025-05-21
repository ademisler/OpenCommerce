import { useEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

const wages = {
  Austria: 'N/A',
  Belgium: 1990,
  Bulgaria: 780,
  Croatia: 700,
  Cyprus: 1000,
  Czechia: 750,
  Denmark: 'N/A',
  Estonia: 820,
  Finland: 'N/A',
  France: 1766,
  Germany: 2050,
  Greece: 910,
  Hungary: 710,
  Ireland: 1880,
  Italy: 'N/A',
  Latvia: 700,
  Lithuania: 924,
  Luxembourg: 2400,
  Malta: 840,
  Netherlands: 1995,
  Poland: 980,
  Portugal: 886,
  Romania: 660,
  Slovakia: 750,
  Slovenia: 1250,
  Spain: 1323,
  Sweden: 'N/A'
}

export default function Home() {
  useEffect(() => {
    const obj = document.getElementById('eu-map')
    if (!obj) return

    const onLoad = () => {
      const svg = obj.contentDocument
      if (!svg) return

      Object.keys(wages).forEach(country => {
        const el = svg.getElementById(country)
        if (el) {
          el.style.cursor = 'pointer'
          el.addEventListener('click', () => showInfo(country))
        }
      })
    }

    obj.addEventListener('load', onLoad)
    return () => {
      obj.removeEventListener('load', onLoad)
    }
  }, [])

  function showInfo(country) {
    const info = document.getElementById('info')
    info.textContent = `${country}: ${wages[country]} €`
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>AB Asgari Ücret Haritası</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <h1>Avrupa Birliği Asgari Ücretler Haritası</h1>
      <div id="map-container" className={styles.mapContainer}>
        <object id="eu-map" type="image/svg+xml" data="https://upload.wikimedia.org/wikipedia/commons/9/9f/European_Union_member_states_map.svg" />
      </div>
      <div id="info" className={styles.info}></div>
    </div>
  )
}
