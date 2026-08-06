export interface University {
  slug: string
  name: string
  country: string
  city: string
  description: string
  undergrad: string[]
  graduate: string[]
  keyFacts: string[]
  image: { src: string; alt: string }
}

export const universities: University[] = [
  {
    slug: 'troy-university',
    name: 'Troy University',
    country: 'Estados Unidos',
    city: 'Troy, Alabama',
    description:
      'Institución de educación superior en Alabama que ofrece educación de calidad en un entorno multicultural, con programas académicos reconocidos internacionalmente en una ciudad pequeña y tranquila, ideal para concentrarte en tus estudios.',
    undergrad: ['Negocios (Administración, Marketing, Finanzas)', 'Ciencias Sociales y Educación', 'Ciencias de la Salud (Enfermería, Terapia)'],
    graduate: ['MBA con especialidad en Inteligencia Empresarial', 'Maestrías en Educación, Ciencias de la Salud y Recursos Humanos'],
    keyFacts: [
      'Requiere 18+ años y certificado de bachillerato',
      'Exige dominio de inglés (TOEFL/IELTS)',
      'Career Services para empleabilidad post-graduación',
      'Visa F-1 mediante formulario I-20',
      'Acceso a programas OPT y CPT',
    ],
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Troy_square.JPG',
      alt: 'Centro de Troy, Alabama, Estados Unidos',
    },
  },
  {
    slug: 'gisma-university',
    name: 'GISMA University',
    country: 'Alemania',
    city: 'Alemania',
    description:
      'Universidad prestigiosa con reconocimiento internacional, especializada en negocios, tecnología, marketing y emprendimiento, ubicada estratégicamente en el corazón de la economía europea.',
    undergrad: ['Licenciaturas de 3 a 4 años en negocios, tecnología y marketing'],
    graduate: ['Maestrías de 1 a 2 años, todas impartidas en inglés'],
    keyFacts: [
      'Requisitos: 18+ años, inglés B2-C1',
      'Comunidad multicultural con más de 80 nacionalidades',
      'Asociación con SAP',
      'Permiso de hasta 18 meses para trabajar en Alemania tras graduarse',
      'Career Center para apoyo laboral post-graduación',
    ],
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Havel-Park-Lake-Babelsberg-Downtown-Potsdam-Green.jpg',
      alt: 'Potsdam, Alemania',
    },
  },
  {
    slug: 'woosong-university',
    name: 'Woosong University',
    country: 'Corea del Sur',
    city: 'Daejeon',
    description:
      'Universidad privada surcoreana con programas 100% en inglés dictados por profesores internacionales, ubicada en Daejeon, ciudad tecnológica hasta 40% más económica que Seúl y con excelente conectividad por tren de alta velocidad.',
    undergrad: ['Administración de Empresas', 'Gestión Global', 'Hotelería', 'Inteligencia Artificial', 'K-Pop', 'Belleza Coreana', 'Artes Culinarias'],
    graduate: ['MBA', 'Marketing', 'Tecnología', 'Inteligencia Artificial', 'Gestión Hotelera'],
    keyFacts: [
      'Estudiantes de más de 60 países',
      'Acreditación AACSB en negocios',
      'Prácticas con Samsung y Hyundai',
      'Becas de hasta el 100%',
      'Requisito: IELTS ≈6.0, TOEFL ≈60 o Duolingo 95',
    ],
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Woosong_University_West_Campus_20190608_A01.jpg/1280px-Woosong_University_West_Campus_20190608_A01.jpg',
      alt: 'Campus de Woosong University en Daejeon, Corea del Sur',
    },
  },
  {
    slug: 'vistula',
    name: 'Vistula University',
    country: 'Polonia',
    city: 'Varsovia',
    description:
      'Institución prestigiosa donde se desarrollan los programas académicos del convenio con BBB Student Center, con especialización en negocios, tecnología, turismo y marketing a costos más accesibles que otras opciones europeas.',
    undergrad: ['Negocios', 'Tecnología', 'Turismo', 'Marketing'],
    graduate: ['Programas de especialización según el área elegida'],
    keyFacts: [
      'Educación reconocida a nivel europeo',
      'Carta de aceptación para solicitud de visa de estudiante',
      'Costos entre $12.000 y $14.000 USD según especialidad',
    ],
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Uczelnia_vistula.jpg/1280px-Uczelnia_vistula.jpg',
      alt: 'Campus de Vistula University en Varsovia, Polonia',
    },
  },
  {
    slug: 'cape-breton',
    name: 'Cape Breton University',
    country: 'Canadá',
    city: 'Isla de Cape Breton, Nueva Escocia',
    description:
      'Universidad pública canadiense con enfoque práctico y comunitario que atrae estudiantes de más de 70 países, destacada por su orientación personalizada y su compromiso con la sostenibilidad.',
    undergrad: ['Artes', 'Negocios', 'Ingeniería', 'Enfermería', 'Educación', 'Ciencias', 'Hospitalidad y Turismo'],
    graduate: ['MBA en Desarrollo Económico Comunitario', 'Maestría en Educación (Tecnología e Innovación)'],
    keyFacts: [
      'Requisitos: bachillerato apostillado, 18+ años, certificado de inglés, pasaporte vigente',
      'Apoyo con visa de estudiante',
      'Permisos de trabajo post-graduación',
    ],
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Sydney%2C_Nova_Scotia_skyline.jpg/1280px-Sydney%2C_Nova_Scotia_skyline.jpg',
      alt: 'Horizonte de Sydney, Nueva Escocia, Canadá',
    },
  },
]

export function getUniversity(slug: string) {
  return universities.find((university) => university.slug === slug)
}
