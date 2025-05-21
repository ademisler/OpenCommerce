import { useState } from 'react'
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
  const [info, setInfo] = useState('')
  const handleClick = (country) => {
    const wage = wages[country]
    setInfo(`${country}: ${wage} €`)
  }

  return (
    <div className={styles.container}>
      <h1>Avrupa Birliği Asgari Ücretler Haritası</h1>
      <svg viewBox="0 0 220 180" className={styles.map}>
        <rect id="France" x="60" y="110" width="30" height="20" fill="#77f" onClick={() => handleClick('France')}/>
        <rect id="Germany" x="100" y="90" width="30" height="20" fill="#77f" onClick={() => handleClick('Germany')}/>
        <rect id="Italy" x="110" y="120" width="20" height="30" fill="#77f" onClick={() => handleClick('Italy')}/>
        <rect id="Spain" x="40" y="120" width="30" height="20" fill="#77f" onClick={() => handleClick('Spain')}/>
        <rect id="Poland" x="120" y="70" width="30" height="20" fill="#77f" onClick={() => handleClick('Poland')}/>
        <rect id="Sweden" x="120" y="30" width="30" height="20" fill="#77f" onClick={() => handleClick('Sweden')}/>
        <rect id="Greece" x="130" y="150" width="20" height="20" fill="#77f" onClick={() => handleClick('Greece')}/>
      </svg>
      {info && <div className={styles.info}>{info}</div>}
    </div>
  )
}
