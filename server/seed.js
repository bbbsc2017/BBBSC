import { getDb } from './db.js'

const CEO = { name: 'Sebastián Eduardo Martínez Manrique', role: 'CEO' }
const CIO = { name: 'Leidy Viviana Miranda', role: 'CIO' }

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function paragraphsToHtml(paragraphs) {
  return paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')
}

// Transcripción única de los artículos que hoy viven en src/data/blogPosts.ts, para
// que el contenido existente no se pierda al pasar el blog a la base de datos.
const SEED_POSTS = [
  {
    slug: 'como-diligenciar-el-ds-160',
    title: 'Cómo diligenciar correctamente el formulario DS-160',
    excerpt:
      'El DS-160 es el primer paso formal hacia tu visa J-1. Te explicamos campo por campo los errores más comunes que retrasan tu proceso y cómo evitarlos.',
    category: 'Embajada',
    date: '2026-07-28',
    readTime: '6 min de lectura',
    author: CEO,
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Passports-assorted.jpg/1280px-Passports-assorted.jpg',
      alt: 'Pasaportes de distintos países',
    },
    content: [
      'El formulario DS-160 es la solicitud oficial de visa de no inmigrante ante el Departamento de Estado de Estados Unidos, y es un requisito obligatorio antes de tu cita en el consulado. Aunque parece extenso, la mayoría de los problemas surgen de errores evitables.',
      'Antes de empezar, ten a la mano tu pasaporte vigente, la información de tu itinerario de viaje (fechas aproximadas), los datos de contacto de tu sponsor o empleador en Estados Unidos, y tu historial de viajes de los últimos cinco años.',
      'Errores comunes que retrasan tu proceso: usar un nombre que no coincide exactamente con tu pasaporte, subir una fotografía que no cumple las especificaciones (fondo blanco, sin lentes, tomada en los últimos seis meses), dejar campos de empleo o educación incompletos, y equivocarte en el código de la ciudad consular.',
      'Recuerda guardar el número de confirmación que genera el sistema al finalizar: lo necesitarás para agendar tu cita y para el día de la entrevista. En BBB Student Center te acompañamos en cada paso del diligenciamiento como parte de la asesoría de tu programa.',
    ],
  },
  {
    slug: 'preguntas-entrevista-visa-j1',
    title: 'Las preguntas más frecuentes en la entrevista de visa J-1',
    excerpt:
      'El cónsul evalúa principalmente tus vínculos con Colombia y la claridad de tu propósito de viaje. Repasa las preguntas que más se repiten y cómo responderlas con seguridad.',
    category: 'Embajada',
    date: '2026-07-15',
    readTime: '5 min de lectura',
    author: CIO,
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Sara_Prigan_%2841497467772%29.jpg/1280px-Sara_Prigan_%2841497467772%29.jpg',
      alt: 'Entrevista formal',
    },
    content: [
      'La entrevista consular suele durar entre dos y cinco minutos. En ese tiempo, el oficial busca confirmar dos cosas: que tu propósito de viaje corresponde exactamente al programa J-1 al que aplicaste, y que tienes razones sólidas para regresar a Colombia al finalizar.',
      'Preguntas frecuentes: ¿A qué programa aplicas y con qué empresa o sponsor? ¿Qué estudias actualmente y en qué semestre vas? ¿Cuánto tiempo estarás en Estados Unidos? ¿Quién financia tu viaje? ¿Qué planes tienes al regresar a Colombia?',
      'Responde siempre en inglés, de forma breve y directa, sin memorizar un discurso. La naturalidad genera más confianza que una respuesta perfecta pero forzada. Lleva contigo la documentación de tu programa, tu carta de aceptación y evidencia de tus vínculos en Colombia (estudios, familia, trabajo).',
      'Antes de tu cita, en BBB Student Center realizamos un repaso de entrevista personalizado para que llegues preparado y sin nervios.',
    ],
  },
  {
    slug: 'work-and-travel-usa-2027-fechas-clave',
    title: 'Work and Travel USA 2027: fechas clave que debes conocer',
    excerpt:
      'Desde la inscripción hasta tu regreso a Colombia, así se ve la línea de tiempo completa del programa Work and Travel para la temporada 2027.',
    category: 'Programas',
    date: '2026-07-02',
    readTime: '4 min de lectura',
    author: CEO,
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/1280px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg',
      alt: 'Vista de Nueva York desde el Rockefeller Center',
    },
    content: [
      'Planificar con tiempo es la clave para tener las mejores opciones de empleo y evitar afanes con la visa. Esta es la línea de tiempo general que recomendamos para Work and Travel USA 2027.',
      'Inscripción y asesoría inicial: idealmente entre agosto y noviembre de 2026, para tener acceso a la mayor variedad de empleadores. Asignación de empleador: entre diciembre de 2026 y febrero de 2027, según el sector que elijas (hotelería, parques temáticos, resorts).',
      'DS-160 y agendamiento de cita consular: entre febrero y marzo de 2027. Entrevista de visa: recomendamos tenerla lista antes de abril, ya que la disponibilidad de citas se reduce en temporada alta. Viaje: el programa inicia el 15 de mayo y finaliza el 30 de agosto, con 30 días adicionales para viajar como turista.',
      'Si ya tienes claro que quieres viajar en la temporada 2027, entre antes mejor: muchos empleadores cierran sus vacantes con varios meses de anticipación.',
    ],
  },
  {
    slug: 'por-que-woosong-university-corea',
    title: 'Corea del Sur: por qué Woosong University es una gran opción para colombianos',
    excerpt:
      'Programas 100% en inglés, becas de hasta el 100% y una ciudad hasta 40% más económica que Seúl. Te contamos por qué Woosong se ha vuelto una de las opciones favoritas.',
    category: 'Programas',
    date: '2026-06-20',
    readTime: '5 min de lectura',
    author: CIO,
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Woosong_University_West_Campus_20190608_A01.jpg/1280px-Woosong_University_West_Campus_20190608_A01.jpg',
      alt: 'Campus de Woosong University en Daejeon, Corea del Sur',
    },
    content: [
      'Woosong University, ubicada en Daejeon, es una de las pocas universidades surcoreanas con programas de pregrado y posgrado dictados completamente en inglés por profesores internacionales, lo que la hace especialmente atractiva para estudiantes colombianos sin dominio del coreano.',
      'Daejeon es una ciudad tecnológica con excelente conectividad por tren de alta velocidad hacia Seúl, pero con un costo de vida hasta 40% más bajo, lo que hace la experiencia mucho más accesible que estudiar directamente en la capital.',
      'La universidad ofrece programas como Administración de Empresas, Gestión Global, Hotelería, Inteligencia Artificial e incluso K-Pop y Artes Culinarias, con estudiantes de más de 60 países y prácticas profesionales con empresas como Samsung y Hyundai.',
      'Uno de los mayores atractivos son las becas de hasta el 100%, sujetas al perfil académico y nivel de inglés del aspirante (IELTS ≈6.0, TOEFL ≈60 o Duolingo 95). Si te interesa, en BBB Student Center te asesoramos en todo el proceso de aplicación.',
    ],
  },
  {
    slug: 'primera-semana-trabajando-en-estados-unidos',
    title: 'Consejos para tu primera semana trabajando en Estados Unidos',
    excerpt:
      'Del choque cultural a organizar tus finanzas: estos son los consejos prácticos que le damos a cada estudiante antes de comenzar su experiencia laboral.',
    category: 'Consejos',
    date: '2026-06-05',
    readTime: '4 min de lectura',
    author: CEO,
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Chicago_River_ferry_b.jpg/1280px-Chicago_River_ferry_b.jpg',
      alt: 'Río Chicago y horizonte de la ciudad, Estados Unidos',
    },
    content: [
      'Los primeros días suelen ser los más intensos: nuevo idioma en contexto real, horarios distintos y un entorno laboral que probablemente nunca has vivido. Aquí van algunos consejos prácticos.',
      'Consigue tu número de Seguro Social (SSN) apenas llegues; sin él no podrás recibir tu primer pago. Abre una cuenta bancaria local en tus primeros días para evitar cargos por cambio de divisas cada vez que necesites tu dinero.',
      'Habla con tu supervisor desde el primer turno si algo no te queda claro: en la cultura laboral estadounidense se valora más preguntar que asumir. Guarda copias digitales de todos tus documentos (pasaporte, visa, DS-2019) en un lugar accesible fuera de tu equipaje.',
      'Y lo más importante: date tiempo para adaptarte. El choque cultural es normal las primeras semanas, y casi siempre mejora apenas empiezas a construir tu rutina y tu red de apoyo en el lugar de trabajo.',
    ],
  },
  {
    slug: 'guia-entrevista-con-el-sponsor',
    title: 'Guía para tu entrevista con el sponsor de Work and Travel',
    excerpt:
      'Antes de la visa, hay otra entrevista igual de importante: la del sponsor del programa. Así puedes prepararte para causar una buena primera impresión.',
    category: 'Programas',
    date: '2026-05-22',
    readTime: '5 min de lectura',
    author: CIO,
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/9/96/El-dorado-from-air.jpg',
      alt: 'Vista aérea del Aeropuerto Internacional El Dorado, Bogotá',
    },
    content: [
      'Antes de llegar a la entrevista consular, todo aspirante a Work and Travel pasa por una entrevista con el sponsor del programa (la organización que patrocina tu visa J-1). Esta entrevista evalúa tu nivel de inglés, tu madurez para vivir la experiencia y tu comprensión real del programa.',
      'Prepárate para hablar de tu motivación: por qué quieres hacer Work and Travel, qué esperas aprender y cómo planeas manejar los retos de vivir y trabajar en otro país. Practica presentarte en inglés de forma natural, sin sonar memorizado.',
      'Es común que te pregunten sobre tu disponibilidad de fechas, tu presupuesto para los primeros días antes del primer pago, y tu flexibilidad para el tipo de empleo que te asignen. Mostrar apertura aquí juega a tu favor.',
      'En BBB Student Center incluimos un entrenamiento específico para esta entrevista dentro del acompañamiento del programa, con simulacros y retroalimentación personalizada.',
    ],
  },
]

function ensureSeedPosts(db) {
  const { count } = db.prepare('SELECT COUNT(*) AS count FROM posts').get()
  if (count > 0) return

  const insert = db.prepare(
    `INSERT INTO posts
      (slug, title, excerpt, category, content_html, image_src, image_alt, author_name, author_role, read_time, status, published_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?)`,
  )

  for (const post of SEED_POSTS) {
    const publishedAt = new Date(post.date).toISOString()
    insert.run(
      post.slug,
      post.title,
      post.excerpt,
      post.category,
      paragraphsToHtml(post.content),
      post.image.src,
      post.image.alt,
      post.author.name,
      post.author.role,
      post.readTime,
      publishedAt,
      publishedAt,
      publishedAt,
    )
  }

  console.warn(`[bbbsc-server] Se importaron ${SEED_POSTS.length} artículos existentes del blog a la base de datos.`)
}

export function seedDatabase() {
  const db = getDb()
  ensureSeedPosts(db)
}
