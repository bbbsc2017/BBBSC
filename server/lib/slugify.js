const DIACRITICS_REGEX = new RegExp('[\\u0300-\\u036f]', 'g')

export function slugify(text) {
  return String(text)
    .normalize('NFD')
    .replace(DIACRITICS_REGEX, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function uniqueSlug(baseSlug, slugExists) {
  let candidate = baseSlug
  let attempt = 2
  while (slugExists(candidate)) {
    candidate = `${baseSlug}-${attempt}`
    attempt += 1
  }
  return candidate
}
