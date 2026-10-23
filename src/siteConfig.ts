/**
 * Configuración centralizada de marca y datos comerciales de NODERA.
 * Editá este archivo para cambiar el nombre, contacto, redes sociales,
 * textos del hero, servicios, metodología, diferenciales y preguntas frecuentes.
 *
 * No subas este archivo con valores secretos. Los secretos van en .env
 * (ver .env.example).
 */

export const site = {
  name: "NODERA",
  /** Eslogan corto usado en el header y el footer. */
  tagline: "Diseño web, imagen de marca y marketing digital",
  /** Descripción breve para SEO y Open Graph. Editable. */
  description:
    "Diseñamos experiencias web a medida y trabajamos la imagen digital de tu empresa para ayudarte a comunicar mejor lo que hacés.",
  /** URL pública definitiva. Cambiala al conectar el dominio propio. */
  url: "https://www.nodera.com.ar",
  /** Mercado inicial. */
  market: "Argentina",
  /** Idioma principal del sitio. */
  locale: "es-AR",
} as const;

export const contact = {
  email: "noderaservicios@gmail.com",
  /** Número de teléfono centralizado. Verificá el prefijo antes de publicar. */
  phone: "+543416135414",
  /** Texto legible del teléfono para mostrar en la interfaz. */
  phoneDisplay: "+54 341 613 5414",
  /** Enlace de WhatsApp. Solo activar si se verifica que el número tiene WhatsApp. */
  whatsappUrl: "https://wa.me/543416135414",
  /** Redes sociales. Dejá el string vacío si la red no está confirmada. */
  social: {
    instagram: "@noderasoluciones",
    linkedin: "",
    facebook: "",
  },
} as const;

