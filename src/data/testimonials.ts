export interface Testimonial {
  name: string
  program: string
  rating: number
  quote: string
  images: [{ src: string; alt: string }, { src: string; alt: string }]
}

// Contenido de marcador de posición (placeholder) — nombres solo con inicial y citas
// genéricas, siguiendo la convención estándar hasta tener reseñas reales de participantes.
// Las fotos también son de referencia (destinos, no personas reales) hasta contar con
// fotos verídicas de cada participante (con su consentimiento) antes de publicar en producción.
export const testimonials: Testimonial[] = [
  {
    name: 'Camila R.',
    program: 'Work and Travel USA',
    rating: 5,
    quote:
      'La asesoría fue clave desde el DS-160 hasta la entrevista. Llegué a Estados Unidos sabiendo exactamente qué esperar y con trabajo asegurado desde el primer día.',
    images: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/1280px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg',
        alt: 'Nueva York, Estados Unidos',
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Front_view_of_Statue_of_Liberty_%28cropped%29.jpg/1280px-Front_view_of_Statue_of_Liberty_%28cropped%29.jpg',
        alt: 'Estatua de la Libertad en Nueva York',
      },
    ],
  },
  {
    name: 'Andrés M.',
    program: 'Woosong University · Corea del Sur',
    rating: 5,
    quote:
      'Nunca pensé que estudiar en Corea fuera posible con mi presupuesto. El equipo de BBB me guio en cada paso de la beca y hoy estoy viviendo la experiencia completa.',
    images: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Woosong_University_West_Campus_20190608_A01.jpg/1280px-Woosong_University_West_Campus_20190608_A01.jpg',
        alt: 'Campus de Woosong University en Daejeon, Corea del Sur',
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Korea-Daejeon-Uam_Historic_Park-01.jpg/1280px-Korea-Daejeon-Uam_Historic_Park-01.jpg',
        alt: 'Parque histórico de Uam, Daejeon, Corea del Sur',
      },
    ],
  },
  {
    name: 'Valentina P.',
    program: 'Trainee & Internship España',
    rating: 5,
    quote:
      'El acompañamiento fue muy cercano, siempre respondían mis preguntas rápido. Hacer mis prácticas en hotelería en España cambió por completo mi perfil profesional.',
    images: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/SF_maig_2_cropped.jpg',
        alt: 'Sagrada Família, Barcelona, España',
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Parc_guell_-_panoramio.jpg/1280px-Parc_guell_-_panoramio.jpg',
        alt: 'Park Güell, Barcelona, España',
      },
    ],
  },
  {
    name: 'Juan D.',
    program: 'Teacher Exchange',
    rating: 5,
    quote:
      'Enseñar en Estados Unidos con visa J-1 parecía un trámite imposible de resolver solo. Con la asesoría de BBB todo el proceso fue claro, ordenado y a tiempo.',
    images: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Chicago_River_ferry_b.jpg/1280px-Chicago_River_ferry_b.jpg',
        alt: 'Río Chicago y horizonte de la ciudad, Estados Unidos',
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/ISH_WC_Boston4.jpg/1280px-ISH_WC_Boston4.jpg',
        alt: 'Vista de Boston, Estados Unidos',
      },
    ],
  },
]
