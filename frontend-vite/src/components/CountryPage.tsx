import React, { useEffect, useState } from "react"
import axios from "axios"
import localCountries from "../../../collections/countries.json"
import "./SpotlightCards.css"

interface Achievement {
  _id: string
  title: string
  description: string
}

interface Country {
  _id?: string
  name: string
  era?: string
  imageUrl?: string
  description?: string
  achievements?: Achievement[]
}

export default function CountryPage({ id }: { id: string }) {
  const [country, setCountry] = useState<Country | null>(null)
  const [loading, setLoading] = useState(true)

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

  useEffect(() => {
    let mounted = true
    const resolvedId = decodeURIComponent(id || "")

    const fetchCountry = async () => {
      try {
        // Try slug endpoint first (if backend supports it)
        try {
          const resp = await axios.get<Country>(`http://localhost:5000/api/countries/slug/${resolvedId}`)
          if (mounted && resp?.data) {
            setCountry(resp.data)
            setLoading(false)
            return
          }
        } catch {
          // ignore and continue to other strategies
        }

        // Try direct id endpoint
        try {
          const resp = await axios.get<Country>(`http://localhost:5000/api/countries/${resolvedId}`)
          if (mounted && resp?.data) {
            setCountry(resp.data)
            setLoading(false)
            return
          }
        } catch {
          // ignore and fallback to local data
        }

        // Fallback: search bundled data by _id or slugified name
        const local = localCountries as unknown as Country[]
        const found =
          local.find((c) => ((c as Country & { _id?: string })._id) === resolvedId) ||
          local.find((c) => slugify(c.name) === resolvedId)

        if (mounted) {
          setCountry(found || null)
          setLoading(false)
        }
      } catch {
        if (mounted) {
          setCountry(null)
          setLoading(false)
        }
      }
    }

    fetchCountry()
    return () => {
      mounted = false
    }
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!country) return <div>Country not found</div>

  return (
    <article className="country-page">
      <div className="spotlight-inner" style={{ maxWidth: 1000 }}>
        <header style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h1 style={{ margin: 0 }}>{country.name}</h1>
          {country.era && <div style={{ color: "rgba(0,0,0,0.6)" }}>{country.era}</div>}
        </header>

        {country.imageUrl && (
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <img
              src={country.imageUrl}
              alt={country.name}
              style={{ maxWidth: "100%", borderRadius: 12, boxShadow: "0 8px 30px rgba(2,6,23,0.06)" }}
            />
          </div>
        )}

        {country.description && <p style={{ color: "rgba(17,24,39,0.8)" }}>{country.description}</p>}

        {country.achievements && country.achievements.length > 0 && (
          <section style={{ marginTop: "1.5rem" }}>
            <h2 style={{ marginBottom: "0.75rem" }}>Key Achievements</h2>
            <div style={{ display: "grid", gap: "0.85rem" }}>
              {country.achievements.map((a) => (
                <div key={a._id} style={{ background: "#fff", padding: "1rem", borderRadius: 10, boxShadow: "0 6px 18px rgba(2,6,23,0.06)" }}>
                  <strong style={{ display: "block", marginBottom: 6 }}>{a.title}</strong>
                  <p style={{ margin: 0, color: "rgba(17,24,39,0.75)" }}>{a.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  )
}
