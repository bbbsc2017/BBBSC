import type { ComponentType } from 'react'
import {
  Armchair,
  Banknote,
  Briefcase,
  Building2,
  Calendar,
  CalendarClock,
  Candy,
  Clock,
  Coins,
  DoorOpen,
  Gift,
  Luggage,
  Moon,
  PackageCheck,
  PiggyBank,
  Plane,
  Route as RouteIcon,
  Shield,
  Sparkles,
  Ticket,
  UserPlus,
  Users,
  UtensilsCrossed,
  Warehouse,
  Wrench,
} from 'lucide-react'
import { Seo } from '../components/Seo'
import { Container } from '../components/ui/Container'
import { SectionHeading } from '../components/ui/SectionHeading'
import { CTAButton } from '../components/ui/CTAButton'
import { GradientBlob } from '../components/ui/GradientBlob'
import { getCulturalProgram } from '../data/culturalPrograms'
import { SITE, whatsappLink, breadcrumbJsonLd } from '../lib/site'

const jobExampleIcons: Record<string, ComponentType<{ className?: string }>> = {
  'Fábrica de chocolate': Candy,
  'Almacén y logística': Warehouse,
  'Producción y montaje': Wrench,
  'Manipulación de equipaje': Luggage,
  'Sala business': Armchair,
  'Catering aeroportuario': UtensilsCrossed,
  'Embalaje y control de calidad': PackageCheck,
  'Otras tareas estacionales': CalendarClock,
}

const minConditions = [
  { Icon: Coins, value: '15,33 EUR', label: 'brutos por hora', note: 'Mínimo desde el 1 de septiembre de 2026.' },
  { Icon: Clock, value: '30 h', label: 'garantizadas por semana completa', note: 'El horario habitual suele ser superior.' },
  { Icon: Calendar, value: '60+ días', label: 'disponibilidad mínima', note: 'Se prefiere una estancia más larga, idealmente de 80-90 días.' },
]

const selectionSteps = [
  { Icon: Sparkles, title: 'Preferencias', description: 'Indica los sectores y lugares que prefieres. La flexibilidad aumenta las posibilidades.' },
  { Icon: Users, title: 'Bolsa de candidatos', description: 'Tu perfil se presenta a empresas adecuadas de nuestra red de empleadores.' },
  { Icon: Building2, title: 'Selección empresarial', description: 'La empresa elige perfiles según la demanda, la disponibilidad y la idoneidad.' },
  { Icon: UserPlus, title: 'Amigos', description: 'Marca a tus amigos en la solicitud. Intentamos asignarlos y alojarlos juntos cuando es posible.' },
]

const workloadStats = [
  { value: '35-37,5 h', label: 'plan semanal habitual', note: 'Normalmente cinco días y unas 7-7,5 horas de trabajo pagadas al día.' },
  { value: '173 h', label: 'promedio mensual de referencia', note: 'Promedio por estudiante en un mes natural completo, incluidos turnos adicionales.' },
  { value: '220 h', label: 'pico histórico registrado', note: 'Mayor total registrado por estudiante en un mes natural completo.' },
]

const accommodationStats = [
  { value: '450-550 EUR', label: 'alquiler mensual habitual', note: 'Este es el rango más frecuente.' },
  { value: 'máx. 600 EUR', label: 'por mes', note: '600 EUR es el límite general.' },
  { value: 'Incluidos', label: 'servicios y básicos', note: 'Electricidad, agua, calefacción, internet y ropa de cama incluidos.' },
]

const payrollSteps = [
  { Icon: CalendarClock, title: 'Periodo de nómina', description: 'Las horas se calculan normalmente del primer al último día de cada mes natural.' },
  { Icon: Calendar, title: 'Fecha de pago', description: 'El salario se paga el día 15 del mes siguiente. No se garantiza un pago anterior.' },
  { Icon: Banknote, title: 'Anticipos', description: 'Disponibles desde la segunda semana laboral: desde 125 EUR, normalmente 150 EUR y a veces más según el saldo ganado y la necesidad.' },
  { Icon: PiggyBank, title: 'Impuesto salarial', description: 'Promedio histórico: aprox. 12-15% del salario bruto. El importe individual puede variar.' },
]

