const DEFAULT_POST_IMAGE =
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'

const LOCAL_POST_IMAGE_BY_SLUG: Record<string, string> = {
  'las-soft-skills-nunca-fueron-soft-el-auge-de-la-ia-esta-revelando-lo-que-siempre':
    '/images/posts/las-soft-skills-nunca-fueron-soft-el-auge-de-la-ia-esta-revelando-lo-que-siempre.webp',
  'probar-bien-o-llorar-despues-lo-que-me-ha-ensenado-qa-en-proyectos-salesforce':
    '/images/posts/probar-bien-o-llorar-despues-lo-que-me-ha-ensenado-qa-en-proyectos-salesforce.webp',
  'el-reto-de-probar-chatbots-de-ia-cuando-2-2-ya-no-es-siempre-4':
    '/images/posts/el-reto-de-probar-chatbots-de-ia-cuando-2-2-ya-no-es-siempre-4.webp',
  'los-7-pecados-capitales-del-prompt-engineering-aplicado-al-testing':
    '/images/posts/los-7-pecados-capitales-del-prompt-engineering-aplicado-al-testing.webp',
  'la-verdad-incomoda-de-los-equipos-de-qa':
    '/images/posts/la-verdad-incomoda-de-los-equipos-de-qa.webp',
  'la-historia-de-cuando-la-nasa-perdio-una-nave-por-no-tener-qa':
    '/images/posts/la-historia-de-cuando-la-nasa-perdio-una-nave-por-no-tener-qa.webp',
  'uat-menos-ticks-y-mas-lunes-por-la-manana':
    '/images/posts/uat-menos-ticks-y-mas-lunes-por-la-manana.webp',
  'mrbeast-burger-y-la-leccion-de-la-calidad-que-nadie-quiere-escuchar':
    '/images/posts/mrbeast-burger-y-la-leccion-de-la-calidad-que-nadie-quiere-escuchar.webp',
  'no-es-magia-es-metodo-y-un-poco-de-ia-probando-flujos-complejos-sin-morir-parte-':
    '/images/posts/no-es-magia-es-metodo-y-un-poco-de-ia-probando-flujos-complejos-sin-morir-parte-.webp',
}

export function resolvePostImage(
  slug?: string | null,
  remoteImageUrl?: string | null,
  fallbackImageUrl = DEFAULT_POST_IMAGE
) {
  if (slug && LOCAL_POST_IMAGE_BY_SLUG[slug]) {
    return LOCAL_POST_IMAGE_BY_SLUG[slug]
  }

  return remoteImageUrl || fallbackImageUrl
}

export function getLocalPostImageEntries() {
  return LOCAL_POST_IMAGE_BY_SLUG
}
