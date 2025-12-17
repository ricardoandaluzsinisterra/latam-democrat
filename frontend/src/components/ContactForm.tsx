import React from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import './ContactForm.css'

interface FormData {
  name: string
  email: string
  countryInterest: string
  message: string
}

export default function ContactForm() {
  const { register, handleSubmit, reset, getValues, trigger, formState: { errors, isSubmitting } } = useForm<FormData>()
  const [submitted, setSubmitted] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const onSubmit = async (data: FormData) => {
    setError(null)
      try {
      console.log('[contact] payload', JSON.stringify(data))
      await axios.post('/api/contact', data)
      setSubmitted(true)
      reset()
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err: unknown) {
      let msg = 'Error submitting form'
      if (axios.isAxiosError(err)) {
        const dataErr = err.response?.data as { error?: string } | undefined
        msg = dataErr?.error || msg
      } else if (err instanceof Error) {
        msg = err.message || msg
      }
      setError(msg)
    }
  }

  return (
    <footer className="site-footer" role="contentinfo" aria-label="Contact footnote">
      <div className="footer-inner">
        <div className="footer-blurb">
          <div className="footer-title">Get in touch</div>
          <div className="footer-sub">Questions, corrections, or sources — reach out.</div>
        </div>

        <form onSubmit={(e) => { console.log('[contact] nativeSubmit'); handleSubmit(onSubmit)(e); }} onSubmitCapture={() => { console.log('[contact] submitCaptured'); console.log('[contact] currentValues', getValues()); console.log('[contact] errors', errors); }} className="footer-form" aria-live="polite">
          {submitted && <div className="footer-success">✓ Message sent — thanks.</div>}
          {error && <div className="footer-error">✗ {error}</div>}

          <input
            {...register('name', { required: 'Name required' })}
            type="text"
            placeholder="Your name"
            aria-label="Your name"
            className={errors.name ? 'invalid' : ''}
          />

          <input
            {...register('email', {
              required: 'Email required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }
            })}
            type="email"
            placeholder="Your email"
            aria-label="Your email"
            className={errors.email ? 'invalid' : ''}
          />

          <select {...register('countryInterest')} aria-label="Country of interest">
            <option value="">Select country</option>
            <option value="Panama">Panama</option>
            <option value="Mexico">Mexico</option>
            <option value="Colombia">Colombia</option>
            <option value="Venezuela">Venezuela</option>
          </select>

          <textarea
            {...register('message', { required: 'Message required', minLength: { value: 10, message: 'Min 10 chars' } })}
            placeholder="Message"
            aria-label="Message"
          />

          <div className="footer-actions">
            <button type="submit" disabled={isSubmitting} onClick={() => console.log('[contact] button clicked')}>{isSubmitting ? 'Sending...' : 'Send'}</button>
          </div>
        </form>
      </div>
    </footer>
  )
}
