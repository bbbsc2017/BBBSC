import { useId, type ChangeEvent, type ReactNode, type SelectHTMLAttributes, type InputHTMLAttributes } from 'react'
import { Upload } from 'lucide-react'

export const fieldClass =
  'min-h-12 w-full rounded-xl border border-white/15 bg-ink/70 px-4 py-3 text-sm font-normal text-white outline-none transition-[border-color,box-shadow,background-color] placeholder:text-white/35 hover:border-white/25 focus:border-brand focus:bg-ink focus:ring-4 focus:ring-brand/10 disabled:cursor-not-allowed disabled:opacity-50'

export function FormField({ label, hint, required, className = '', children }: { label: string; hint?: string; required?: boolean; className?: string; children: ReactNode }) {
  return (
    <label className={`flex flex-col gap-2 text-sm font-semibold text-white ${className}`}>
      <span>
        {label}
        {required && <span className="ml-1 text-brand" aria-hidden="true">*</span>}
      </span>
      {children}
      {hint && <span className="text-xs font-normal leading-relaxed text-white/45">{hint}</span>}
    </label>
  )
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${fieldClass} ${props.className ?? ''}`} />
}

export function SelectInput({ placeholder, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { placeholder?: string }) {
  return (
    <select {...props} className={`${fieldClass} ${props.className ?? ''}`}>
      <option value="">{placeholder ?? 'Selecciona una opción'}</option>
      {children}
    </select>
  )
}

export function FileInput({ file, onChange, required, accept = 'application/pdf' }: { file: File | null; onChange: (file: File | null) => void; required?: boolean; accept?: string }) {
  const id = useId()

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.files?.[0] ?? null)
  }

  return (
    <label htmlFor={id} className={`${fieldClass} flex cursor-pointer items-center justify-between gap-2`}>
      <span className={`truncate ${file ? 'text-white' : 'text-white/35'}`}>{file ? file.name : 'Sube tu documento'}</span>
      <Upload className="size-4 shrink-0 text-brand" />
      <input id={id} type="file" accept={accept} required={required} onChange={handleChange} className="sr-only" />
    </label>
  )
}
