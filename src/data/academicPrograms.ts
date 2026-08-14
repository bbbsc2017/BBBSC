export interface AcademicProgram {
  slug: string
  country: string
  title: string
  tagline: string
  description: string
  programTypes: string[]
  benefits: string[]
  requirements: string[]
  costs: string[]
  universitySlugs: string[]
  image: { src: string; alt: string }
  faq: { question: string; answer: string }[]
}

export const academicPrograms: AcademicProgram[] = [
  {
    slug: 'canada',
    country: 'Canadá',
    title: 'Estudia en Canadá',
    tagline: 'Especialización técnica y profesional en un entorno multicultural',
    description:
      'Permite estudiar carreras vocacionales en instituciones reconocidas internacionalmente, con especialidades en negocios, tecnología, hospitalidad y salud, mientras mejoras tu inglés en un entorno multicultural.',
    programTypes: ['Carreras vocacionales certificadas internacionalmente', 'Formación especializada en múltiples sectores profesionales'],
    benefits: [
      'Educación de calidad en instituciones reconocidas',
      'Inmersión cultural y mejora del idioma',
      'Certificaciones profesionales y conexiones internacionales',
      'Preparación laboral especializada',
    ],
    requirements: [
      'Edad mínima de 18 años',
      'Nivel de inglés B2-C1 (avanzado)',
      'Estar estudiando o trabajando',
      'Certificado estudiantil o laboral con permiso no remunerado',
    ],
    costs: ['Inscripción: $250.000 COP', 'Programa desde 3.000 CAD', 'Gastos extra: traducciones, exámenes médicos, vuelo y manutención'],
    universitySlugs: ['cape-breton'],
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Toronto_Skyline_from_Olympic_Island%2C_June_20_2026_%285-3_cropped%29.jpg/1280px-Toronto_Skyline_from_Olympic_Island%2C_June_20_2026_%285-3_cropped%29.jpg',
      alt: 'Horizonte de Toronto, Canadá',
    },
    faq: [
      {
        question: '¿Qué edad mínima piden?',
        answer: '18 años.',
      },
      {
        question: '¿Qué nivel de inglés necesito?',
        answer: 'Nivel B2-C1, es decir, avanzado.',
      },
      {
        question: '¿Puedo trabajar mientras estudio?',
        answer: 'El programa exige estar estudiando o trabajando, con certificado estudiantil o laboral con permiso no remunerado.',
      },
      {
        question: '¿Con qué universidad tiene convenio este programa?',
        answer: 'Con Cape Breton University, en la isla de Cape Breton, Nueva Escocia.',
      },
    ],
  },
  {
    slug: 'polonia',
    country: 'Polonia',
    title: 'Estudia en Polonia',
    tagline: 'Educación europea de calidad con costos accesibles',
    description:
      'Oportunidad para estudiar carreras vocacionales en Europa, especialmente en la Universidad de Vistula, con especialización en negocios, tecnología, turismo y marketing.',
    programTypes: ['Carreras vocacionales en la Universidad de Vistula', 'Especialidades en negocios, tecnología, turismo y marketing'],
    benefits: [
      'Educación reconocida a nivel europeo',
      'Formación profesional con certificaciones internacionales',
      'Costos más asequibles que otras opciones europeas',
      'Acceso a un mercado laboral global',
    ],
    requirements: [
      'Edad mínima de 18 años',
      'Certificado de bachillerato apostillado',
      'Pasaporte vigente',
      'Certificado de inglés o polaco y soporte financiero comprobable',
    ],
    costs: ['Inscripción: $250.000 COP', 'Programa total: entre $12.000 y $14.000 USD según especialidad'],
    universitySlugs: ['vistula'],
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Aleja_Niepdleglosci_Warsaw_2022_aerial_%28cropped%29.jpg',
      alt: 'Vista aérea de Varsovia, Polonia',
    },
    faq: [
      {
        question: '¿En qué universidad estudiaré?',
        answer: 'En la Universidad de Vistula, en Varsovia.',
      },
      {
        question: '¿Qué documentos necesito?',
        answer: 'Certificado de bachillerato apostillado y pasaporte vigente, entre otros.',
      },
      {
        question: '¿Qué puedo estudiar?',
        answer: 'Carreras vocacionales en negocios, tecnología, turismo y marketing.',
      },
      {
        question: '¿Es más económico que otros destinos europeos?',
        answer: 'Sí, sus costos son más accesibles frente a otras opciones en Europa.',
      },
    ],
  },
  {
    slug: 'australia',
    country: 'Australia',
    title: 'Estudia en Australia',
    tagline: 'Trabaja, aprende inglés o estudia una carrera vocacional',
    description:
      'Vive en Australia mientras trabajas, aprendes inglés o estudias una carrera vocacional, combinando crecimiento profesional con una experiencia de inmersión cultural en sectores como hotelería y turismo.',
    programTypes: ['Combinado: trabajo + cursos de inglés o formación profesional', 'Vocacional: carrera especializada con oportunidades laborales'],
    benefits: [
      'Mejora del inglés en contexto real',
      'Experiencia internacional para el CV',
      'Red de contactos multicultural',
      'Exploración de playas y ciudades vibrantes',
    ],
    requirements: ['Edad mínima de 18 años', 'Pasaporte vigente', 'Nivel de inglés avanzado', 'Ser egresado de pregrado y soporte financiero'],
    costs: ['Inscripción: $250.000 COP', 'Pago 1: 3.000 AUD (escuela + CoE)', 'Pago 2: 2.000 AUD (seguro + visa)'],
    universitySlugs: [],
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Sydney_Australia._%2821339175489%29.jpg/1280px-Sydney_Australia._%2821339175489%29.jpg',
      alt: 'Ópera de Sídney, Australia',
    },
    faq: [
      {
        question: '¿Puedo trabajar y estudiar al mismo tiempo?',
        answer: 'Sí, es un programa combinado de trabajo con cursos de inglés o formación profesional.',
      },
      {
        question: '¿Qué nivel de inglés piden?',
        answer: 'Nivel avanzado.',
      },
      {
        question: '¿Necesito ser egresado de pregrado?',
        answer: 'Sí, junto con soporte financiero comprobable.',
      },
      {
        question: '¿Qué cubren los pagos del programa?',
        answer: 'El primer pago cubre escuela y CoE; el segundo, seguro y trámite de visa.',
      },
    ],
  },
  {
    slug: 'portugal',
    country: 'Portugal',
    title: 'Trainee & Internship Portugal',
    tagline: 'Impulsa tu perfil en culinaria, hotelería y turismo',
    description:
      'Vive una experiencia profesional en Portugal con oportunidades de práctica en empresas de culinaria, hotelería y turismo. Fortalece tu perfil, desarrolla habilidades en un entorno internacional y descubre la cultura portuguesa mientras avanzas en tu carrera.',
    programTypes: [
      'Prácticas profesionales en culinaria y gastronomía',
      'Experiencias en hotelería, restaurantes, resorts y turismo',
    ],
    benefits: [
      'Experiencia profesional internacional para fortalecer tu CV',
      'Desarrollo de habilidades prácticas en tu área',
      'Contacto con equipos y estándares de servicio europeos',
      'Intercambio cultural y networking internacional',
    ],
    requirements: [
      'Edad mínima de 18 años',
      'Pasaporte vigente',
      'Formación o experiencia relacionada con culinaria, hotelería o turismo',
      'Nivel de idioma requerido según la vacante y el empleador',
    ],
    costs: [
      'Inscripción: $250.000 COP',
      'Valor del programa sujeto a la duración, el perfil y la vacante seleccionada',
    ],
    universitySlugs: [],
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
  },
]

export function getAcademicProgram(slug: string) {
  return academicPrograms.find((program) => program.slug === slug)
}
