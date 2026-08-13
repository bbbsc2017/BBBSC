import { useMemo, useRef, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ClipboardCheck, LockKeyhole, Send, ShieldCheck } from 'lucide-react'
import { Seo } from '../components/Seo'
import { ShowcaseHero } from '../components/ui/ShowcaseHero'
import { Container } from '../components/ui/Container'
import { CTAButton } from '../components/ui/CTAButton'
import { FormField, SelectInput, TextInput } from '../components/ui/FormField'
import { colombiaDepartments, getDepartment } from '../data/colombiaLocations'
import {
  academicLevels, academicShifts, careers, englishLevels, passportStatusOptions, previousSwtCount, semesters, yesNo,
} from '../data/careers'
import { whatsappLink } from '../lib/site'
import { getCulturalProgram } from '../data/culturalPrograms'
import { executeRecaptcha } from '../lib/recaptcha'
import { RecaptchaNotice } from '../components/ui/RecaptchaNotice'

const workTravelProgram = getCulturalProgram('work-and-travel-usa')!

const initialForm = {
  firstName: '', lastName: '', cedula: '', email: '', phone: '', fechaNacimiento: '',
  departamentoNacimiento: '', municipioNacimiento: '', direccion: '',
  pasaporte: '', numeroPasaporte: '', nivelIngles: '',
  participacionPrevia: '', numeroParticipaciones: '', visaAplicada: '', visaNegada: '',
  condicionMedica: '', alergias: '', restriccionPeso: '', condicionFisicaMental: '',
  nivelAcademico: '', programaAcademico: '', jornadaAcademica: '', semestre: '', fechaGrado: '',
  departamentoUniversidad: '', municipioUniversidad: '', universidad: '',
  nombrePadre: '', telefonoPadre: '', nombreMadre: '', telefonoMadre: '', familiaresEEUU: '',
  gdprAceptado: false,
}

type FormState = typeof initialForm

const steps = [
  { title: 'Datos personales', short: 'Tus datos' },
  { title: 'Perfil del programa', short: 'Tu perfil' },
  { title: 'Estudios y familia', short: 'Contexto' },
  { title: 'Confirmar y enviar', short: 'Confirmación' },
]

