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
  faq: { question: string; answer: string }[]
  pricing?: {
    badge?: string
    headline?: string
    price?: { amount: string; unit?: string }
    items: string[]
    note?: string
  }
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
    faq: [
      {
        question: '¿Necesito hablar inglés avanzado?',
        answer: 'No. Basta con un nivel B1 conversacional; lo perfeccionarás en el día a día trabajando en Estados Unidos.',
      },
      {
        question: '¿Puedo aplicar si estudio una carrera virtual?',
        answer: 'No, el programa exige ser estudiante universitario de tiempo completo en modalidad presencial y jornada diurna.',
      },
      {
        question: '¿Cuánto dura la experiencia en total?',
        answer: 'Cerca de 4 meses de trabajo (15 de mayo a 30 de agosto) más 30 días adicionales para viajar como turista.',
      },
      {
        question: '¿Qué tipo de empleos voy a conseguir?',
        answer: 'Tienes acceso a más de 100 opciones laborales en hoteles, restaurantes, parques acuáticos y de diversiones, y resorts.',
      },
    ],
    pricing: {
      badge: 'Temporada 2027',
      headline: 'Work and Travel USA',
      price: { amount: '$3,000', unit: 'USD' },
      items: [
        'Valor de la inscripción: $260.000 COP',
        'El programa se paga en 8 abonos desde $300 USD, según las fechas del contrato',
        'Por pronto pago, descuento desde $25 USD en el abono a realizar',
      ],
      note: 'Valores de referencia; tu asesor te confirma el plan de pagos exacto según tu fecha de inscripción.',
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
    faq: [
      {
        question: '¿Cuál es la diferencia entre Internship y Trainee?',
        answer:
          'Internship es para estudiantes en último semestre o recién graduados (máximo 12 meses post-graduación). Trainee es para profesionales con mínimo 1 año de experiencia con título, o 5 años sin título.',
      },
      {
        question: '¿En qué áreas puedo aplicar?',
        answer: 'Principalmente en negocios, ingeniería y hotelería, según tu perfil académico o profesional.',
      },
      {
        question: '¿Cuánto dura el programa?',
        answer: 'Entre 6 y 18 meses, dependiendo del programa específico al que apliques.',
      },
      {
        question: '¿Qué documentos necesito para inscribirme?',
        answer: 'Pasaporte vigente, CV en inglés y certificado de estudios o diploma.',
      },
    ],
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
    faq: [
      {
        question: '¿Necesito experiencia previa para aplicar?',
        answer:
          'Los profesionales deben tener mínimo 2 años de experiencia laboral; si eres estudiante de tiempo completo no se exige experiencia previa.',
      },
      {
        question: '¿En qué sectores puedo trabajar?',
        answer: 'En reconocidos hoteles y restaurantes de España, dentro de la industria de hotelería, turismo y gastronomía.',
      },
      {
        question: '¿El programa incluye seguro médico?',
        answer: 'Sí, incluye seguro de emergencias médicas durante toda tu estadía.',
      },
      {
        question: '¿Cuánto tiempo puedo permanecer trabajando?',
        answer: 'Hasta 12 meses, en cualquier campo ocupacional relacionado con tu perfil.',
      },
    ],
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
    faq: [
      {
        question: '¿Qué experiencia necesito para aplicar?',
        answer: 'Mínimo 2 años de experiencia certificada en gastronomía, hotelería o turismo.',
      },
      {
        question: '¿Qué nivel de inglés piden?',
        answer: 'Nivel B2 conversacional.',
      },
      {
        question: '¿A qué destinos puedo ir?',
        answer: 'Tailandia, Emiratos Árabes e Islas Maldivas, en establecimientos de alta categoría.',
      },
      {
        question: '¿Qué incluye el programa?',
        answer: 'Asignación de oferta laboral, seguro médico internacional, y vivienda y alimentación incluidas.',
      },
    ],
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
    faq: [
      {
        question: '¿Qué experiencia docente necesito?',
        answer: 'Licenciatura completa y al menos 2 años de experiencia como docente.',
      },
      {
        question: '¿Qué nivel de inglés se requiere?',
        answer: 'Nivel B2-C1, es decir, avanzado.',
      },
      {
        question: '¿Cuánto tiempo puedo enseñar en Estados Unidos?',
        answer: 'Hasta 5 años, bajo visa J-1.',
      },
      {
        question: '¿En qué estados suelen ubicar a los docentes?',
        answer: 'Con frecuencia en Texas, Carolina del Norte, Florida, Virginia y Arizona.',
      },
    ],
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
    faq: [
      {
        question: '¿Necesito ser profesional graduado?',
        answer: 'No, basta con haber cursado mínimo sexto semestre, o estar hasta 12 meses después de graduarte.',
      },
      {
        question: '¿Necesito licencia de enseñanza en Estados Unidos?',
        answer: 'No, el programa no la exige.',
      },
      {
        question: '¿Cuánto se gana?',
        answer: 'La remuneración es desde $14 USD por hora.',
      },
      {
        question: '¿Cuánto dura el programa?',
        answer: 'Entre 1 y 3 años, bajo visa J-1.',
      },
    ],
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
    faq: [
      {
        question: '¿Cuál es el rango de edad para aplicar?',
        answer: 'Entre 18 y 26 años.',
      },
      {
        question: '¿Necesito experiencia cuidando niños?',
        answer: 'Sí, entre 1000 y 1500 horas de experiencia certificada.',
      },
      {
        question: '¿Qué incluye el programa?',
        answer: 'Alojamiento, alimentación y compensación económica, más seguro de emergencias médicas.',
      },
      {
        question: '¿Puedo elegir a la familia anfitriona?',
        answer: 'Sí, mediante entrevistas previas con familias seleccionadas y verificadas por el sponsor.',
      },
    ],
  },
  {
    slug: 'portugal',
    title: 'Trainee & Internship Portugal',
    country: 'Portugal',
    tagline: 'Impulsa tu perfil en culinaria, hotelería y turismo',
    description:
      'Vive una experiencia profesional en Portugal con oportunidades de práctica en empresas de culinaria, hotelería y turismo. Fortalece tu perfil, desarrolla habilidades en un entorno internacional y descubre la cultura portuguesa mientras avanzas en tu carrera.',
    cta: 'Impulsa tu carrera',
    requirements: [
      'Edad mínima de 18 años',
      'Pasaporte vigente',
      'Formación o experiencia relacionada con culinaria, hotelería o turismo',
      'Nivel de idioma requerido según la vacante y el empleador',
    ],
    benefits: [
      'Experiencia profesional internacional para fortalecer tu CV',
      'Desarrollo de habilidades prácticas en tu área',
      'Contacto con equipos y estándares de servicio europeos',
      'Intercambio cultural y networking internacional',
    ],
    duration: 'La duración depende de la modalidad y de la vacante disponible',
    keyFacts: [
      'Prácticas en culinaria y gastronomía',
      'Oportunidades en hoteles, restaurantes, resorts y turismo',
      'Vacantes sujetas al perfil y nivel de idioma',
      'Acompañamiento antes y durante el proceso',
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1600&q=85',
      alt: 'Paisaje urbano de Portugal junto al río',
    },
    faq: [
      {
        question: '¿En qué áreas puedo realizar la práctica?',
        answer: 'En culinaria, gastronomía, hotelería, restaurantes, resorts y actividades relacionadas con turismo.',
      },
      {
        question: '¿Necesito experiencia previa?',
        answer: 'Debes contar con formación o experiencia relacionada. Los requisitos específicos pueden variar según la vacante y el empleador.',
      },
      {
        question: '¿Qué nivel de idioma necesito?',
        answer: 'Depende de la posición. Un asesor revisará tu perfil y te explicará el nivel solicitado para cada oportunidad.',
      },
      {
        question: '¿Cuánto dura el programa?',
        answer: 'La duración depende de la modalidad y de la vacante disponible. Te confirmaremos las condiciones antes de iniciar el proceso.',
      },
    ],
    pricing: {
      badge: 'Costos referenciales',
      headline: 'Inversión en Trainee & Internship Portugal',
      items: [
        'Inscripción: $250.000 COP',
        'Valor del programa sujeto a la duración, el perfil y la vacante seleccionada',
      ],
      note: 'Tu asesor confirmará los valores y condiciones vigentes para tu perfil.',
    },
  },
]

export function getCulturalProgram(slug: string) {
  return culturalPrograms.find((program) => program.slug === slug)
}
