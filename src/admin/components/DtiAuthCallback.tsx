import { useLayoutEffect, useState, type FormEvent } from 'react'
import {
  acceptDtiAuthCallback,
  clearDtiAuthFlow,
  getDtiAuthFlow,
  getDtiStaffSession,
  setDtiAuthFlow,
  updateDtiStaffPassword,
  type DtiStaffSession,
} from '../services/dtiOperationsApi'
import { getSafeCallbackError, parseDtiAuthCallback } from '../services/dtiAuthFlow.mjs'

type CallbackState = 'checking' | 'invite' | 'recovery' | 'session' | 'invalid' | 'complete'

function DtiAuthCallback() {
  const [state, setState] = useState<CallbackState>('checking')
  const [session, setSession] = useState<DtiStaffSession | null>(null)
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useLayoutEffect(() => {
    let active = true
    const callback = parseDtiAuthCallback(window.location.hash)
    const query = new URLSearchParams(window.location.search)
    const hasQueryError = query.has('error') || query.has('error_code')
    const errorCode = callback?.kind === 'error'
      ? callback.errorCode
      : query.get('error_code')

    // Auth tokens arrive in the fragment. Remove them from the address bar and
    // current history entry before making any further request or rendering UI.
    window.history.replaceState({}, document.title, window.location.pathname)

    if (hasQueryError) {
      queueMicrotask(() => {
        if (active) {
          setError(getSafeCallbackError(errorCode))
          setState('invalid')
        }
      })
      return () => { active = false }
    }
    if (callback?.kind === 'error') {
      queueMicrotask(() => {
        if (active) {
          setError(getSafeCallbackError(callback.errorCode))
          setState('invalid')
        }
      })
      return () => { active = false }
    }
    if (callback?.kind === 'invalid') {
      queueMicrotask(() => {
        if (active) {
          setError('El enlace está incompleto. Solicita uno nuevo al responsable de la cuenta.')
          setState('invalid')
        }
      })
      return () => { active = false }
    }
    if (callback) {
      void acceptDtiAuthCallback(callback.accessToken, callback.refreshToken, callback.expiresAt)
        .then((nextSession) => {
          if (!active) return
          if (callback.kind === 'invite' || callback.kind === 'recovery') setDtiAuthFlow(callback.kind)
          setSession(nextSession)
          setState(callback.kind)
        })
        .catch((cause: unknown) => {
          if (!active) return
          clearDtiAuthFlow()
          setError(cause instanceof Error ? cause.message : 'No se pudo validar el enlace. Solicita uno nuevo.')
          setState('invalid')
        })
      return () => { active = false }
    }

    const existingSession = getDtiStaffSession()
    if (existingSession) {
      const rememberedFlow = getDtiAuthFlow()
      queueMicrotask(() => {
        if (active) {
          setSession(existingSession)
          setState(rememberedFlow ?? 'session')
        }
      })
      return () => { active = false }
    }
    queueMicrotask(() => {
      if (active) {
        setError('El enlace está incompleto o ha caducado. Solicita uno nuevo al responsable de la cuenta.')
        setState('invalid')
      }
    })
    return () => { active = false }
  }, [])

  const handleSetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!session || password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (password !== confirmation) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const activeSession = await updateDtiStaffPassword(session, password)
      clearDtiAuthFlow()
      setSession(activeSession)
      setPassword('')
      setConfirmation('')
      setState('complete')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo actualizar la contraseña.')
    } finally {
      setLoading(false)
    }
  }

  const title = state === 'invite' ? 'Activa tu acceso DTI' : state === 'recovery' ? 'Restablece tu contraseña' : 'Acceso DTI'
  const continueHref = `${window.location.origin}/#/admin/production`

  return (
    <main className="dti-auth-callback">
      <section className="dti-auth-callback__card" aria-labelledby="dti-auth-title">
        <span className="section-label">Ridaos Print · Operaciones QA</span>
        <h1 id="dti-auth-title">{title}</h1>
        {state === 'checking' ? <p role="status">Validando enlace seguro…</p> : null}
        {state === 'invite' || state === 'recovery' ? (
          <>
            <p>{state === 'invite' ? 'El enlace es válido. Define una contraseña para activar tu cuenta.' : 'El enlace es válido. Elige una contraseña nueva para recuperar el acceso.'}</p>
            <form className="dti-auth-callback__form" onSubmit={(event) => void handleSetPassword(event)}>
              <label>Nueva contraseña<input autoComplete="new-password" minLength={8} onChange={(event) => setPassword(event.target.value)} required type="password" value={password} /></label>
              <label>Repite la contraseña<input autoComplete="new-password" minLength={8} onChange={(event) => setConfirmation(event.target.value)} required type="password" value={confirmation} /></label>
              <button className="action-button action-button-primary" disabled={loading} type="submit">{loading ? 'Guardando…' : 'Guardar contraseña'}</button>
            </form>
          </>
        ) : null}
        {state === 'session' ? <p>La sesión se ha establecido en este navegador. Puedes continuar al panel; las operaciones requieren permisos DTI aprobados.</p> : null}
        {state === 'complete' ? <p role="status">Contraseña guardada. Tu sesión QA se mantiene en este navegador; el acceso operativo sigue sujeto a permisos asignados.</p> : null}
        {state === 'invalid' ? <p role="alert">{error}</p> : null}
        {error && state !== 'invalid' ? <p className="dti-auth-callback__error" role="alert">{error}</p> : null}
        {state === 'complete' || state === 'session' ? <a className="action-button action-button-primary" href={continueHref}>Continuar a operaciones</a> : null}
        {state === 'invalid' ? <a className="action-button action-button-muted" href={`${window.location.origin}/#/admin/production`}>Volver al acceso</a> : null}
      </section>
    </main>
  )
}

export default DtiAuthCallback
