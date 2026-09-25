# Plantilla de landings BBB Student Center

Todas las nuevas landings deben publicar su ruta canónica bajo `/landing/<slug>`. Si existe una URL anterior, debe conservarse como redirección hacia la ruta canónica para no perder enlaces compartidos ni posicionamiento.

## Estructura visual

1. **Hero responsive:** fotografía distinta para escritorio y móvil mediante `picture`, con espacio negativo reservado para el título y la acción principal.
2. **Requisitos o datos clave:** bloque breve inmediatamente después del hero, con iconos y sin convertirlo en una cuadrícula de tarjetas pesadas.
3. **Contexto editorial:** texto, beneficios y una fotografía secundaria que expliquen la experiencia de forma natural.
4. **Datos del evento o programa:** franja ligera con fecha, lugar u otra información operativa.
5. **Conversión:** sección a dos columnas. El texto explica la acción; el formulario es el único panel protagonista.
6. **Confianza y condiciones:** protección de datos y las condiciones de la promoción se muestran como microsecciones separadas junto al registro.

## Diseño y experiencia

- En móvil, reducir radios, espacios laterales y altura del hero; nunca depender de un layout de dos columnas.
- Usar apariciones `fadeInUp` cortas y hover sutiles. Respetar `prefers-reduced-motion`.
- El contenido debe respirar: evitar colecciones de tarjetas iguales o fondos sólidos para una sección completa.
- Las fotos deben ser documentales, diversas y naturales; no usar texto incrustado ni logotipos dentro de la imagen.
- Mantener la paleta BBB: tinta, blanco y `#f9b000` únicamente como acento.

## Formularios y CRM

- Reutilizar los componentes de formulario, reCAPTCHA y estado de envío existentes.
- Cada envío debe tener un endpoint en la API, una definición visible en Admin y mapeos configurables a Clientify.
- Las notas de Clientify deben seguir este orden: origen y tipo de registro, línea de formulario/evento, separación, bloque **Datos de contacto** y, después, bloques de detalle específicos.
- Usar solo las etiquetas necesarias para el evento/programa y el origen; no añadir etiquetas de rol salvo que se hayan solicitado expresamente.
