export type PreviewCustomization = {
  brand: {
    name: string
  }
  theme: {
    font_heading: string
    font_body: string
  }
  content: {
    hero_title: string
    hero_subtitle: string
  }
  assets: {
    logo_url: string
    hero_image_url: string
  }
}

export const DEFAULT_PREVIEW_CUSTOMIZATION: PreviewCustomization = {
  brand: {
    name: '',
  },
  theme: {
    font_heading: 'Inter',
    font_body: 'Inter',
  },
  content: {
    hero_title: '',
    hero_subtitle: '',
  },
  assets: {
    logo_url: '',
    hero_image_url: '',
  },
}

function safeString(value: unknown, max = 300): string {
  return String(value || '').trim().slice(0, max)
}

function safeUrl(value: unknown): string {
  const raw = safeString(value, 1000)
  if (!raw) return ''

  try {
    const parsed = new URL(raw)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return parsed.toString()
  } catch (_error) {
    return ''
  }

  return ''
}

export function normalizePreviewCustomization(input: unknown): PreviewCustomization {
  const source = input && typeof input === 'object' ? (input as Record<string, any>) : {}
  const brand = source.brand && typeof source.brand === 'object' ? source.brand : {}
  const theme = source.theme && typeof source.theme === 'object' ? source.theme : {}
  const content = source.content && typeof source.content === 'object' ? source.content : {}
  const assets = source.assets && typeof source.assets === 'object' ? source.assets : {}

  return {
    brand: {
      name: safeString(brand.name, 120),
    },
    theme: {
      font_heading: safeString(theme.font_heading, 80) || DEFAULT_PREVIEW_CUSTOMIZATION.theme.font_heading,
      font_body: safeString(theme.font_body, 80) || DEFAULT_PREVIEW_CUSTOMIZATION.theme.font_body,
    },
    content: {
      hero_title: safeString(content.hero_title, 180),
      hero_subtitle: safeString(content.hero_subtitle, 280),
    },
    assets: {
      logo_url: safeUrl(assets.logo_url),
      hero_image_url: safeUrl(assets.hero_image_url),
    },
  }
}
