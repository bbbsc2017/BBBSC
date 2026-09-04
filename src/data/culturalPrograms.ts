export interface CulturalProgram {
  slug: string
  title: string
  country: string
  tagline: string
  description: string
  cta: string
  requirements: { label: string; value: string }[]
  benefits: string[]
  duration: string
  keyFacts: string[]
  image: { src: string; alt: string }
  faq: { question: string; answer: string }[]
  pricing?: {
    badge?: string
    headline?: string
    price?: { amount: string; unit?: string; originalAmount?: string }
    items: string[]
    note?: string
  }
  /** Ejemplos de puestos de trabajo, opcional — se muestran como etiquetas con ícono. */
  jobExamples?: string[]
  jobExamplesNote?: string
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
      { label: 'Edad', value: '18 a 26 años' },
      { label: 'Nivel de inglés', value: 'Mínimo B1 (conversacional)' },
      { label: 'Modalidad de estudio', value: 'Tiempo completo, jornada diurna y presencial' },
      { label: 'Restricciones', value: 'No se aceptan carreras virtuales ni último semestre' },
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
        answer:
          'No. Para postularte a Work and Travel USA basta con un nivel B1 conversacional, es decir, poder mantener una conversación básica y entender instrucciones de trabajo en inglés. No se exige un nivel avanzado ni certificación internacional. La mayoría de participantes llega con ese nivel intermedio y lo perfecciona de forma natural durante los cerca de 4 meses de inmersión total, ya que conviven y trabajan a diario en inglés junto a compañeros y clientes estadounidenses.',
      },
      {
        question: '¿Puedo aplicar si estudio una carrera virtual?',
        answer:
          'No, el programa exige que seas estudiante universitario activo, de tiempo completo, en modalidad presencial y jornada diurna al momento de aplicar y de viajar. Este requisito no lo define BBB Student Center sino el propio programa de intercambio cultural J-1 en Estados Unidos, que busca participantes vinculados de forma activa a una institución académica presencial. Si estudias en modalidad virtual o a distancia, no podrás participar en esta versión del programa, pero puedes escribirnos para revisar si aplicas a otro de nuestros programas culturales o académicos.',
      },
      {
        question: '¿Cuánto dura la experiencia en total?',
        answer:
          'La experiencia completa dura aproximadamente 4 meses de trabajo, entre el 15 de mayo y el 30 de agosto, más 30 días adicionales que puedes usar libremente para viajar por Estados Unidos como turista antes de regresar. En total son cerca de 5 meses fuera del país. El proceso de postulación, documentación y trámite de la visa J-1 comienza varios meses antes de esa fecha de viaje, por lo que te recomendamos iniciar tu proceso con BBB Student Center con la mayor anticipación posible para asegurar cupo y buenas opciones laborales.',
      },
      {
        question: '¿Qué tipo de empleos voy a conseguir?',
        answer:
          'Tienes acceso a más de 100 opciones laborales en hoteles, restaurantes, parques acuáticos, parques de diversiones y resorts en distintos estados de Estados Unidos. Entre los puestos más comunes están salvavidas (lifeguard), recepción y atención al cliente, mesero/a, operador de atracciones, housekeeping y soporte en cocina o alimentos y bebidas. El puesto específico depende de tu perfil, tu nivel de inglés y la disponibilidad del empleador al momento de tu proceso; tu asesor BBBSC te acompaña para postularte a las ofertas que mejor se ajusten a ti.',
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
      { label: 'Internship', value: 'Último semestre o hasta 12 meses post-graduación' },
      { label: 'Trainee', value: 'Mínimo 1 año con título, o 5 años sin título' },
      { label: 'Documentos', value: 'Pasaporte vigente' },
      { label: 'Perfil', value: 'CV en inglés y certificado de estudios' },
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
      { label: 'Edad', value: 'Mínima 18 años' },
      { label: 'Perfil académico', value: 'Estudiante tiempo completo o graduado' },
      { label: 'Experiencia', value: 'Profesionales, mínimo 2 años' },
      { label: 'Antigüedad de estudios', value: 'Máximo 12 años desde graduarse' },
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
      { label: 'Experiencia', value: 'Mínimo 2 años certificada en gastronomía, hotelería o turismo' },
      { label: 'Edad', value: 'Mayor de 18 años' },
      { label: 'Nivel de inglés', value: 'B2 conversacional' },
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
    pricing: {
      badge: 'Costos referenciales',
      headline: 'Inversión en Trainee & Internship Asia',
      items: [
        'Inscripción: $250.000 COP',
      ],
      note: 'Tu asesor confirmará los valores y condiciones vigentes para tu perfil.',
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
      { label: 'Formación', value: 'Licenciatura completa + 2 años de experiencia docente' },
      { label: 'Nivel de inglés', value: 'B2-C1 (avanzado)' },
      { label: 'Edad y documentos', value: 'Mayor de 18 años, pasaporte vigente' },
      { label: 'Perfil', value: 'CV en inglés, escalafón docente, certificado Foreign' },
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
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Dallas_Skyline_with_Arts_District.jpg/1280px-Dallas_Skyline_with_Arts_District.jpg',
      alt: 'Horizonte de Dallas, Texas, uno de los destinos comunes de Teacher Exchange',
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
      { label: 'Formación', value: 'Sexto semestre o hasta 12 meses post-grado' },
      { label: 'Nivel de inglés', value: 'B2 conversacional' },
      { label: 'Edad', value: '18 años en adelante' },
      { label: 'Documentos', value: 'Pasaporte vigente y examen ITEP' },
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
      { label: 'Edad', value: '18 a 26 años' },
      { label: 'Documentos', value: 'Pasaporte vigente y licencia de conducción reciente' },
      { label: 'Nivel de inglés', value: 'B2' },
      { label: 'Experiencia', value: '1000 a 1500 horas cuidando niños' },
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
      { label: 'Edad', value: 'Mínima 18 años' },
      { label: 'Documentos', value: 'Pasaporte vigente' },
      { label: 'Formación', value: 'Culinaria, hotelería o turismo' },
      { label: 'Nivel de idioma', value: 'Según la vacante y el empleador' },
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
  {
    slug: 'work-and-travel-alemania',
    title: 'Work and Travel Alemania',
    country: 'Alemania',
    tagline: 'Gana en euros, vive en Europa y conviértete en protagonista de tu propia historia de intercambio',
    description:
      'Programa de trabajo temporal en Alemania para estudiantes universitarios internacionales durante su receso semestral oficial. Trabajas en empresas aliadas de nuestra red (fábricas, logística, producción, aeropuertos y más), con salario mínimo garantizado, alojamiento compartido organizado y acompañamiento desde tu llegada hasta tu salida.',
    cta: 'Trabaja en Alemania',
    requirements: [
      { label: 'Edad', value: 'Mayor de 18 años, máximo 34' },
      { label: 'Idiomas', value: 'Inglés A2' },
      { label: 'Nivel académico', value: 'Estudiante universitario activo' },
      { label: 'Duración', value: '80 a 90 días' },
    ],
    benefits: [
      'Salario mínimo garantizado de 15,33 EUR brutos por hora',
      'Mínimo 30 horas garantizadas por semana completa',
      'Alojamiento compartido organizado, con servicios básicos incluidos',
      'Acompañamiento en la llegada, el primer día de trabajo y la salida',
    ],
    duration: '80 a 90 días durante tus vacaciones semestrales',
    keyFacts: [
      '15,33 EUR/hora bruto mínimo',
      '30 h garantizadas por semana',
      'Promedio de 173 h/mes en invierno 2026',
      'Alojamiento: 450-600 EUR/mes',
    ],
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/GER_Rothenburg_ob_der_Tauber%2C_Marktplatz_001.jpg/1280px-GER_Rothenburg_ob_der_Tauber%2C_Marktplatz_001.jpg',
      alt: 'Casas de colores en la plaza del mercado de Rothenburg ob der Tauber, Alemania',
    },
    jobExamplesNote: 'La asignación exacta depende de la empresa, el lugar, la demanda y tu perfil. Los proyectos de aeropuerto suelen exigir inglés B1 como mínimo; en general se recomienda A2. El alemán nunca es obligatorio. Muchas tareas requieren estar de pie, caminar, levantar peso o repetir movimientos.',
    jobExamples: [
      'Fábrica de chocolate',
      'Almacén y logística',
      'Producción y montaje',
      'Manipulación de equipaje',
      'Sala business',
      'Catering aeroportuario',
      'Embalaje y control de calidad',
      'Otras tareas estacionales',
    ],
    faq: [
      {
        question: '¿Cuánto dinero puedo tener disponible al final, con un ejemplo real?',
        answer:
          'Con el promedio de 173 horas trabajadas en el invierno de 2026 (173 × 15,33 EUR), el salario bruto queda en 2.652,09 EUR. A eso se le resta el impuesto salarial estimado (12-15%, entre 318 y 398 EUR) y el alojamiento supuesto (550 EUR), lo que deja entre 1.704 y 1.784 EUR después de impuestos y alojamiento. Restando un estimado de gastos personales —comida (250 EUR), Deutschland-Ticket (63 EUR) y SIM (20 EUR), en total 333 EUR—, el importe que te puede quedar disponible ronda entre 1.371 y 1.451 EUR. Es un ejemplo orientativo: tus horas, tu alquiler real y tus decisiones personales cambian el resultado.',
      },
      {
        question: '¿Cuándo recibo mi salario y puedo pedir un adelanto si lo necesito antes?',
        answer:
          'Las horas se calculan normalmente del primer al último día de cada mes natural, y el salario se paga el día 15 del mes siguiente —no se garantiza un pago anterior a esa fecha—. Si necesitas dinero antes, desde tu segunda semana de trabajo puedes solicitar anticipos: al menos 3 son gratuitos, normalmente desde 125 EUR (habitualmente 150 EUR o más según tu saldo ya ganado); algunas empresas cobran 15 EUR por anticipos adicionales. Los anticipos se descuentan de tu nómina cuando hay saldo suficiente.',
      },
      {
        question: '¿Puedo trabajar más horas de las garantizadas si rindo bien?',
        answer:
          'Sí, aunque nunca es algo garantizado. Todas las empresas usan cuentas de tiempo para registrar tus horas, y las pausas no se pagan. Si hay demanda, turnos disponibles y muestras un buen rendimiento, es posible que te asignen más horas de las 30 mínimas garantizadas —el horario habitual ya suele ser de 35 a 37,5 horas semanales—. Como referencia, en el invierno de 2026 el promedio mensual fue de 173 horas, con un pico de 220 horas para el estudiante con más horas registradas en un mes natural completo.',
      },
      {
        question: '¿Cómo es la logística de llegada, el primer día de trabajo y la salida del país?',
        answer:
          'No debes reservar vuelos hasta que tu empresa y BBBSC hayan confirmado y coordinado tu asignación por completo. La llegada suele programarse un viernes o sábado, y el trabajo empieza normalmente el lunes siguiente; el traslado desde el aeropuerto está incluido y siempre recibes acompañamiento —ya sea presencial o instrucciones detalladas con fotos, video o mapa de ruta— para tu primer trayecto. Una vez llegas, abres una cuenta bancaria en la Unión Europea de forma sencilla en línea. La salida del proyecto suele ser un domingo, y los vuelos de ida y regreso a Alemania corren por tu cuenta.',
      },
      {
        question: '¿Hay beneficios o costos extra que varíen según la empresa a la que me asignen?',
        answer:
          'Sí, y por eso solo es vinculante lo que quede confirmado por escrito en tu asignación. Según el proyecto, puede haber recargos por trabajar de noche, domingos o festivos, y algunos ofrecen hasta 25% adicional por horas extra autorizadas. El Deutschland-Ticket de transporte cuesta 63 EUR al mes, aunque varias empresas lo dan con descuento o gratis. Algunos proyectos incluso regalan hasta tres días de alojamiento sin costo al llegar. La ropa de trabajo casi siempre se entrega (a veces con un depósito reembolsable), el seguro médico de viaje es obligatorio durante todo el programa, y las vacaciones que no alcances a usar se pagan al finalizar tu contrato.',
      },
    ],
    pricing: {
      badge: 'Precio de lanzamiento',
      headline: 'Inversión en Work and Travel Alemania',
      price: { amount: '€600', unit: 'EUR', originalAmount: '€1.000' },
      items: [
        'Asesoría del programa',
        'Asesoría del viaje',
        'Seguro internacional',
      ],
      note: 'Tu asesor confirmará los valores y condiciones vigentes para tu perfil.',
    },
  },
]

export function getCulturalProgram(slug: string) {
  return culturalPrograms.find((program) => program.slug === slug)
}
