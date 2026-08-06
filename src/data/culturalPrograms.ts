export interface CulturalProgram {
  slug: string
  title: string
  country: string
  tagline: string
  description: string
  cta: string
  requirements: string[]
  benefits: string[]
  duration: string
  keyFacts: string[]
  image: { src: string; alt: string }
}

export const culturalPrograms: CulturalProgram[] = [
  {
    slug: 'work-and-travel-usa',
    title: 'Work and Travel USA',
    country: 'Estados Unidos',
    tagline: 'Trabaja, viaja y practica tu inglés en un solo verano',
    description:
      'Programa de intercambio cultural que permite a estudiantes universitarios trabajar legalmente en empresas estadounidenses durante el verano (hoteles, restaurantes, parques acuáticos, parques de diversiones y resorts), mientras practican inglés en contextos reales y exploran Estados Unidos.',
    cta: 'Viaja y Aprende',
    requirements: [
      'Edad entre 18 y 26 años',
      'Nivel de inglés mínimo B1 (conversacional)',
      'Estudiante universitario de tiempo completo, jornada diurna y modalidad presencial',
      'No se aceptan carreras virtuales ni estudiantes en último semestre',
    ],
    benefits: [
      'Experiencia laboral internacional en el currículum',
      'Práctica diaria del idioma en contexto auténtico',
      'Creación de una red global de contactos',
      'Viaje y exploración cultural de Estados Unidos',
    ],
    duration: 'Aproximadamente 4 meses (15 de mayo a 30 de agosto) + 30 días adicionales para viajar como turista',
    keyFacts: [
      'Visa J-1',
      'Acceso a más de 100 opciones laborales',
      '32 a 40 horas de trabajo semanales',
      'Salario promedio de $10 a $15 USD/hora',
    ],
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/1280px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg',
      alt: 'Vista de Nueva York desde el Rockefeller Center',
    },
  },
  {
    slug: 'trainee-and-internship',
    title: 'Trainee and Internship USA',
    country: 'Estados Unidos',
    tagline: 'Desarrolla tu carrera profesional en un entorno laboral internacional',
    description:
      'Programa de prácticas en empresas internacionales dirigido a estudiantes y recién graduados que buscan desarrollar su carrera en negocios, ingeniería y hotelería, fortaleciendo su perfil profesional en Estados Unidos.',
    cta: '¿Qué Esperas?',
    requirements: [
      'Internship: estudiantes en último semestre o recién graduados (máximo 12 meses post-graduación)',
      'Trainee: mínimo 1 año de experiencia laboral con título universitario, o 5 años sin título',
      'Pasaporte vigente',
      'CV en inglés y certificado de estudios o diploma',
    ],
    benefits: [
      'Mejora del CV con experiencia internacional',
      'Aplicación práctica de conocimientos profesionales',
      'Conexión con profesionales del área',
      'Perfeccionamiento del inglés',
    ],
    duration: '6 a 18 meses según el programa específico',
    keyFacts: ['Visa J-1', 'Sedes en Ibagué y Bucaramanga', 'Áreas: negocios, ingeniería y hotelería'],
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Golden_Gate_Bridge_as_seen_from_Battery_East.jpg/1280px-Golden_Gate_Bridge_as_seen_from_Battery_East.jpg',
      alt: 'Puente Golden Gate en San Francisco, Estados Unidos',
    },
  },
  {
    slug: 'espana-ti',
    title: 'Trainee & Internship España',
    country: 'España',
    tagline: 'Experiencia laboral en hotelería, turismo y gastronomía',
    description:
      'Oportunidad para adquirir experiencia laboral en reconocidos hoteles y restaurantes de España, desarrollando competencias en la industria de la hotelería, el turismo y la gastronomía mientras exploras la cultura del país.',
    cta: 'Vive España',
    requirements: [
      'Edad mínima de 18 años',
      'Estudiante de tiempo completo, profesional graduado o con certificado de educación superior',
      'Profesionales: mínimo 2 años de experiencia laboral',
      'No más de 12 años desde la conclusión de los estudios',
    ],
    benefits: [
      'Asignación garantizada de oferta laboral',
      'Seguro de emergencias médicas',
      'Mejora del perfil profesional',
      'Desarrollo de habilidades en un entorno laboral global',
    ],
    duration: 'Hasta 12 meses en cualquier campo ocupacional',
    keyFacts: ['Sede en Colombia (Ibagué y Bucaramanga)', 'Inscripción disponible en línea'],
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/SF_maig_2_cropped.jpg',
      alt: 'Sagrada Família en Barcelona, España',
    },
  },
  {
    slug: 'asia',
    title: 'Trainee & Internship Asia',
    country: 'Asia',
    tagline: 'Prácticas profesionales de alta categoría en hotelería y turismo',
    description:
      'Oportunidad laboral en el sector de hotelería y turismo en países como Tailandia, Emiratos Árabes e Islas Maldivas. Combina experiencia profesional, intercambio cultural y proyección internacional en establecimientos de alta categoría.',
    cta: 'Explora Asia',
    requirements: [
      'Mínimo 2 años de experiencia certificada en gastronomía, hotelería o turismo',
      'Mayor de 18 años',
      'Nivel de inglés B2 conversacional',
    ],
    benefits: [
      'Asignación de oferta laboral',
      'Seguro médico internacional',
      'Vivienda y alimentación incluidas',
      'Charlas informativas previas a la llegada',
    ],
    duration: '3 a 18 meses según la modalidad',
    keyFacts: ['Destinos: Tailandia, Emiratos Árabes, Islas Maldivas', 'Networking profesional internacional'],
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Mal%C3%A9.jpg/1280px-Mal%C3%A9.jpg',
      alt: 'Vista de Malé, capital de las Islas Maldivas',
    },
  },
  {
    slug: 'teacher-exchange',
    title: 'Teacher Exchange',
    country: 'Estados Unidos',
    tagline: 'Enseña en Estados Unidos hasta por cinco años',
    description:
      'Intercambio para docentes que permite enseñar en escuelas de Estados Unidos, compartiendo su cultura y conocimientos mientras mejoran sus habilidades pedagógicas en un entorno educativo diverso.',
    cta: 'Vive la Experiencia',
    requirements: [
      'Licenciatura completa y 2 años de experiencia docente',
      'Nivel de inglés B2-C1 (avanzado)',
      'Mayor de 18 años y pasaporte vigente',
      'CV en inglés, escalafón docente y certificado Foreign',
    ],
    benefits: [
      'Seguimiento personalizado durante todo el proceso',
      'Asesoría para solicitud de visa J-1',
      'Seguro médico de emergencias',
      'Mejora del perfil profesional',
    ],
    duration: 'Hasta 5 años con visa J-1',
    keyFacts: ['Ubicaciones comunes: Texas, Carolina del Norte, Florida, Virginia, Arizona'],
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Front_view_of_Statue_of_Liberty_%28cropped%29.jpg/1280px-Front_view_of_Statue_of_Liberty_%28cropped%29.jpg',
      alt: 'Estatua de la Libertad en Nueva York',
    },
  },
  {
    slug: 'teacher-assistant',
    title: 'Teacher Assistant',
    country: 'Estados Unidos',
    tagline: 'Trabaja como asistente de profesor en instituciones educativas de EE. UU.',
    description:
      'Programa para trabajar como asistente de profesor en escuelas estadounidenses apoyando a docentes, fortaleciendo el inglés y ganando experiencia práctica en el sistema educativo norteamericano.',
    cta: 'El Mundo te Espera',
    requirements: [
      'Mínimo sexto semestre cursado; máximo 12 meses después de graduarse',
      'Nivel de inglés B2 conversacional',
      '18 años en adelante',
      'Pasaporte vigente y examen ITEP',
    ],
    benefits: [
      'Asignación laboral garantizada',
      'Seguro médico internacional',
      'Asesoría para visa y trámite SEVIS',
      'Vacaciones de verano incluidas',
    ],
    duration: '1 a 3 años bajo visa J-1',
    keyFacts: ['Remuneración desde $14 USD/hora', 'No requiere licencia de enseñanza en EE. UU.'],
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Chicago_River_ferry_b.jpg/1280px-Chicago_River_ferry_b.jpg',
      alt: 'Río Chicago y horizonte de la ciudad, Estados Unidos',
    },
  },
  {
    slug: 'aupair',
    title: 'Au Pair',
    country: 'Estados Unidos',
    tagline: 'Vive con una familia estadounidense y cuida de su hogar',
    description:
      'Experiencia de intercambio cultural donde jóvenes viven con familias estadounidenses cuidando niños a cambio de alojamiento, alimentación y compensación económica, con oportunidad de estudiar y mejorar su inglés.',
    cta: 'Viaja y Aprende',
    requirements: [
      'Edad entre 18 y 26 años',
      'Pasaporte vigente durante el programa',
      'Licencia de conducción actualizada (últimos 6 meses)',
      'Nivel de inglés B2 y 1000-1500 horas de experiencia cuidando niños',
    ],
    benefits: [
      'Alojamiento y alimentación incluidos',
      'Mejora del idioma en entorno inmersivo',
      'Intercambio cultural y desarrollo de habilidades interpersonales',
      'Tiempo libre para estudiar, explorar y viajar',
    ],
    duration: 'Programa bajo visa J-1',
    keyFacts: ['Familias anfitrionas seleccionadas y verificadas', 'Acompañamiento de sponsor durante la estadía'],
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/ISH_WC_Boston4.jpg/1280px-ISH_WC_Boston4.jpg',
      alt: 'Vista de Boston, Estados Unidos',
    },
  },
]

export function getCulturalProgram(slug: string) {
  return culturalPrograms.find((program) => program.slug === slug)
}
