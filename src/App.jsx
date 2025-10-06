import { useState, useEffect } from 'react'
import './App.css'

const DRAW_DATE = new Date('2025-10-09T13:00:00Z')
const WINNER_URL = 'https://raw.githubusercontent.com/vinhed/ddagen-raffle/refs/heads/main/public/winner.ticket'

function App() {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining())
  const [winningTicket, setWinningTicket] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(WINNER_URL)
      .then(res => res.text())
      .then(data => {
        setWinningTicket(data.trim() || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeRemaining()), 1000)
    return () => clearInterval(interval)
  }, [])

  function getTimeRemaining() {
    const diff = DRAW_DATE - new Date()
    if (diff <= 0) return { ended: true }

    return {
      ended: false,
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60)
    }
  }

  const pad = n => String(n).padStart(2, '0')

  if (loading) return <div className="page"><main><p className="waiting">Loading...</p></main></div>

  const renderCountdown = () => (
    <div className="countdown-box">
      <p className="label">Draw Happening In</p>
      <div className="timer">
        <div>
          <div className="number">{pad(timeLeft.hours)}</div>
          <div className="unit">hours</div>
        </div>
        <div>
          <div className="number">{pad(timeLeft.minutes)}</div>
          <div className="unit">minutes</div>
        </div>
        <div>
          <div className="number">{pad(timeLeft.seconds)}</div>
          <div className="unit">seconds</div>
        </div>
      </div>
    </div>
  )

  const renderResult = () => (
    <div className="countdown-box">
      {winningTicket ? (
        <>
          <p className="label">Winning Ticket</p>
          <div className="winner">{winningTicket}</div>
        </>
      ) : (
        <p className="waiting">Results coming soon</p>
      )}
    </div>
  )

  return (
    <div className="page">
      <header>
        <img src={`${import.meta.env.BASE_URL}Objective.svg`} alt="Objective Solutions" className="logo" />
        <a href="https://objective.se" className="nav-link" target="_blank" rel="noopener noreferrer">Visit Our Website</a>
      </header>
      <main>
        {!winningTicket && !timeLeft.ended ? renderCountdown() : renderResult()}
        <div className="content-wrapper">
          <div className="prize-info">
            <h2 className="prize-title">Sonos Roam 2</h2>
            <img src="https://media.sonos.com/images/znqtjj88/production/80940def711d17d1cdf1bfbb982456a092e9efd2-2400x2400.png?w=3840&q=100&fit=clip&auto=format" alt="Sonos Roam 2" className="product" />
            <p className="prize-desc">Experience premium sound anywhere you go with this portable Bluetooth speaker. Waterproof, durable, and designed for adventure.</p>
            <a href="https://www.sonos.com/sv-se/shop/roam-2" target="_blank" rel="noopener noreferrer" className="product-link">Learn More</a>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
