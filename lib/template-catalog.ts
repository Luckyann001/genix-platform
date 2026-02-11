export type TemplateCapabilityMap = {
  editable: string[]
  notEditable: string[]
}

export type TemplateRecord = {
  id: string
  slug: string
  title: string
  category: string
  preview_image: string
  price: number
  developer_name: string
  developer_bio: string
  live_preview_url: string
  summary: string
  capability_map: TemplateCapabilityMap
  published: boolean
}

const templates: TemplateRecord[] = [
  {
    id: 'tpl_001',
    slug: 'saas-launchpad',
    title: 'SaaS Launchpad',
    category: 'SaaS',
    preview_image: '/images/templates/saas-launchpad.jpg',
    price: 299,
    developer_name: 'Alex Rivera',
    developer_bio: 'Full-stack engineer focused on B2B SaaS products.',
    live_preview_url: 'https://example.com/saas-launchpad-demo',
    summary: 'Conversion-focused SaaS marketing site with auth-ready flows and dashboard UI.',
    capability_map: {
      editable: ['Text', 'Theme', 'Images', 'Sections'],
      notEditable: ['Backend logic', 'Auth flow'],
    },
    published: true,
  },
  {
    id: 'tpl_002',
    slug: 'commerce-pro',
    title: 'Commerce Pro',
    category: 'E-commerce',
    preview_image: '/images/templates/commerce-pro.jpg',
    price: 399,
    developer_name: 'Sarah Chen',
    developer_bio: 'Product engineer building high-performance storefronts.',
    live_preview_url: 'https://example.com/commerce-pro-demo',
    summary: 'Modern storefront with strong product merchandising and checkout-ready UX.',
    capability_map: {
      editable: ['Text', 'Theme', 'Images', 'Sections'],
      notEditable: ['Backend logic', 'Auth flow'],
    },
    published: true,
  },
  {
    id: 'tpl_003',
    slug: 'portfolio-elevate',
    title: 'Portfolio Elevate',
    category: 'Portfolio',
    preview_image: '/images/templates/portfolio-elevate.jpg',
    price: 149,
    developer_name: 'Michael Johnson',
    developer_bio: 'Frontend developer specializing in portfolio and personal branding sites.',
    live_preview_url: 'https://example.com/portfolio-elevate-demo',
    summary: 'Minimal portfolio site template for agencies, freelancers, and designers.',
    capability_map: {
      editable: ['Text', 'Theme', 'Images', 'Sections'],
      notEditable: ['Backend logic', 'Auth flow'],
    },
    published: true,
  },
  {
    id: 'tpl_004',
    slug: 'agency-convert',
    title: 'Agency Convert',
    category: 'Agency',
    preview_image: '/images/templates/agency-convert.jpg',
    price: 249,
    developer_name: 'Priya Nair',
    developer_bio: 'Growth-minded frontend engineer for service businesses.',
    live_preview_url: 'https://example.com/agency-convert-demo',
    summary: 'Service business template with strong lead generation and booking-focused pages.',
    capability_map: {
      editable: ['Text', 'Theme', 'Images', 'Sections'],
      notEditable: ['Backend logic', 'Auth flow'],
    },
    published: true,
  },
  {
    id: 'tpl_005',
    slug: 'startup-docs-kit',
    title: 'Startup Docs Kit',
    category: 'SaaS',
    preview_image: '/images/templates/startup-docs-kit.jpg',
    price: 179,
    developer_name: 'Emma Davis',
    developer_bio: 'Technical writer and frontend developer for SaaS docs platforms.',
    live_preview_url: 'https://example.com/startup-docs-kit-demo',
    summary: 'Docs and help center template designed for SaaS onboarding.',
    capability_map: {
      editable: ['Text', 'Theme', 'Images', 'Sections'],
      notEditable: ['Backend logic', 'Auth flow'],
    },
    published: true,
  },
  {
    id: 'tpl_006',
    slug: 'internal-admin-pro',
    title: 'Internal Admin Pro',
    category: 'Dashboard',
    preview_image: '/images/templates/internal-admin-pro.jpg',
    price: 279,
    developer_name: 'Daniel Kim',
    developer_bio: 'Full-stack engineer who builds internal tools and analytics dashboards.',
    live_preview_url: 'https://example.com/internal-admin-pro-demo',
    summary: 'Admin dashboard shell for operations and analytics workflows.',
    capability_map: {
      editable: ['Text', 'Theme', 'Images', 'Sections'],
      notEditable: ['Backend logic', 'Auth flow'],
    },
    published: false,
  },
]

export function listPublishedTemplates() {
  return templates.filter((template) => template.published)
}

export function listTemplateCategories() {
  const categories = new Set(listPublishedTemplates().map((template) => template.category))
  return Array.from(categories).sort()
}

export function getTemplateBySlug(slug: string) {
  return listPublishedTemplates().find((template) => template.slug === slug) ?? null
}
