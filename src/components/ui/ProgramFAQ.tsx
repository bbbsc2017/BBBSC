import { Plus } from 'lucide-react'

interface ProgramFAQProps {
  items: { question: string; answer: string }[]
}

export function ProgramFAQ({ items }: ProgramFAQProps) {
  return (
    <div>
      <h3 className="mb-4 text-base font-bold text-white">Preguntas frecuentes</h3>
      <div className="divide-y divide-white/10 rounded-3xl border border-white/10 bg-ink-800">
        {items.map((item) => (
          <details key={item.question} className="group px-5 py-4 open:pb-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-semibold text-white">
              {item.question}
              <Plus className="size-4 shrink-0 text-brand transition-transform duration-300 group-open:rotate-45" />
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
