import React, { useEffect, useState } from 'react'
import './App.css'
import ContactForm from './components/ContactForm'
import CountryExplorer from './components/CountryExplorer'
import CountryPage from './components/CountryPage'

function normalizePath(p: string) {
  if (!p) return '/'
  return p.startsWith('/') ? p : '/' + p
}

export default function App() {
  const [path, setPath] = useState<string>(() => normalizePath(window.location.pathname))

  useEffect(() => {
    const onPop = () => setPath(normalizePath(window.location.pathname))
    const onAppNav = () => setPath(normalizePath(window.location.pathname))
    window.addEventListener('popstate', onPop)
    window.addEventListener('app:navigated', onAppNav)
    return () => {
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('app:navigated', onAppNav)
    }
  }, [])

  const match = path.match(/^\/countries\/(.+)$/)
  if (match) {
    const id = decodeURIComponent(match[1])
    return (
      <div className="App">
        <main className="App-main">
          <CountryPage id={id} />
        </main>
        <ContactForm />
      </div>
    )
  }

  return (
    <div className="App">
      <main className="App-main">
        <CountryExplorer />
      </main>
      <ContactForm />
    </div>
  )
}