export const nav = [
  { label: "Inicio", href: "#inicio" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Servicios", href: "#servicios" },
  { label: "Metodología", href: "#metodologia" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Preguntas", href: "#preguntas" },
  { label: "Contacto", href: "#contacto" },
] as const;

export const hero = {
  title: "Tu empresa merece una presencia digital a su altura",
  text: "Diseñamos experiencias web a medida y trabajamos la imagen digital de tu empresa para ayudarte a comunicar mejor lo que hacés.",
  ctaPrimary: { label: "Hablemos de tu proyecto", href: "#contacto" },
  ctaSecondary: { label: "Conocé nuestros servicios", href: "#servicios" },
} as const;

export const about = {
  title: "Quiénes somos",
  paragraphs: [
    "En NODERA trabajamos la imagen y la presencia digital de cada empresa con atención personalizada y criterio profesional.",
    "Nos enfocamos en entender tu negocio, tus objetivos y tu forma de comunicar para diseñar soluciones coherentes con tu identidad.",
    "Creemos en el trabajo colaborativo, la claridad y el cuidado de los detalles. Cada proyecto se piensa desde cero, sin plantillas genéricas.",
  ],
  // Textos editables. Reemplazá estos párrafos por la presentación definitiva.
} as const;

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  cta: { label: string; href: string };
}

export const services: Service[] = [
  {
    id: "diseno-web",
    icon: "layout",
    title: "Diseño web a medida",
    description:
      "Sitios institucionales y páginas comerciales diseñados desde cero, adaptados a la estructura y los objetivos de cada empresa.",
    features: [
      "Sitios corporativos, landing pages y tiendas online",
      "Diseño responsive para todos los dispositivos",
      "Estructura adaptada a cada negocio",
      "Experiencia de usuario y claridad de navegación",
    ],
    cta: { label: "Consultar por este servicio", href: "#contacto" },
  },
  {
    id: "imagen-marca",
    icon: "palette",
    title: "Imagen de marca",
    description:
      "Coherencia visual y comunicación alineada con la personalidad de tu negocio, apreciando la identidad de tu marca.",
    features: [
      "Asesoría visual en todos los canales",
      "Presentación digital de la empresa",
      "Aplicación consistente de la identidad visual",
      "Comunicación alineada con la personalidad del negocio",
    ],
    cta: { label: "Consultar por este servicio", href: "#contacto" },
  },
  {
    id: "marketing-digital",
    icon: "trending-up",
    title: "Marketing digital",
    description:
      "Presencia y comunicación online con estrategia de contenidos y acciones de visibilidad adecuadas a tu público objetivo.",
    features: [
      "Presencia y comunicación online",
      "Estrategia de contenidos y canales digitales",
      "Acciones de visibilidad adaptadas a tus clientes",
      "Acompañamiento según los objetivos del proyecto",
    ],
    cta: { label: "Consultar por este servicio", href: "#contacto" },
  },
];

export interface MethodStep {
  number: string;
  title: string;
  description: string;
}

export const methodology: MethodStep[] = [
  {
    number: "01",
    title: "Conversamos y conocemos el negocio",
    description: "Una primera charla para entender qué hacés, a quién apuntás y qué necesitás.",
  },
  {
    number: "02",
    title: "Definimos los objetivos y necesidades",
    description: "Identificamos los objetivos concretos y las prioridades del proyecto.",
  },
  {
    number: "03",
    title: "Diseñamos una solución a medida",
    description: "Trabajamos la propuesta visual y funcional pensada específicamente para tu empresa.",
  },
  {
    number: "04",
    title: "Desarrollamos y revisamos el proyecto",
    description: "Construimos la solución y la revisamos junto con vos antes de la entrega.",
  },
  {
    number: "05",
    title: "Entregamos y acompañamos",
    description: "Entregamos el proyecto y acompañamos según el servicio contratado.",
  },
];

export interface ProjectCard {
  id: string;
  name: string;
  client?: string;
  category: string;
  description: string;
  coverImage?: string;
  gallery?: string[];
  videoUrl?: string;
  liveUrl?: string;
  technologies?: string[];
  type: "real" | "conceptual";
  published: boolean;
}

/**
 * Portfolio de proyectos.
 *
 * Para agregar un proyecto, copiá un objeto de esta lista y completá los campos.
 * Solo agregá proyectos reales autorizados. Si un proyecto es conceptual,
 * usá type: "conceptual" para que se identifique claramente.
 *
 * Ejemplo de imagen de portada: "/projects/mi-proyecto/cover.jpg"
 * Colocá las imágenes en la carpeta public/projects/<id>/.
 *
 * Dejá el array vacío si todavía no hay proyectos para publicar.
 * La sección no muestra tarjetas vacías ni contenido ficticio.
 */
export const projects: ProjectCard[] = [];

export interface Differential {
  icon: string;
  title: string;
  description: string;
}

export const differentials: Differential[] = [
  {
    icon: "target",
    title: "Diseño adaptado a cada empresa",
    description: "Cada proyecto se piensa desde los objetivos y la identidad del negocio, sin plantillas genéricas.",
  },
  {
    icon: "users",
    title: "Atención personalizada",
    description: "Trabajamos con cercanía y comunicación clara durante todo el proceso.",
  },
  {
    icon: "layers",
    title: "Coherencia entre marca y presencia digital",
    description: "Cuidamos que la imagen digital refleje de forma consistente la identidad de tu empresa.",
  },
  {
    icon: "eye",
    title: "Cuidado de los detalles",
    description: "Prestamos atención a los detalles visuales y funcionales que marcan la diferencia.",
  },
];

export interface FaqItem {
  question: string;
  answer: string;
  /** Si la respuesta depende de una decisión comercial pendiente, marcá true. */
  pending?: boolean;
}

export const faqs: FaqItem[] = [
  {
    question: "¿Qué tipo de páginas web desarrollan?",
    answer:
      "Desarrollamos sitios institucionales y páginas comerciales diseñados a medida, adaptados a la estructura y los objetivos de cada empresa.",
  },
  {
    question: "¿Cómo comienza un proyecto?",
    answer:
      "El proyecto comienza con una conversación para conocer tu negocio, tus objetivos y tus necesidades. A partir de ahí definimos juntos los siguientes pasos.",
  },
  {
    question: "¿Puedo solicitar una web diseñada a medida?",
    answer:
      "Sí. Trabajamos cada proyecto desde cero, sin plantillas genéricas, para que la solución se ajuste a tu empresa.",
  },
  {
    question: "¿Qué información necesito aportar?",
    answer:
      "Nos sirve información sobre tu empresa, tus servicios, tu público y tus objetivos. Si tenés materiales de marca existentes, también son útiles.",
  },
  {
    question: "¿Cómo puedo solicitar una propuesta?",
    answer:
      "Escribinos desde el formulario de contacto o directamente por correo. Con la información básica de tu proyecto te respondemos para coordinar una propuesta.",
  },
];

export const footer = {
  description:
    "Diseño web a medida, imagen de marca y marketing digital para empresas que quieren profesionalizar su presencia online.",
} as const;