function StepHeading({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4 border-b border-white/10 pb-5">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand font-extrabold text-white">{number}</span>
      <div>
        <h2 className="text-lg font-bold text-white sm:text-xl">{title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-white/55">{description}</p>
      </div>
    </div>
  )
}

function ChoiceField({ name, label, value, onChange, required }: { name: string; label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-semibold text-white">
        {label}{required && <span className="ml-1 text-brand" aria-hidden="true">*</span>}
      </legend>
      <div className="grid grid-cols-2 gap-2">
        {yesNo.map((option) => (
          <label key={option} className={`flex min-h-12 cursor-pointer items-center justify-center rounded-xl border px-4 text-sm font-semibold transition-colors ${value === option ? 'border-brand bg-brand/15 text-brand' : 'border-white/15 bg-ink/70 text-white/65 hover:border-white/30'}`}>
            <input className="sr-only" type="radio" name={name} required={required} checked={value === option} onChange={() => onChange(option)} />
            {value === option && <Check className="mr-2 size-4" aria-hidden="true" />}
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function StepActions({ step, onBack, onNext, submitting }: { step: number; onBack: () => void; onNext: () => void; submitting: boolean }) {
  return (
    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
      {step > 0 ? (
        <button type="button" onClick={onBack} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 px-6 text-sm font-semibold text-white/75 hover:border-white/30 hover:text-white">
          <ArrowLeft className="size-4" /> Anterior
        </button>
      ) : <span />}
      {step < steps.length - 1 ? (
        <button type="button" onClick={onNext} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand px-7 text-sm font-bold text-white shadow-brand transition-transform hover:-translate-y-0.5">
          Continuar <ArrowRight className="size-4" />
        </button>
      ) : (
        <button type="submit" disabled={submitting} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand px-7 text-sm font-bold text-white shadow-brand transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">
          <Send className="size-4" /> {submitting ? 'Enviando…' : 'Enviar inscripción'}
        </button>
      )}
    </div>
  )
}

export default function InscripcionWorkAndTravel() {
  const formRef = useRef<HTMLFormElement>(null)
  const [form, setForm] = useState<FormState>(initialForm)
  const [step, setStep] = useState(0)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const birthDept = useMemo(() => getDepartment(form.departamentoNacimiento), [form.departamentoNacimiento])
  const uniDept = useMemo(() => getDepartment(form.departamentoUniversidad), [form.departamentoUniversidad])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((previous) => ({ ...previous, [key]: value }))
  }

  function updateBirthDept(key: string) {
    setForm((previous) => ({ ...previous, departamentoNacimiento: key, municipioNacimiento: '' }))
  }

  function updateUniDept(key: string) {
    setForm((previous) => ({ ...previous, departamentoUniversidad: key, municipioUniversidad: '', universidad: '' }))
  }

  function goToStep(nextStep: number) {
    setStep(nextStep)
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  function goNext() {
    if (!formRef.current?.reportValidity()) return
    goToStep(Math.min(step + 1, steps.length - 1))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!formRef.current?.reportValidity()) return
    setStatus('submitting')
    setErrorMessage('')

    try {
      const recaptchaToken = await executeRecaptcha('work_travel_registration')
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          departamentoNacimientoLabel: birthDept?.label,
          departamentoUniversidadLabel: uniDept?.label,
          recaptchaToken,
        }),
      })
      const data = await response.json().catch(() => ({ ok: false }))
      if (!response.ok || !data.ok) throw new Error(data.error || 'No pudimos enviar tu inscripción. Intenta de nuevo.')
      setStatus('success')
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'No pudimos enviar tu inscripción. Intenta de nuevo.')
    }
  }

  if (status === 'success') {
    return (
      <>
        <Seo title="Inscripción enviada — Work and Travel USA" description="Tu inscripción a Work and Travel USA fue enviada correctamente." path="/work-and-travel-usa/inscripcion" />
        <section className="relative overflow-hidden bg-ink-mesh py-24">
          <Container className="flex flex-col items-center gap-5 text-center">
            <span className="flex size-16 items-center justify-center rounded-2xl bg-brand text-white"><CheckCircle2 className="size-8" /></span>
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">¡Inscripción recibida!</h1>
            <p className="max-w-md text-balance text-white/70">Gracias por inscribirte. Un asesor revisará tu información y se pondrá en contacto contigo para continuar con el proceso.</p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <CTAButton to="/">Volver al inicio</CTAButton>
              <CTAButton href={whatsappLink('¡Hola! Acabo de enviar mi inscripción a Work and Travel USA.')} icon={false} variant="ghost">Escríbenos por WhatsApp</CTAButton>
            </div>
          </Container>
        </section>
      </>
    )
  }

  return (
    <>
      <Seo title="Inscripción a Work and Travel USA" description="Inicia tu inscripción a Work and Travel USA con BBB Student Center. Completa tu perfil y recibe acompañamiento durante el proceso." path="/work-and-travel-usa/inscripcion" image={workTravelProgram.image.src} imageAlt={workTravelProgram.image.alt} />
      <ShowcaseHero
        eyebrow="Inscripción Work and Travel USA"
        title="Inscríbete a Work and Travel USA"
        description="Cuéntanos sobre ti y descubre si este programa encaja con tus planes. Completar tu perfil toma aproximadamente 8 minutos."
        image={workTravelProgram.image}
        primaryAction={{ label: 'Empezar inscripción', to: '#formulario-inscripcion' }}
        secondaryAction={{ label: 'Volver al programa', to: '/work-and-travel-usa' }}
        breadcrumbs={[{ label: 'Inicio', to: '/' }, { label: 'Programas culturales' }, { label: 'Work and Travel USA', to: '/work-and-travel-usa' }, { label: 'Inscripción' }]}
      />

      <section id="formulario-inscripcion" className="scroll-mt-24 py-6 sm:py-8">
        <Container className="max-w-6xl">
          <div className="mb-8 overflow-hidden rounded-2xl border border-white/10 bg-ink-800/70 p-3 sm:p-4">
            <div className="mb-3 flex items-center justify-between text-xs font-semibold text-white/50">
              <span>Paso {step + 1} de {steps.length}</span>
              <span>{Math.round(((step + 1) / steps.length) * 100)}% completado</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-brand transition-[width] duration-300" style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
            <ol className="mt-4 grid grid-cols-4 gap-2" aria-label="Progreso de la inscripción">
              {steps.map((item, index) => (
                <li key={item.title}>
                  <button type="button" onClick={() => index < step && goToStep(index)} disabled={index >= step} aria-current={index === step ? 'step' : undefined} className={`flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-xs font-semibold transition-colors sm:px-3 ${index === step ? 'bg-brand/15 text-brand' : index < step ? 'text-white hover:bg-white/5' : 'text-white/35'}`}>
                    <span className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${index <= step ? 'border-brand bg-brand text-white' : 'border-white/15'}`}>{index < step ? <Check className="size-3.5" /> : index + 1}</span>
                    <span className="hidden sm:block">{item.short}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
            <form ref={formRef} onSubmit={handleSubmit} className="scroll-mt-24 rounded-3xl border border-white/10 bg-ink-800 p-5 shadow-2xl shadow-black/20 sm:p-8">
              <input type="hidden" name="formKey" value="registration_work-and-travel-usa" />
              <input type="hidden" name="interestTag" value="interesado_work_and_travel_usa" />
              <input type="hidden" name="message" value={`${form.firstName.trim()} ${form.lastName.trim()} se inscribió en el formulario de la página web de Work and Travel USA.`.trim()} />
              {step === 0 && (
                <div className="flex flex-col gap-6">
                  <StepHeading number={1} title="Cuéntanos quién eres" description="Empecemos con tus datos básicos y de contacto." />
                  <fieldset className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <FormField label="Nombres" required><TextInput required autoComplete="given-name" placeholder="Escribe tus nombres" value={form.firstName} onChange={(event) => update('firstName', event.target.value)} /></FormField>
                    <FormField label="Apellidos" required><TextInput required autoComplete="family-name" placeholder="Escribe tus apellidos" value={form.lastName} onChange={(event) => update('lastName', event.target.value)} /></FormField>
                    <FormField label="Cédula"><TextInput inputMode="numeric" placeholder="Número de identificación" value={form.cedula} onChange={(event) => update('cedula', event.target.value)} /></FormField>
                    <FormField label="Correo electrónico" required><TextInput required type="email" autoComplete="email" placeholder="nombre@correo.com" value={form.email} onChange={(event) => update('email', event.target.value)} /></FormField>
                    <FormField label="Teléfono" hint="Incluye el indicativo del país."><TextInput type="tel" autoComplete="tel" placeholder="+57 300 000 0000" value={form.phone} onChange={(event) => update('phone', event.target.value)} /></FormField>
                    <FormField label="Fecha de nacimiento"><TextInput type="date" value={form.fechaNacimiento} onChange={(event) => update('fechaNacimiento', event.target.value)} /></FormField>
                    <FormField label="Departamento de nacimiento"><SelectInput value={form.departamentoNacimiento} onChange={(event) => updateBirthDept(event.target.value)}>{colombiaDepartments.map((department) => <option key={department.key} value={department.key}>{department.label}</option>)}</SelectInput></FormField>
                    <FormField label="Municipio de nacimiento"><SelectInput value={form.municipioNacimiento} onChange={(event) => update('municipioNacimiento', event.target.value)} disabled={!birthDept} placeholder={birthDept ? 'Selecciona un municipio' : 'Elige primero el departamento'}>{birthDept?.municipios.map((municipality) => <option key={municipality} value={municipality}>{municipality}</option>)}</SelectInput></FormField>
                    <FormField label="Dirección" className="sm:col-span-2"><TextInput autoComplete="street-address" placeholder="Calle, número y complemento" value={form.direccion} onChange={(event) => update('direccion', event.target.value)} /></FormField>
                  </fieldset>
                </div>
              )}

              {step === 1 && (
                <div className="flex flex-col gap-8">
                  <StepHeading number={2} title="Conozcamos tu perfil" description="Estas respuestas nos ayudan a validar tu elegibilidad para el programa." />
                  <fieldset className="flex flex-col gap-5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-brand">Documentación e inglés</h3>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <FormField label="Estado del pasaporte" required><SelectInput required value={form.pasaporte} onChange={(event) => update('pasaporte', event.target.value)}>{passportStatusOptions.map((value) => <option key={value} value={value}>{value}</option>)}</SelectInput></FormField>
                      {form.pasaporte === 'Si' && <FormField label="Número de pasaporte"><TextInput autoComplete="off" placeholder="Número del pasaporte" value={form.numeroPasaporte} onChange={(event) => update('numeroPasaporte', event.target.value)} /></FormField>}
                      <FormField label="Nivel de inglés" required className="sm:col-span-2"><SelectInput required value={form.nivelIngles} onChange={(event) => update('nivelIngles', event.target.value)}>{englishLevels.map((value) => <option key={value} value={value}>{value}</option>)}</SelectInput></FormField>
                    </div>
                  </fieldset>
                  <fieldset className="flex flex-col gap-5 border-t border-white/10 pt-7">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-brand">Experiencia previa</h3>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <ChoiceField name="participacionPrevia" label="¿Has participado antes en Work and Travel?" required value={form.participacionPrevia} onChange={(value) => update('participacionPrevia', value)} />
                      {form.participacionPrevia === 'Si' && <FormField label="Número de participaciones anteriores"><SelectInput value={form.numeroParticipaciones} onChange={(event) => update('numeroParticipaciones', event.target.value)}>{previousSwtCount.filter((value) => value !== '0').map((value) => <option key={value} value={value}>{value}</option>)}</SelectInput></FormField>}
                      <ChoiceField name="visaAplicada" label="¿Has aplicado a una visa de Estados Unidos?" required value={form.visaAplicada} onChange={(value) => update('visaAplicada', value)} />
                      <ChoiceField name="visaNegada" label="¿Te han negado una visa de Estados Unidos?" required value={form.visaNegada} onChange={(value) => update('visaNegada', value)} />
                    </div>
                  </fieldset>
                  <fieldset className="flex flex-col gap-5 border-t border-white/10 pt-7">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-brand">Salud y bienestar</h3>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <ChoiceField name="condicionMedica" label="¿Tienes alguna condición médica preexistente?" required value={form.condicionMedica} onChange={(value) => update('condicionMedica', value)} />
                      <ChoiceField name="alergias" label="¿Tienes alguna alergia?" required value={form.alergias} onChange={(value) => update('alergias', value)} />
                      <ChoiceField name="restriccionPeso" label="¿Tienes restricción para cargar peso?" required value={form.restriccionPeso} onChange={(value) => update('restriccionPeso', value)} />
                      <ChoiceField name="condicionFisicaMental" label="¿Tienes condiciones físicas o mentales preexistentes?" required value={form.condicionFisicaMental} onChange={(value) => update('condicionFisicaMental', value)} />
                    </div>
                  </fieldset>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-8">
                  <StepHeading number={3} title="Estudios y entorno familiar" description="Completa la información que utilizaremos para orientar tu proceso." />
                  <fieldset className="flex flex-col gap-5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-brand">Información académica</h3>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <FormField label="Nivel académico"><SelectInput value={form.nivelAcademico} onChange={(event) => update('nivelAcademico', event.target.value)}>{academicLevels.map((value) => <option key={value} value={value}>{value}</option>)}</SelectInput></FormField>
                      <FormField label="Jornada académica"><SelectInput value={form.jornadaAcademica} onChange={(event) => update('jornadaAcademica', event.target.value)}>{academicShifts.map((value) => <option key={value} value={value}>{value}</option>)}</SelectInput></FormField>
                      <FormField label="Programa académico" className="sm:col-span-2"><SelectInput value={form.programaAcademico} onChange={(event) => update('programaAcademico', event.target.value)}>{careers.map((value) => <option key={value} value={value}>{value}</option>)}</SelectInput></FormField>
                      <FormField label="Semestre"><SelectInput value={form.semestre} onChange={(event) => update('semestre', event.target.value)}>{semesters.map((value) => <option key={value} value={value}>{value}</option>)}</SelectInput></FormField>
                      <FormField label="Fecha tentativa de grado" required><TextInput required type="date" value={form.fechaGrado} onChange={(event) => update('fechaGrado', event.target.value)} /></FormField>
                    </div>
                    <div className="mt-2 grid grid-cols-1 gap-5 border-t border-white/10 pt-6 sm:grid-cols-2">
                      <h4 className="text-sm font-bold text-white sm:col-span-2">Tu universidad</h4>
                      <FormField label="Departamento"><SelectInput value={form.departamentoUniversidad} onChange={(event) => updateUniDept(event.target.value)}>{colombiaDepartments.map((department) => <option key={department.key} value={department.key}>{department.label}</option>)}</SelectInput></FormField>
                      <FormField label="Municipio"><SelectInput value={form.municipioUniversidad} onChange={(event) => update('municipioUniversidad', event.target.value)} disabled={!uniDept} placeholder={uniDept ? 'Selecciona un municipio' : 'Elige primero el departamento'}>{uniDept?.municipios.map((municipality) => <option key={municipality} value={municipality}>{municipality}</option>)}</SelectInput></FormField>
                      <FormField label="Universidad" className="sm:col-span-2"><SelectInput value={form.universidad} onChange={(event) => update('universidad', event.target.value)} disabled={!uniDept} placeholder={uniDept ? 'Selecciona una universidad' : 'Elige primero el departamento'}>{uniDept?.universidades.map((university) => <option key={university} value={university}>{university}</option>)}</SelectInput></FormField>
                    </div>
                  </fieldset>
                  <fieldset className="flex flex-col gap-5 border-t border-white/10 pt-7">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-brand">Información familiar</h3>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <FormField label="Nombre del padre"><TextInput autoComplete="off" value={form.nombrePadre} onChange={(event) => update('nombrePadre', event.target.value)} /></FormField>
                      <FormField label="Teléfono del padre"><TextInput type="tel" placeholder="+57" value={form.telefonoPadre} onChange={(event) => update('telefonoPadre', event.target.value)} /></FormField>
                      <FormField label="Nombre de la madre"><TextInput autoComplete="off" value={form.nombreMadre} onChange={(event) => update('nombreMadre', event.target.value)} /></FormField>
                      <FormField label="Teléfono de la madre"><TextInput type="tel" placeholder="+57" value={form.telefonoMadre} onChange={(event) => update('telefonoMadre', event.target.value)} /></FormField>
                      <div className="sm:col-span-2"><ChoiceField name="familiaresEEUU" label="¿Tienes padres, hermanos o hijos viviendo en Estados Unidos?" required value={form.familiaresEEUU} onChange={(value) => update('familiaresEEUU', value)} /></div>
                    </div>
                  </fieldset>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-6">
                  <StepHeading number={4} title="Revisa y confirma" description="Verifica tus datos principales antes de enviar la inscripción." />
                  <dl className="grid gap-4 rounded-2xl border border-white/10 bg-ink/50 p-5 text-sm sm:grid-cols-2">
                    <div><dt className="text-white/45">Nombre</dt><dd className="mt-1 font-semibold text-white">{form.firstName} {form.lastName}</dd></div>
                    <div><dt className="text-white/45">Correo</dt><dd className="mt-1 break-all font-semibold text-white">{form.email}</dd></div>
                    <div><dt className="text-white/45">Nivel de inglés</dt><dd className="mt-1 font-semibold text-white">{form.nivelIngles}</dd></div>
                    <div><dt className="text-white/45">Fecha tentativa de grado</dt><dd className="mt-1 font-semibold text-white">{form.fechaGrado}</dd></div>
                  </dl>
                  <fieldset className="rounded-2xl border border-brand/25 bg-brand/5 p-5">
                    <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-white/80">
                      <input type="checkbox" required checked={form.gdprAceptado} onChange={(event) => update('gdprAceptado', event.target.checked)} className="mt-0.5 size-5 shrink-0 accent-brand" />
                      <span>Acepto recibir información y actualizaciones por correo electrónico y WhatsApp de acuerdo con la <a href="/terminos-y-condiciones" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand underline underline-offset-2">política de privacidad de BBB Student Center</a>.</span>
                    </label>
                  </fieldset>
                  <p className="flex items-center gap-2 text-xs text-white/45"><LockKeyhole className="size-4 text-brand" /> Tus datos se envían de forma segura y solo se usan para gestionar tu proceso.</p>
                  <RecaptchaNotice />
                </div>
              )}

              {status === 'error' && <p role="alert" className="mt-6 rounded-xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm font-medium text-red-300">{errorMessage}</p>}
              <StepActions step={step} onBack={() => goToStep(step - 1)} onNext={goNext} submitting={status === 'submitting'} />
            </form>

            <aside className="flex flex-col gap-4 lg:sticky lg:top-24">
              <div className="rounded-2xl border border-brand/25 bg-brand/10 p-5">
                <ClipboardCheck className="size-6 text-brand" />
                <h2 className="mt-4 font-bold text-white">Antes de comenzar</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/60">Ten a la mano tus datos académicos y la información de tu pasaporte, si ya lo tienes.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-ink-800 p-5">
                <ShieldCheck className="size-6 text-brand" />
                <h2 className="mt-4 font-bold text-white">Información protegida</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/60">Revisaremos tu perfil para acompañarte. Completar este formulario no genera ningún cobro.</p>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  )
}
