const coreFields = [
  { key: 'firstName', label: 'Nombre', defaultTarget: 'standard:first_name' },
  { key: 'lastName', label: 'Apellidos', defaultTarget: 'standard:last_name' },
  { key: 'email', label: 'Correo electrónico', defaultTarget: 'standard:email' },
  { key: 'phone', label: 'Teléfono', defaultTarget: 'standard:phone' },
  { key: 'interestTag', label: 'Etiqueta de interés (oculta)', defaultTarget: 'standard:tags' },
  { key: 'message', label: 'Mensaje de origen (oculto)', defaultTarget: 'standard:message' },
  { key: 'contactSource', label: 'Origen del contacto (oculto)', defaultTarget: 'standard:contact_source' },
]

const registrationFields = [
  ...coreFields,
  { key: 'fechaNacimiento', label: 'Fecha de nacimiento', defaultTarget: 'standard:birthday' },
  { key: 'cedula', label: 'Cédula', defaultTarget: 'custom:Personal 2 - Cedula' },
  { key: 'pasaporte', label: 'Estado del pasaporte', defaultTarget: 'custom:Status - Pasaporte' },
  { key: 'numeroPasaporte', label: 'Número de pasaporte', defaultTarget: 'custom:Personal 2 - Numero pasaporte' },
  { key: 'nivelIngles', label: 'Nivel de inglés', defaultTarget: 'custom:Academia - Nivel de Ingles' },
  { key: 'participacionPrevia', label: 'Participación previa SWT', defaultTarget: 'custom:SWT - SWT previos' },
  { key: 'numeroParticipaciones', label: 'Número de SWT previos', defaultTarget: 'custom:BBB - Numero de SWT previos' },
  { key: 'visaAplicada', label: 'Visas previas', defaultTarget: 'custom:Personal 2 - Visas Previas' },
  { key: 'visaNegada', label: 'Visas negadas', defaultTarget: 'custom:Personal 2 - Visas negadas' },
  { key: 'condicionMedica', label: 'Condición médica', defaultTarget: 'custom:Personal 1 - Condicion medica preexistente' },
  { key: 'alergias', label: 'Alergias', defaultTarget: 'custom:Personal 2 - Alergias' },
  { key: 'restriccionPeso', label: 'Restricciones al cargar peso', defaultTarget: 'custom:Personal 2 - Restricciones al cargar peso' },
  { key: 'condicionFisicaMental', label: 'Condiciones físicas o mentales', defaultTarget: 'custom:Personal 2 - Condiciones pre existentes físicas o mentales' },
  { key: 'nivelAcademico', label: 'Formación académica', defaultTarget: 'custom:Personal 2 - Formacion Academica' },
  { key: 'programaAcademico', label: 'Carrera universitaria', defaultTarget: 'custom:BBB Travels - Carrera Universitaria' },
  { key: 'jornadaAcademica', label: 'Jornada académica', defaultTarget: 'custom:Personal 2 - Jornada Academica' },
  { key: 'departamentoNacimiento', label: 'Departamento de nacimiento', defaultTarget: 'custom:Personal 2 - Departamento de nacimiento' },
  { key: 'municipioNacimiento', label: 'Ciudad de nacimiento', defaultTarget: 'custom:Personal 2 - Ciudad de Nacimiento' },
  { key: 'nombrePadre', label: 'Nombre del padre', defaultTarget: 'custom:Personal 3 - Nombre completo del Padre' },
  { key: 'telefonoPadre', label: 'Teléfono del padre', defaultTarget: 'custom:Personal 3 - Telefono Padre' },
  { key: 'nombreMadre', label: 'Nombre de la madre', defaultTarget: 'custom:Personal 3 - Nombre Completo de la Madre' },
  { key: 'telefonoMadre', label: 'Teléfono de la madre', defaultTarget: 'custom:Personal 3 - Telefono de la Madre' },
  { key: 'familiaresEEUU', label: 'Familiares en Estados Unidos', defaultTarget: 'custom:Personal 3 - Familiares en estados Unidos' },
  { key: 'semestre', label: 'Semestre', defaultTarget: 'custom:Personal 2 - Semestre' },
  { key: 'fechaGrado', label: 'Fecha tentativa de grado', defaultTarget: 'custom:Personal 2 - Fecha de grado (Tentativa)' },
  { key: 'universidadCompuesta', label: 'Universidad y ubicación', defaultTarget: 'standard:company' },
  { key: 'programaActual', label: 'Programa actual (oculto)', defaultTarget: 'custom:BBB - Programa actual' },
  { key: 'tipoVisa', label: 'Tipo de visa (oculto)', defaultTarget: 'custom:Visado - Tipo de visa a solicitar' },
  { key: 'terminosYCondiciones', label: 'Términos y condiciones', defaultTarget: 'custom:BBB - Terminos Y Condiciones' },
]

