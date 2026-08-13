import { Plus } from 'lucide-react'
import { faqItems } from '../../data/faq'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'

export function FAQSection() {
  return (
    <section className="relative py-14 sm:py-20">
      <Container className="flex flex-col items-center gap-14">
        <SectionHeading eyebrow="FAQ" title="Preguntas frecuentes" description="Todo lo que necesitas saber antes de comenzar tu proceso." />

        <div className="w-full max-w-3xl divide-y divide-white/10 rounded-3xl border border-white/10 bg-ink-800">
          {faqItems.map((item) => (
            <details key={item.question} className="group px-6 py-5 open:pb-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-white">
                {item.question}
                <Plus className="size-5 shrink-0 text-brand transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  )
}