const budgetLines = [
  { label: 'Salario bruto: 173 x 15,33 EUR', value: '2.652,09 EUR', tone: 'default' as const },
  { label: 'Impuesto salarial estimado: 12-15%', value: '- 318 a 398 EUR', tone: 'negative' as const },
  { label: 'Alojamiento supuesto', value: '- 550,00 EUR', tone: 'negative' as const },
  { label: 'Después de impuestos y alojamiento', value: '1.704 a 1.784 EUR', tone: 'subtotal' as const },
  { label: 'Comida 250 + ticket 63 + SIM 20 EUR', value: '- 333,00 EUR', tone: 'negative' as const },
]

const arrivalSteps = [
  { Icon: Plane, title: 'Antes del viaje', description: 'Reserva vuelos solo después de la confirmación y en coordinación con tu asesor y la empresa.' },
  { Icon: DoorOpen, title: 'Llegada e inicio', description: 'La llegada suele ser viernes o sábado y el trabajo empieza normalmente el lunes. El traslado se paga; te ayudamos en línea.' },
  { Icon: RouteIcon, title: 'Primer día y salida', description: 'Siempre recibes acompañamiento: presencial o instrucciones claras con fotos, video, PDF o ruta. La salida suele ser domingo.' },
]

const projectItems = [
  { Icon: Moon, title: 'Recargos', description: 'Se pagan recargos nocturnos, dominicales y festivos cuando corresponda. Algunos proyectos ofrecen 25% por horas extra según autorización y contrato.' },
  { Icon: Ticket, title: 'Deutschland-Ticket', description: 'Precio regular: 63 EUR/mes. Algunas empresas ofrecen descuento o lo proporcionan gratis.' },
  { Icon: Gift, title: 'Beneficio de llegada', description: 'Algunos proyectos incluyen hasta tres días de alojamiento sin alquiler; no es estándar para todas las empresas.' },
  { Icon: Shield, title: 'Ropa y seguro', description: 'La ropa de trabajo suele proporcionarse; puede haber depósito reembolsable. El seguro médico de viaje es obligatorio.' },
]

