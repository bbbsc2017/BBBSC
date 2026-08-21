import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  BadgeDollarSign,
  Building2,
  CalendarDays,
  Check,
  Clock3,
  FileText,
  House,
  Languages,
  MapPin,
  Plane,
  Sparkles,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Seo } from "../components/Seo";
import { Container } from "../components/ui/Container";
import { SubmittingOverlay } from "../components/ui/SubmittingOverlay";
import { OfferCountdown } from "../components/offers/OfferCountdown";
import { OfferGallery } from "../components/offers/OfferGallery";
import {
  compensationLabel,
  isOfferAvailable,
  offerPath,
  pathSlug,
  programLabel,
  type JobOffer,
} from "../lib/offers";
import { apiCredentials, apiUrl } from "../lib/apiBase";

interface Session {
  user: { id: string; role: string; firstName: string };
}
interface Application {
  id: number;
  travelStartDate?: string;
  travelEndDate?: string;
  clientifySyncStatus?: string;
  offer: JobOffer;
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <Icon className="mb-3 size-5 text-brand" />
      <p className="text-[10px] font-bold uppercase tracking-wider text-white/35">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-white">{value}</p>
    </div>
  );
}

export default function OfferDetail() {
  const { program = "", sponsor = "", slug = "" } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<JobOffer | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [applyOpen, setApplyOpen] = useState(false);
  const [travelStartDate, setTravelStartDate] = useState("");
  const [travelEndDate, setTravelEndDate] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!applyOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !applying) setApplyOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [applyOpen, applying]);

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(apiUrl(`/api/offers/${encodeURIComponent(slug)}`), { credentials: apiCredentials })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.ok) throw new Error(data.error);
        return data.offer as JobOffer;
      })
      .then((item) => {
        setOffer(item);
        const canonical = offerPath(item);
        if (item.program !== program || pathSlug(item.sponsor) !== sponsor)
          navigate(canonical, { replace: true });
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Oferta no encontrada."),
      )
      .finally(() => setLoading(false));
    fetch(apiUrl("/api/auth/me"), { credentials: apiCredentials })
      .then(async (response) => {
        if (!response.ok) return null;
        return response.json();
      })
      .then((data) => {
        if (!data?.id) return;
        setSession({
          user: {
            id: data.id,
            role: data.roles?.[0] ?? "",
            firstName: data.firstName ?? "",
          },
        });
        fetch(apiUrl("/api/offers/me"), { credentials: apiCredentials })
          .then((response) => (response.ok ? response.json() : null))
          .then((own) => own?.ok && setApplication(own.application))
          .catch(() => undefined);
      })
      .catch(() => undefined);
  }, [navigate, program, slug, sponsor]);

  async function apply(event: FormEvent) {
    event.preventDefault();
    if (!offer) return;
    if (!applyOpen) {
      setApplyOpen(true);
      setError("");
      setMessage("");
      return;
    }
    setApplying(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(apiUrl(`/api/offers/${offer.id}/apply`), {
        method: "POST",
        credentials: apiCredentials,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ travelStartDate, travelEndDate }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error);
      setApplication(data.application);
      setOffer(data.application.offer);
      setApplyOpen(false);
      setMessage(
        "¡Felicidades! Tu postulación quedó registrada. Ponte en contacto con tu gurú para continuar con tu proceso.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No pudimos registrar tu inscripción.",
      );
    } finally {
      setApplying(false);
    }
  }

  if (loading)
    return (
      <div className="bbb-grid-bg min-h-[70vh] py-24">
        <Container>
          <div className="h-[520px] animate-pulse rounded-[2rem] bg-white/5" />
        </Container>
      </div>
    );
  if (!offer)
    return (
      <div className="bbb-grid-bg min-h-[65vh] py-24">
        <Container className="text-center">
          <h1 className="text-3xl font-black">Oferta no encontrada</h1>
          <p className="mt-3 text-white/50">{error}</p>
          <Link
            to="/ofertas"
            className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 font-bold text-ink"
          >
            Volver a ofertas
          </Link>
        </Container>
      </div>
    );
  const isParticipant = session?.user.role === "STUDENT";
  const ownOffer = application?.offer.id === offer.id;
  const hasOtherOffer = Boolean(application && !ownOffer);
  const available = isOfferAvailable(offer, now);
  // El visor siempre usa el proxy del mismo dominio. No usamos directamente
  // pdfViewUrl porque la API central puede responder desde api.bbbsc.com y su
  // CSP impide que ese dominio se inserte en un iframe de bbbsc.com.
  const localPdfViewUrl = `/api/offers/${encodeURIComponent(offer.slug)}/pdf`;
  const localNow = new Date(now);
  const today = new Date(
    localNow.getTime() - localNow.getTimezoneOffset() * 60_000,
  )
    .toISOString()
    .slice(0, 10);

  return (
    <>
      <Seo
        title={`${offer.title} en ${offer.employer}`}
        description={`Oferta de ${programLabel(offer.program)} en ${offer.city}, ${offer.state}. ${compensationLabel(offer)}. Consulta requisitos, beneficios y vacantes.`}
        path={offerPath(offer)}
        image={offer.imageSrc || undefined}
        imageAlt={
          offer.imageSrc
            ? `${offer.title} con ${offer.employer} en ${offer.city}, ${offer.state}`
            : undefined
        }
        jsonLd={
          available
            ? {
                "@context": "https://schema.org",
                "@type": "JobPosting",
                title: offer.title,
                description:
                  offer.description ||
                  `Oportunidad de ${programLabel(offer.program)} con ${offer.employer}.`,
                datePosted: offer.createdAt,
                validThrough: offer.availableUntil,
                employmentType: "TEMPORARY",
                hiringOrganization: {
                  "@type": "Organization",
                  name: offer.employer,
                },
                jobLocation: {
                  "@type": "Place",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: offer.city,
                    addressRegion: offer.state,
                  },
                },
                baseSalary: {
                  "@type": "MonetaryAmount",
                  currency: offer.compensationCurrency,
                  value: {
                    "@type": "QuantitativeValue",
                    minValue: offer.compensationMin,
                    maxValue: offer.compensationMax || offer.compensationMin,
                    unitText: offer.compensationPeriod.toUpperCase(),
                  },
                },
                directApply: true,
                url: `https://bbbsc.com${offerPath(offer)}`,
              }
            : {
                "@context": "https://schema.org",
                "@type": "WebPage",
                name: `${offer.title} en ${offer.employer}`,
                description:
                  offer.description ||
                  `Oportunidad de ${programLabel(offer.program)} con ${offer.employer}.`,
                url: `https://bbbsc.com${offerPath(offer)}`,
              }
        }
      />
      <div className="bbb-grid-bg pb-20 pt-8 sm:pt-12">
        <Container>
          <Link
            to={`/ofertas/${offer.program}`}
            className="inline-flex items-center text-sm font-bold text-white/50 hover:text-brand"
          >
            <ArrowLeft className="mr-2 size-4" />
            Volver a {programLabel(offer.program)}
          </Link>
          <section className="mt-6 grid overflow-hidden rounded-[2rem] border border-white/10 bg-ink-800 lg:grid-cols-[1.15fr_.85fr]">
            <div className="relative min-h-72 sm:min-h-[470px]">
              <OfferGallery
                images={offer.images?.length ? offer.images : [offer.imageSrc]}
                alt={`${offer.title} en ${offer.employer}, ${offer.city}`}
              />
              <span className="absolute left-5 top-5 rounded-full bg-ink/80 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-brand backdrop-blur">
                {programLabel(offer.program)}
              </span>
            </div>
            <div className="flex flex-col p-6 sm:p-9">
              <p className="text-xs font-extrabold uppercase tracking-[.2em] text-brand">
                {offer.sponsor}
              </p>
              <h1 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">
                {offer.title}
              </h1>
              <p className="mt-3 text-lg font-bold text-white/60">
                {offer.employer}
              </p>
              <p className="mt-5 flex items-center text-sm text-white/50">
                <MapPin className="mr-2 size-4 text-brand" />
                {offer.city}, {offer.state}
              </p>
              <div className="mt-7 rounded-2xl bg-white/[0.045] p-5">
                <p className="text-xs uppercase tracking-wider text-white/35">
                  {offer.compensationType === "stipend"
                    ? "Estipendio"
                    : "Salario"}
                </p>
                <p className="mt-1 text-2xl font-black text-brand">
                  {compensationLabel(offer)}
                </p>
              </div>
              <div className="mt-6">
                {ownOffer ? (
                  <div className="rounded-2xl bg-emerald-400/10 p-4 text-sm font-bold text-emerald-300">
                    <Check className="mr-2 inline size-5" />
                    Ya estás inscrito en esta oferta.
                  </div>
                ) : hasOtherOffer ? (
                  <div className="rounded-2xl bg-amber-300/10 p-4 text-sm text-amber-200">
                    Ya tienes asignada la oferta{" "}
                    <Link
                      to={offerPath(application!.offer)}
                      className="font-extrabold underline"
                    >
                      {application!.offer.title}
                    </Link>
                    . Puedes consultar esta, pero no aplicar de nuevo.
                  </div>
                ) : !available ? (
                  <div className="rounded-2xl bg-red-400/10 p-4 text-center">
                    <button
                      type="button"
                      disabled
                      className="w-full rounded-full bg-white/10 px-6 py-4 text-sm font-black text-white/45"
                    >
                      No disponible
                    </button>
                    <p className="mt-3 text-xs leading-5 text-red-200/70">
                      Puedes revisar toda la información, pero esta oferta ya no
                      recibe aplicaciones.
                    </p>
                  </div>
                ) : !session ? (
                  <a
                    href="/perfil"
                    className="block rounded-full bg-brand px-6 py-4 text-center text-sm font-black text-ink transition hover:-translate-y-0.5"
                  >
                    Ir al portal para aplicar
                  </a>
                ) : !isParticipant ? (
                  <button
                    disabled
                    className="w-full rounded-full bg-white/10 px-6 py-4 text-sm font-black text-white/35"
                  >
                    Solo participantes activos
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={applying}
                    onClick={apply}
                    className="w-full rounded-full bg-brand px-6 py-4 text-sm font-black text-ink transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
                  >
                    {applying ? "Registrando..." : "Aplicar a esta oferta"}
                  </button>
                )}
              </div>
              {message && (
                <p className="mt-4 rounded-xl bg-emerald-400/10 p-3 text-sm text-emerald-300">
                  {message}
                </p>
              )}
              {error && (
                <p className="mt-4 rounded-xl bg-red-400/10 p-3 text-sm text-red-300">
                  {error}
                </p>
              )}
              <p className="mt-auto pt-6 text-xs leading-5 text-white/35">
                {available
                  ? "Solo puedes mantener una oferta activa. Antes de aplicar, revisa cuidadosamente sus condiciones."
                  : "Esta oferta se conserva como referencia aunque su periodo de aplicación haya finalizado."}
              </p>
            </div>
          </section>
          <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px]">
            <div>
              <h2 className="text-2xl font-black">
                Detalles de la oportunidad
              </h2>
              <div className="mt-5 rounded-3xl border border-white/10 bg-ink-800 p-6 sm:p-8">
                <h3 className="text-xl font-black">Descripción</h3>
                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-white/60">
                  {offer.description ||
                    "Consulta con tu asesor BBBSC para conocer todos los detalles de esta oportunidad."}
                </p>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Fact
                  icon={Building2}
                  label="Tipo de oferta"
                  value={offer.offerType}
                />
                <Fact
                  icon={Languages}
                  label="Nivel de inglés"
                  value={offer.englishLevel}
                />
                <Fact
                  icon={Users}
                  label="Vacantes disponibles"
                  value={`${offer.vacanciesAvailable} de ${offer.vacanciesTotal}`}
                />
                <Fact
                  icon={Plane}
                  label="Airport pickup"
                  value={
                    offer.airportPickup ? "Sí está incluido" : "No incluido"
                  }
                />
                <Fact
                  icon={Clock3}
                  label="Horas extra"
                  value={offer.overtime ? "Sí hay posibilidad" : "No informado"}
                />
                <Fact
                  icon={BadgeDollarSign}
                  label="Propinas"
                  value={offer.hasTips ? "Sí" : "No"}
                />
                <Fact
                  icon={Building2}
                  label="Empleador"
                  value={offer.employer || "No informado"}
                />
                <Fact
                  icon={House}
                  label="Valor del housing"
                  value={offer.housing || "No informado"}
                />
                <Fact
                  icon={Wallet}
                  label="Depósito del housing"
                  value={offer.deposit || "No informado"}
                />
              </div>
              {offer.bonuses && (
                <div className="mt-8 rounded-3xl border border-white/10 bg-ink-800 p-6 sm:p-8">
                  <div className="rounded-2xl bg-brand/[0.07] p-5">
                    <p className="flex items-center font-bold text-brand">
                      <Sparkles className="mr-2 size-4" />
                      Bonos e incentivos
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/60">
                      {offer.bonuses}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <aside className="rounded-3xl border border-white/10 bg-ink-800 p-6 lg:sticky lg:top-24">
              {offer.hasPdf && (
                <div className="mb-6 border-b border-white/10 pb-6">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand">
                        Documento de la oferta
                      </p>
                      <p className="mt-1 text-xs text-white/45">Vista previa</p>
                    </div>
                    <FileText className="size-5 text-brand" />
                  </div>
                  <div className="relative block h-52 w-full overflow-hidden rounded-2xl bg-ink shadow-lg">
                    <iframe
                      src={`${localPdfViewUrl}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                      title={`Vista previa del PDF de ${offer.title}`}
                      loading="lazy"
                      tabIndex={-1}
                      className="pointer-events-none absolute -inset-y-1 left-0 h-[calc(100%+8px)] w-[calc(100%+18px)] bg-white"
                    />
                    <span className="pointer-events-none absolute inset-0 rounded-2xl ring-[3px] ring-inset ring-ink-800" />
                  </div>
                </div>
              )}
              <CalendarDays className="size-7 text-brand" />
              <h2 className="mt-4 text-lg font-black">Disponible hasta</h2>
              <p className="mt-2 text-white/60">
                {new Intl.DateTimeFormat("es-CO", { dateStyle: "long" }).format(
                  new Date(offer.availableUntil),
                )}
              </p>
              <div
                className={`mt-5 flex items-center rounded-xl p-3 text-sm font-bold ${available ? "bg-emerald-400/10 text-emerald-300" : "bg-red-400/10 text-red-300"}`}
              >
                {available ? (
                  <Check className="mr-2 size-4" />
                ) : (
                  <X className="mr-2 size-4" />
                )}
                {available ? "Recibiendo aplicaciones" : "No disponible"}
              </div>
              <div
                className={`mt-3 rounded-xl border px-3 py-3 text-xs ${available ? "border-emerald-400/20 bg-emerald-400/[0.06]" : "border-red-400/15 bg-red-400/[0.05]"}`}
              >
                <OfferCountdown
                  availableUntil={offer.availableUntil}
                  available={available}
                />
              </div>
            </aside>
          </section>
        </Container>
      </div>
      {applyOpen && (
        <div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-[#1c1c1c]/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="apply-offer-title"
        >
          <button
            type="button"
            className="absolute inset-0"
            onClick={() => !applying && setApplyOpen(false)}
            aria-label="Cerrar formulario de aplicación"
          />
          <form
            onSubmit={apply}
            className="relative w-full max-w-lg rounded-[2rem] border border-white/15 bg-[#1c1c1c] p-6 shadow-2xl sm:p-8"
          >
            <button
              type="button"
              disabled={applying}
              onClick={() => setApplyOpen(false)}
              className="absolute right-5 top-5 rounded-full border border-white/10 p-2 text-white/50 transition hover:border-brand/40 hover:text-brand disabled:opacity-40"
              aria-label="Cerrar"
            >
              <X className="size-5" />
            </button>
            <p className="text-[10px] font-black uppercase tracking-[.2em] text-brand">
              Confirma tus fechas
            </p>
            <h2
              id="apply-offer-title"
              className="mt-3 pr-10 text-2xl font-black"
            >
              Aplicar a {offer.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/50">
              Estas fechas son tentativas y quedarán asociadas a tu perfil y a
              la oportunidad en Clientify.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-bold text-white/65">
                Inicio previsto del viaje
                <input
                  autoFocus
                  required
                  type="date"
                  min={today}
                  value={travelStartDate}
                  onChange={(event) => {
                    setTravelStartDate(event.target.value);
                    if (travelEndDate && travelEndDate <= event.target.value)
                      setTravelEndDate("");
                  }}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#2b2b2b] px-4 py-3 text-sm text-white outline-none transition focus:border-brand"
                />
              </label>
              <label className="text-xs font-bold text-white/65">
                Regreso previsto
                <input
                  required
                  type="date"
                  min={travelStartDate || today}
                  disabled={!travelStartDate}
                  value={travelEndDate}
                  onChange={(event) => setTravelEndDate(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#2b2b2b] px-4 py-3 text-sm text-white outline-none transition focus:border-brand disabled:cursor-not-allowed disabled:opacity-45"
                />
              </label>
            </div>
            <div className="mt-5 rounded-2xl border border-brand/15 bg-brand/[0.06] p-4 text-xs leading-5 text-white/55">
              <strong className="text-white">Revisa antes de confirmar:</strong>{" "}
              solo puedes mantener una oferta activa. ¡Felicidades por aplicar a
              esta oferta! Ponte en contacto con tu gurú para continuar con tu
              proceso.
            </div>
            {error && (
              <p className="mt-4 rounded-xl bg-red-400/10 p-3 text-sm text-red-300">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={applying || !travelStartDate || !travelEndDate}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-brand px-6 py-3.5 text-sm font-black text-ink transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
            >
              {applying ? "Registrando aplicación..." : "Confirmar aplicación"}
            </button>
          </form>
        </div>
      )}
      <SubmittingOverlay show={applying} label="Registrando tu aplicación…" />
    </>
  );
}