const asiaRegistrationFields = [
  ...registrationFields
    .filter(({ key }) => !['semestre', 'fechaGrado'].includes(key))
    .map((field) => {
      if (field.key === 'participacionPrevia') return { ...field, label: 'Participación previa en Asia', defaultTarget: 'ignore' }
      if (field.key === 'numeroParticipaciones') return { ...field, label: 'Número de programas previos en Asia', defaultTarget: 'ignore' }
      if (field.key === 'familiaresEEUU') return { ...field, label: 'Familiares en Asia', defaultTarget: 'ignore' }
      return field
    }),
  { key: 'tiempoExperiencia', label: 'Tiempo de experiencia laboral', defaultTarget: 'ignore' },
  { key: 'areaExperiencia', label: 'Área de experiencia laboral', defaultTarget: 'ignore' },
  { key: 'cargoExperiencia', label: 'Cargo desempeñado', defaultTarget: 'ignore' },
  { key: 'empresaExperiencia', label: 'Empresa de la experiencia', defaultTarget: 'ignore' },
  { key: 'disponibilidadViaje', label: 'Disponibilidad para viajar', defaultTarget: 'ignore' },
]

const offerApplicationFields = [
  { key: 'firstName', label: 'Nombre del participante', defaultTarget: 'standard:first_name' },
  { key: 'lastName', label: 'Apellidos del participante', defaultTarget: 'standard:last_name' },
  { key: 'email', label: 'Correo del participante', defaultTarget: 'standard:email' },
  { key: 'travelStartDate', label: 'Fecha prevista de inicio del viaje', defaultTarget: 'ignore' },
  { key: 'travelEndDate', label: 'Fecha prevista de regreso', defaultTarget: 'ignore' },
  { key: 'offerName', label: 'Oferta elegida', defaultTarget: 'ignore' },
  { key: 'clientifyProductName', label: 'Producto enlazado', defaultTarget: 'ignore' },
  { key: 'interestTag', label: 'Etiqueta de oferta elegida (oculta)', defaultTarget: 'standard:tags' },
  { key: 'message', label: 'Mensaje de aplicación (oculto)', defaultTarget: 'standard:message' },
  { key: 'contactSource', label: 'Origen del contacto (oculto)', defaultTarget: 'standard:contact_source' },
]

const programs = [
  ['cultural_trainee-and-internship', 'Trainee and Internship USA', 'trainee_and_internship'],
  ['cultural_espana-ti', 'Trainee & Internship España', 'espana_ti'],
  ['cultural_asia', 'Trainee & Internship Asia', 'asia'],
  ['cultural_teacher-exchange', 'Teacher Exchange', 'teacher_exchange'],
  ['cultural_teacher-assistant', 'Teacher Assistant', 'teacher_assistant'],
  ['cultural_aupair', 'Au Pair', 'au_pair'],
  ['academic_canada', 'Estudia en Canadá', 'canada'],
  ['academic_polonia', 'Estudia en Polonia', 'polonia'],
  ['academic_australia', 'Estudia en Australia', 'australia'],
  ['academic_portugal', 'Trainee & Internship Portugal', 'portugal'],
  ['university_troy-university', 'Troy University', 'troy_university'],
  ['university_gisma-university', 'GISMA University', 'gisma_university'],
  ['university_woosong-university', 'Woosong University', 'woosong_university'],
  ['university_vistula', 'Vistula University', 'vistula_university'],
  ['university_cape-breton', 'Cape Breton University', 'cape_breton_university'],
]

export const FORM_DEFINITIONS = [
  {
    key: 'offer_application',
    label: 'Aplicación · Oferta de empleo',
    title: 'Aplicación a oferta de empleo',
    interestTag: 'oferta_elegida',
    source: 'Portal de ofertas BBBSC',
    fields: offerApplicationFields,
  },
  {
    key: 'registration_work-and-travel-usa',
    label: 'Inscripción · Work and Travel USA',
    title: 'Work and Travel USA',
    interestTag: 'interesado_work_and_travel_usa',
    source: 'Formulario Web - Inscripción Work and Travel USA',
    programTag: 'work-and-travel-usa',
    visaType: 'J1',
    fields: registrationFields,
  },
  {
    key: 'registration_asia',
    label: 'Inscripción · Trainee & Internship Asia',
    title: 'Trainee & Internship Asia',
    interestTag: 'interesado_asia',
    source: 'Formulario Web - Inscripción Trainee & Internship Asia',
    programTag: 'asia',
    visaType: 'Según destino',
    fields: asiaRegistrationFields,
  },
  ...programs.map(([key, title, tag]) => ({
    key,
    label: `Interés · ${title}`,
    title,
    interestTag: `interesado_${tag}`,
    source: `Formulario Web - ${title}`,
    fields: coreFields,
  })),
]

export function getFormDefinition(key) {
  return FORM_DEFINITIONS.find((form) => form.key === key)
}

export function defaultMappings(form) {
  return Object.fromEntries(form.fields.map((field) => [field.key, field.defaultTarget]))
}