export default function WinterWorkAndTravelAlemania() {
  const program = getCulturalProgram('work-and-travel-alemania')
  const path = '/winter-work-and-travel-alemania'
  const breadcrumbs = [{ label: 'Inicio', to: '/' }, { label: 'Winter Work and Travel Alemania' }]

  return (
    <>
      <Seo
        title="Winter Work and Travel Alemania — Programa de invierno 2026"
        description="Toda la información oficial del programa de invierno Work and Travel en Alemania: salario mínimo, horas garantizadas, alojamiento, nómina, anticipos y logística de llegada."
        path={path}
        image="https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/GER_Rothenburg_ob_der_Tauber%2C_Marktplatz_001.jpg/1280px-GER_Rothenburg_ob_der_Tauber%2C_Marktplatz_001.jpg"
        imageAlt="Casas de colores en la plaza del mercado de Rothenburg ob der Tauber, Alemania"
        jsonLd={breadcrumbJsonLd(breadcrumbs, path)}
      />

      <section className="relative overflow-hidden bg-ink">
        <div className="absolute inset-0" aria-hidden="true">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/GER_Rothenburg_ob_der_Tauber%2C_Marktplatz_001.jpg/1280px-GER_Rothenburg_ob_der_Tauber%2C_Marktplatz_001.jpg"
            alt="Casas de colores en la plaza del mercado de Rothenburg ob der Tauber, Alemania"
            fetchPriority="high"
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/20" />
          <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[#1c1c1c] via-[#1c1c1c]/70 to-transparent" />
        </div>

        <Container className="relative flex flex-col items-start gap-7 py-16 text-left sm:py-20 lg:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand backdrop-blur">
            <Sparkles className="size-3.5" />
            Programa de invierno 2026
          </span>

          <h1 className="text-balance max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Winter Work and <span className="text-brand">Travel Alemania</span>
          </h1>

          <p className="max-w-xl text-balance text-base text-white/70 sm:text-lg">
            {program?.tagline ?? 'Gana en euros, vive en Europa y conviértete en protagonista de tu propia historia de intercambio.'}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <CTAButton to="/work-and-travel-alemania">Quiero inscribirme</CTAButton>
            <CTAButton href={whatsappLink('¡Hola! Vi la página de Winter Work and Travel Alemania y tengo dudas.')} variant="ghost">
              Escríbenos por WhatsApp
            </CTAButton>
          </div>

          <div className="grid w-full grid-cols-1 gap-3 pt-2 sm:max-w-2xl sm:grid-cols-3 sm:gap-4">
            {minConditions.map(({ Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand">
                  <Icon className="size-4.5" />
                </span>
                <div>
                  <p className="text-lg font-extrabold text-white">{value}</p>
                  <p className="text-[11px] font-medium text-white/60">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="relative py-14 sm:py-20">
        <Container className="flex flex-col items-center gap-14">
          <SectionHeading
            eyebrow="Condiciones del programa"
            title="Las condiciones mínimas del programa"
            description="Lo que está garantizado y la disponibilidad esperada."
          />
          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-3">
            {minConditions.map(({ Icon, value, label, note }) => (
              <div key={label} className="flex flex-col items-start gap-3 rounded-3xl border border-white/10 bg-ink-800 p-6">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-brand text-white">
                  <Icon className="size-5" />
                </span>
                <p className="text-2xl font-extrabold text-white">{value}</p>
                <p className="text-sm font-semibold text-white/70">{label}</p>
                <p className="text-xs leading-relaxed text-white/50">{note}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-white/50">
            Edad: máximo 34 años al comenzar (es posible cumplir 35 durante el empleo). Todos deben estar disponibles para trabajar por turnos.
          </p>
        </Container>
      </section>

      <section className="relative overflow-hidden py-14 sm:py-20">
        <GradientBlob tone="brand" className="left-[-10%] top-10 size-72 sm:size-96" />
        <Container className="relative flex flex-col items-center gap-14">
          <SectionHeading
            eyebrow="Proceso"
            title="Cómo funciona la selección"
            description="Puedes indicar preferencias, pero no se garantiza un puesto o lugar concreto."
          />
          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {selectionSteps.map(({ Icon, title, description }, index) => (
              <div key={title} className="group flex flex-col items-start gap-4 rounded-3xl border border-white/10 bg-ink-800 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40">
                <span className="flex size-9 items-center justify-center rounded-xl bg-brand/15 text-xs font-bold text-brand">{`0${index + 1}`}</span>
                <span className="flex size-11 items-center justify-center rounded-2xl bg-brand text-white">
                  <Icon className="size-5" />
                </span>
                <h3 className="text-base font-bold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-white/70">{description}</p>
              </div>
            ))}
          </div>
          <p className="max-w-2xl text-center text-sm text-white/50">
            No reserves vuelos hasta que tu empresa y BBBSC hayan confirmado y coordinado tu asignación.
          </p>
        </Container>
      </section>

      <section className="relative py-14 sm:py-20">
        <Container className="flex flex-col items-center gap-14">
          <SectionHeading
            eyebrow="Ofertas de trabajo"
            title="Ejemplos actuales de trabajo"
            description="La asignación exacta depende de la empresa, el lugar, la demanda y tu perfil."
          />
          <div className="flex flex-wrap justify-center gap-3">
            {program?.jobExamples?.map((job, index) => {
              const Icon = jobExampleIcons[job] ?? Briefcase
              return (
                <span
                  key={job}
                  style={{ animationDelay: `${index * 70}ms` }}
                  className="group flex animate-[fadeInUp_0.5s_ease-out_both] items-center gap-2 rounded-full border border-white/10 bg-ink-800 px-4 py-2.5 text-xs font-semibold text-white/80 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:bg-brand/10 hover:text-white"
                >
                  <Icon className="size-4 text-brand transition-transform duration-300 group-hover:scale-110" />
                  {job}
                </span>
              )
            })}
          </div>
          <p className="max-w-2xl text-center text-xs leading-relaxed text-white/50">
            Los proyectos de aeropuerto suelen exigir inglés B1 como mínimo; en general se recomienda A2. El alemán nunca es obligatorio. Algunos
            trabajos de producción no exigen idioma. Muchas tareas requieren estar de pie, caminar, levantar peso o repetir movimientos.
          </p>
        </Container>
      </section>

      <section className="relative py-14 sm:py-20">
        <Container className="flex flex-col items-center gap-14">
          <SectionHeading
            eyebrow="Jornada"
            title="Horas de trabajo y rendimiento"
            description="Planificación habitual y experiencia histórica: las horas adicionales no se garantizan."
          />
          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-3">
            {workloadStats.map(({ value, label, note }) => (
              <div key={label} className="flex flex-col items-start gap-2 rounded-3xl border border-white/10 bg-ink-800 p-6">
                <p className="text-2xl font-extrabold text-white">{value}</p>
                <p className="text-sm font-semibold text-white/70">{label}</p>
                <p className="text-xs leading-relaxed text-white/50">{note}</p>
              </div>
            ))}
          </div>
          <p className="max-w-2xl text-center text-sm text-white/50">
            Las pausas no se pagan. Todas las empresas usan cuentas de tiempo. La demanda, los turnos disponibles y un buen rendimiento pueden
            generar más trabajo, sin garantía.
          </p>
        </Container>
      </section>

      <section className="relative overflow-hidden py-14 sm:py-20">
        <GradientBlob tone="brand" className="right-[-10%] bottom-10 size-72 sm:size-96" />
        <Container className="relative flex flex-col items-center gap-14">
          <SectionHeading
            eyebrow="Alojamiento"
            title="Alojamiento compartido organizado"
            description="El precio y la distribución exactos se confirman por separado para cada proyecto."
          />
          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-3">
            {accommodationStats.map(({ value, label, note }) => (
              <div key={label} className="flex flex-col items-start gap-2 rounded-3xl border border-white/10 bg-ink-800 p-6">
                <p className="text-2xl font-extrabold text-white">{value}</p>
                <p className="text-sm font-semibold text-white/70">{label}</p>
                <p className="text-xs leading-relaxed text-white/50">{note}</p>
              </div>
            ))}
          </div>
          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-ink-800 p-5">
              <h3 className="text-sm font-bold text-white">Reserva y pago</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Se reserva por todo el periodo autorizado o disponible y normalmente se paga incluso con salida anticipada. Se descuenta del
                salario, nunca por adelantado.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-ink-800 p-5">
              <h3 className="text-sm font-bold text-white">Habitaciones y amigos</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Las individuales son raras. Se intenta alojar a los amigos juntos y separar a hombres y mujeres, pero no se garantiza.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="relative py-14 sm:py-20">
        <Container className="flex flex-col items-center gap-14">
          <SectionHeading
            eyebrow="Pagos"
            title="Nómina, impuestos y anticipos"
            description="El primer salario regular llega después del primer periodo completo de nómina."
          />
          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {payrollSteps.map(({ Icon, title, description }, index) => (
              <div key={title} className="group flex flex-col items-start gap-4 rounded-3xl border border-white/10 bg-ink-800 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40">
                <span className="flex size-9 items-center justify-center rounded-xl bg-brand/15 text-xs font-bold text-brand">{`0${index + 1}`}</span>
                <span className="flex size-11 items-center justify-center rounded-2xl bg-brand text-white">
                  <Icon className="size-5" />
                </span>
                <h3 className="text-base font-bold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-white/70">{description}</p>
              </div>
            ))}
          </div>
          <p className="max-w-2xl text-center text-sm text-white/50">
            Al menos 3 anticipos son gratuitos. La mayoría no cobra más anticipos; unas pocas empresas cobran 15 EUR. Se descuentan de la nómina
            si hay saldo suficiente.
          </p>
        </Container>
      </section>

      <section className="relative py-14 sm:py-20">
        <Container className="flex flex-col items-center gap-14">
          <SectionHeading
            eyebrow="Presupuesto"
            title="Ejemplo orientativo con 173 horas"
            description="Ejemplo de referencia; no garantiza salario ni ahorro."
          />
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-brand/40 bg-ink-800 shadow-[0_0_60px_-15px_rgba(249,176,0,0.35)]">
            <div className="flex flex-col items-center gap-1.5 border-b border-white/10 p-8 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-white/50">Posible importe restante</span>
              <span className="animate-[price-glow_2.6s_ease-in-out_infinite] text-4xl font-extrabold text-white sm:text-5xl">1.371-1.451 EUR</span>
              <p className="mt-2 max-w-md text-xs leading-relaxed text-white/50">
                El ejemplo supone un impuesto salarial del 12-15%, alquiler de 550 EUR y 333 EUR para comida, Deutschland-Ticket y tarjeta SIM. El
                gasto personal varía.
              </p>
            </div>
            <div className="flex flex-col divide-y divide-white/10">
              {budgetLines.map((line) => (
                <div
                  key={line.label}
                  className={`flex items-center justify-between gap-4 px-6 py-4 text-sm ${
                    line.tone === 'subtotal' ? 'bg-black/20 font-bold text-white' : 'text-white/70'
                  }`}
                >
                  <span>{line.label}</span>
                  <span className={line.tone === 'negative' ? 'text-white/50' : line.tone === 'subtotal' ? 'text-brand' : 'font-semibold text-white'}>
                    {line.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="max-w-2xl text-center text-sm text-white/50">
            Las horas, impuestos, alquiler, beneficios, anticipos y decisiones personales cambian el resultado. Si es posible, prevé 250-450 EUR
            hasta el primer anticipo.
          </p>
        </Container>
      </section>

      <section className="relative py-14 sm:py-20">
        <Container className="flex flex-col items-center gap-14">
          <SectionHeading
            eyebrow="Logística"
            title="Llegada, primer día y salida"
            description="Las fechas y la organización exactas se coordinan por separado para cada proyecto."
          />
          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-3">
            {arrivalSteps.map(({ Icon, title, description }, index) => (
              <div key={title} className="flex flex-col items-start gap-4 rounded-3xl border border-white/10 bg-ink-800 p-6">
                <span className="flex size-9 items-center justify-center rounded-xl bg-brand/15 text-xs font-bold text-brand">{index + 1}</span>
                <span className="flex size-11 items-center justify-center rounded-2xl bg-brand text-white">
                  <Icon className="size-5" />
                </span>
                <h3 className="text-base font-bold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-white/70">{description}</p>
              </div>
            ))}
          </div>
          <p className="max-w-2xl text-center text-sm text-white/50">
            Los viajes de ida y vuelta a Alemania se pagan personalmente. Tras la llegada se abre una cuenta UE en línea; te enviamos varios
            enlaces para elegir.
          </p>
        </Container>
      </section>

      <section className="relative py-14 sm:py-20">
        <Container className="flex flex-col items-center gap-14">
          <SectionHeading
            eyebrow="Detalles"
            title="Elementos según el proyecto"
            description="Estos elementos varían. Se incluyen solo cuando están confirmados por escrito para tu proyecto."
          />
          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {projectItems.map(({ Icon, title, description }) => (
              <div key={title} className="flex flex-col items-start gap-4 rounded-3xl border border-white/10 bg-ink-800 p-6">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-brand text-white">
                  <Icon className="size-5" />
                </span>
                <h3 className="text-base font-bold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-white/70">{description}</p>
              </div>
            ))}
          </div>
          <p className="max-w-2xl text-center text-xs leading-relaxed text-white/50">
            Las vacaciones acumuladas no usadas se pagan al final. Daños, llaves perdidas o limpieza excepcional pueden descontarse. Solo la
            información escrita es vinculante.
          </p>
        </Container>
      </section>

      <section className="relative overflow-hidden py-16 sm:py-24">
        <GradientBlob tone="brand" className="left-1/2 top-0 size-96 -translate-x-1/2" />
        <Container className="relative flex flex-col items-center gap-6 text-center">
          <h2 className="text-balance max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            ¿Listo para vivir tu Winter Work and Travel en Alemania?
          </h2>
          <p className="max-w-xl text-balance text-white/70">
            Un asesor te acompaña desde la inscripción hasta tu regreso: requisitos, documentos, asignación y logística de viaje.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <CTAButton to="/work-and-travel-alemania">Quiero inscribirme</CTAButton>
            <CTAButton href={whatsappLink('¡Hola! Quiero más información sobre Winter Work and Travel Alemania.')} variant="ghost">
              Escríbenos por WhatsApp
            </CTAButton>
          </div>
          <p className="max-w-xl text-xs text-white/40">
            Las condiciones varían según la empresa y el proyecto. Solo son vinculantes la asignación escrita, el contrato y la información del
            alojamiento. {SITE.name}, {new Date().getFullYear()}.
          </p>
        </Container>
      </section>
    </>
  )
}
