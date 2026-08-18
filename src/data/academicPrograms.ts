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
    slug: 'alemania',
    country: 'Alemania',
    title: 'Alemania - GISMA University',
    tagline: 'Negocios, tecnología y emprendimiento en el corazón de Europa',
    description:
      'Estudia en GISMA University y desarrolla una visión internacional en negocios, tecnología, marketing o emprendimiento dentro de una comunidad multicultural conectada con el mercado laboral alemán.',
    programTypes: [
      'Pregrados de 3 a 4 años en negocios, tecnología y marketing',
      'Maestrías de 1 a 2 años impartidas en inglés',
    ],
    benefits: [
      'Programas académicos con reconocimiento internacional',
      'Comunidad con estudiantes de más de 80 nacionalidades',
      'Acompañamiento del Career Center para tu proyección laboral',
      'Posibilidad de permanecer hasta 18 meses para buscar trabajo después de graduarte',
    ],
    requirements: [
      'Edad mínima de 18 años',
      'Certificado de bachillerato o título previo según el nivel del programa',
      'Nivel de inglés B2-C1',
      'Pasaporte vigente y soporte financiero para el proceso de visa',
    ],
    costs: [
      'Inscripción BBB Student Center: $250.000 COP',
      'La matrícula depende del programa y del periodo académico seleccionado',
    ],
    universitySlugs: ['gisma-university'],
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Havel-Park-Lake-Babelsberg-Downtown-Potsdam-Green.jpg',
      alt: 'Potsdam, Alemania, destino académico de GISMA University',
    },
    faq: [
      { question: '¿En qué universidad estudiaré?', answer: 'En GISMA University, una institución enfocada en negocios, tecnología, marketing y emprendimiento.' },
      { question: '¿Los programas se dictan en inglés?', answer: 'Sí. La oferta internacional incluye programas impartidos en inglés; el nivel exigido depende del programa.' },
      { question: '¿Qué nivel de inglés necesito?', answer: 'Normalmente se solicita un nivel B2-C1 y el soporte correspondiente indicado por la universidad.' },
      { question: '¿Puedo trabajar en Alemania después de graduarme?', answer: 'Los graduados internacionales pueden solicitar un permiso para buscar trabajo, sujeto a la normativa migratoria vigente.' },
    ],
  },
  {
    slug: 'polonia',
    country: 'Polonia',
    title: 'Polonia - Vistula University',
    tagline: 'Educación europea de calidad con costos accesibles',
    description:
      'Estudia en Vistula University, en Varsovia, con opciones en negocios, tecnología, turismo y marketing y una experiencia académica internacional con costos competitivos frente a otros destinos europeos.',
    programTypes: [
      'Pregrados en negocios, tecnología, turismo y marketing',
      'Programas de especialización según el área elegida',
    ],
    benefits: [
      'Educación reconocida a nivel europeo',
      'Formación profesional con proyección internacional',
      'Costos más asequibles que otras opciones europeas',
      'Experiencia multicultural en Varsovia',
    ],
    requirements: [
      'Edad mínima de 18 años',
      'Certificado de bachillerato apostillado',
      'Pasaporte vigente',
      'Certificado de idioma y soporte financiero comprobable',
    ],
    costs: ['Inscripción: $250.000 COP', 'Programa total: entre $12.000 y $14.000 USD según especialidad'],
    universitySlugs: ['vistula'],
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Uczelnia_vistula.jpg/1280px-Uczelnia_vistula.jpg',
      alt: 'Campus de Vistula University en Varsovia, Polonia',
    },
    faq: [
      { question: '¿En qué universidad estudiaré?', answer: 'En Vistula University, en Varsovia.' },
      { question: '¿Qué documentos necesito?', answer: 'Certificado de bachillerato apostillado, pasaporte vigente y los soportes académicos, financieros y de idioma solicitados.' },
      { question: '¿Qué puedo estudiar?', answer: 'Programas en negocios, tecnología, turismo, marketing y otras áreas disponibles en la universidad.' },
      { question: '¿Es más económico que otros destinos europeos?', answer: 'Sus costos suelen ser competitivos frente a otras opciones en Europa; tu asesor confirmará los valores vigentes.' },
    ],
  },
  {
    slug: 'canada',
    country: 'Canadá',
    title: 'Canadá - Cape Breton University',
    tagline: 'Formación práctica y una comunidad universitaria multicultural',
    description:
      'Estudia en Cape Breton University, en Nueva Escocia, una universidad pública con enfoque práctico, atención cercana y estudiantes de más de 70 países.',
    programTypes: [
      'Pregrados en artes, negocios, ingeniería, enfermería, educación, ciencias y hospitalidad',
      'MBA y programas de posgrado en educación, tecnología e innovación',
    ],
    benefits: [
      'Educación pública canadiense con enfoque práctico',
      'Comunidad internacional y acompañamiento personalizado',
      'Programas con orientación profesional',
      'Opciones de trabajo posteriores a la graduación según la normativa vigente',
    ],
    requirements: [
      'Edad mínima de 18 años',
      'Certificado de bachillerato apostillado',
      'Certificado de inglés',
      'Pasaporte vigente y soporte financiero para el proceso de visa',
    ],
    costs: [
      'Inscripción BBB Student Center: $250.000 COP',
      'La matrícula depende del programa y del periodo académico seleccionado',
    ],
    universitySlugs: ['cape-breton'],
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Sydney%2C_Nova_Scotia_skyline.jpg/1280px-Sydney%2C_Nova_Scotia_skyline.jpg',
      alt: 'Sydney, Nueva Escocia, sede de Cape Breton University en Canadá',
    },
    faq: [
      { question: '¿En qué universidad estudiaré?', answer: 'En Cape Breton University, ubicada en la isla de Cape Breton, Nueva Escocia.' },
      { question: '¿Qué áreas puedo estudiar?', answer: 'Hay opciones en artes, negocios, ingeniería, salud, educación, ciencias, hospitalidad y turismo, además de programas de posgrado.' },
      { question: '¿Qué nivel de inglés necesito?', answer: 'Debes presentar el certificado de inglés aceptado para el programa al que deseas aplicar.' },
      { question: '¿Recibo ayuda con la admisión y la visa?', answer: 'Sí. BBB Student Center te acompaña durante la postulación y la preparación del proceso migratorio.' },
    ],
  },
  {
    slug: 'corea-del-sur',
    country: 'Corea del Sur',
    title: 'Corea del Sur - Woosong University',
    tagline: 'Programas en inglés, innovación y una experiencia universitaria global',
    description:
      'Estudia en Woosong University, en Daejeon, con programas impartidos en inglés, profesores internacionales y opciones en negocios, tecnología, hotelería, artes culinarias y cultura coreana.',
    programTypes: [
      'Pregrados en negocios, hotelería, inteligencia artificial, K-Pop, belleza coreana y artes culinarias',
      'MBA y maestrías en marketing, tecnología, inteligencia artificial y gestión hotelera',
    ],
    benefits: [
      'Programas 100% en inglés',
      'Estudiantes de más de 60 países',
      'Becas académicas de hasta el 100% según perfil y convocatoria',
      'Conexiones y prácticas con empresas como Samsung y Hyundai',
    ],
    requirements: [
      'Edad mínima de 18 años',
      'Certificado de bachillerato o título previo según el programa',
      'Certificación de inglés aceptada por la universidad',
      'Pasaporte vigente y documentos financieros para el proceso de visa',
    ],
    costs: [
      'Inscripción BBB Student Center: $250.000 COP',
      'La matrícula y las becas dependen del programa y del perfil académico',
    ],
    universitySlugs: ['woosong-university'],
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Woosong_University_West_Campus_20190608_A01.jpg/1280px-Woosong_University_West_Campus_20190608_A01.jpg',
      alt: 'Campus de Woosong University en Daejeon, Corea del Sur',
    },
    faq: [
      { question: '¿Los programas son en inglés?', answer: 'Sí. Woosong University ofrece programas internacionales impartidos completamente en inglés.' },
      { question: '¿Qué certificación de inglés aceptan?', answer: 'Según el programa, pueden aceptar IELTS, TOEFL o Duolingo. Tu asesor confirmará el puntaje vigente.' },
      { question: '¿Hay becas disponibles?', answer: 'Existen becas de hasta el 100% sujetas al perfil, el programa y la convocatoria vigente.' },
      { question: '¿Dónde está ubicada la universidad?', answer: 'En Daejeon, una ciudad tecnológica conectada con Seúl por tren de alta velocidad.' },
    ],
  },
  {
    slug: 'usa',
    country: 'Estados Unidos',
    title: 'USA - Troy University',
    tagline: 'Educación internacional y proyección profesional en Alabama',
    description:
      'Estudia en Troy University en un entorno multicultural y tranquilo, con programas reconocidos en negocios, educación, ciencias sociales, salud y opciones de posgrado.',
    programTypes: [
      'Pregrados en negocios, ciencias sociales, educación y ciencias de la salud',
      'MBA y maestrías en educación, salud y recursos humanos',
    ],
    benefits: [
      'Programas académicos reconocidos internacionalmente',
      'Career Services para apoyar tu empleabilidad',
      'Entorno universitario multicultural',
      'Acceso a OPT y CPT sujeto a la normativa de la visa F-1',
    ],
    requirements: [
      'Edad mínima de 18 años',
      'Certificado de bachillerato o título previo según el programa',
      'Certificación de inglés TOEFL, IELTS u otra aceptada',
      'Pasaporte vigente y soporte financiero para solicitar la visa F-1',
    ],
    costs: [
      'Inscripción BBB Student Center: $250.000 COP',
      'La matrícula depende del programa y del periodo académico seleccionado',
    ],
    universitySlugs: ['troy-university'],
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Troy_square.JPG',
      alt: 'Troy, Alabama, ciudad de Troy University en Estados Unidos',
    },
    faq: [
      { question: '¿En qué universidad estudiaré?', answer: 'En Troy University, ubicada en Troy, Alabama.' },
      { question: '¿Qué puedo estudiar?', answer: 'Hay opciones de pregrado y posgrado en negocios, educación, ciencias sociales, salud y otras áreas.' },
      { question: '¿Qué visa necesito?', answer: 'Los estudiantes internacionales admitidos realizan el proceso de visa F-1 con el formulario I-20 emitido por la universidad.' },
      { question: '¿Puedo obtener experiencia laboral?', answer: 'La visa F-1 contempla alternativas como CPT y OPT, siempre sujetas a elegibilidad y autorización.' },
    ],
  },
  {
    slug: 'australia',
    country: 'Australia',
    title: 'Estudia en Australia',
    tagline: 'Trabaja, aprende inglés o estudia una carrera vocacional',
    description:
      'Vive en Australia mientras trabajas, aprendes inglés o estudias una carrera vocacional, combinando crecimiento profesional con una experiencia de inmersión cultural en sectores como hotelería y turismo.',
    programTypes: [
      'Combinado: trabajo + cursos de inglés o formación profesional',
      'Vocacional: carrera especializada con oportunidades laborales',
    ],
    benefits: [
      'Mejora del inglés en contexto real',
      'Experiencia internacional para el CV',
      'Red de contactos multicultural',
      'Exploración de playas y ciudades vibrantes',
    ],
    requirements: ['Edad mínima de 18 años', 'Pasaporte vigente', 'Nivel de inglés avanzado', 'Ser egresado de pregrado y demostrar soporte financiero'],
    costs: ['Inscripción: $250.000 COP', 'Pago 1: 3.000 AUD (escuela + CoE)', 'Pago 2: 2.000 AUD (seguro + visa)'],
    universitySlugs: [],
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Sydney_Australia._%2821339175489%29.jpg/1280px-Sydney_Australia._%2821339175489%29.jpg',
      alt: 'Ópera de Sídney, Australia',
    },
    faq: [
      { question: '¿Puedo trabajar y estudiar al mismo tiempo?', answer: 'Sí, el programa combina estudios de inglés o formación profesional con las condiciones de trabajo permitidas por la visa.' },
      { question: '¿Qué nivel de inglés piden?', answer: 'El nivel depende de la institución y del programa; algunas opciones requieren un nivel avanzado.' },
      { question: '¿Necesito ser egresado de pregrado?', answer: 'El perfil académico requerido depende del programa elegido. Un asesor validará tu caso antes de la postulación.' },
      { question: '¿Qué cubren los pagos del programa?', answer: 'El primer pago cubre escuela y CoE; el segundo, seguro y trámite de visa, según las condiciones vigentes.' },
    ],
  },
]

export function getAcademicProgram(slug: string) {
  return academicPrograms.find((program) => program.slug === slug)
}
