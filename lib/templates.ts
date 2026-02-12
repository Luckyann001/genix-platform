import { createClient } from '@/lib/supabase/server'
import {
  getTemplateBySlug as getCatalogTemplateBySlug,
  listPublishedTemplates as listCatalogTemplates,
} from '@/lib/template-catalog'

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

const DEFAULT_CAPABILITY_MAP: TemplateCapabilityMap = {
  editable: ['Text', 'Theme', 'Images', 'Sections'],
  notEditable: ['Backend logic', 'Auth flow'],
}

function formatCategory(value: unknown): string {
  const raw = String(value || '').trim()
  if (!raw) return 'General'
  return raw
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

function normalizeTemplate(row: any, developer: any): TemplateRecord {
  const previewData = row?.preview_data && typeof row.preview_data === 'object' ? row.preview_data : {}

  const capabilityMap =
    previewData.capability_map &&
    Array.isArray(previewData.capability_map.editable) &&
    (Array.isArray(previewData.capability_map.notEditable) ||
      Array.isArray(previewData.capability_map.not_editable))
      ? {
          editable: previewData.capability_map.editable,
          notEditable: Array.isArray(previewData.capability_map.notEditable)
            ? previewData.capability_map.notEditable
            : previewData.capability_map.not_editable,
        }
      : DEFAULT_CAPABILITY_MAP

  const id = String(row?.id || '')
  const title = String(row?.name || row?.title || 'Untitled template')

  return {
    id,
    slug: String(row?.slug || id),
    title,
    category: formatCategory(row?.category),
    preview_image: String(row?.preview_image || '/images/templates/placeholder.jpg'),
    price: Number(row?.price || 0),
    developer_name:
      String(developer?.full_name || developer?.username || developer?.email || '').trim() || 'Verified Developer',
    developer_bio: String(developer?.bio || 'Template creator on Genix marketplace.'),
    live_preview_url: String(row?.demo_url || row?.live_preview_url || '#'),
    summary: String(previewData.summary || row?.summary || row?.description || 'Production-ready template.'),
    capability_map: capabilityMap,
    published: true,
  }
}

function templateReviewStatus(template: any): string {
  const previewData = template?.preview_data && typeof template.preview_data === 'object' ? template.preview_data : {}
  return String(previewData.review_status || '').toLowerCase()
}

function isTemplatePublic(template: any): boolean {
  const status = templateReviewStatus(template)
  if (status) return status === 'approved'

  if (typeof template?.published === 'boolean') return template.published
  return true
}

async function fetchProfilesById(ids: string[]) {
  if (ids.length === 0) return new Map<string, any>()

  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, full_name, bio, email')
    .in('id', ids)

  if (error || !data) return new Map<string, any>()

  return new Map<string, any>(data.map((profile) => [String(profile.id), profile]))
}

type ListTemplatesOptions = {
  includeUnapproved?: boolean
}

export async function listMarketplaceTemplates(options: ListTemplatesOptions = {}): Promise<TemplateRecord[]> {
  const includeUnapproved = Boolean(options.includeUnapproved)

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('templates')
      .select('id, name, description, price, category, demo_url, preview_data, developer_id, created_at, published')
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) {
      return listCatalogTemplates()
    }

    const selected = includeUnapproved ? data : data.filter((template) => isTemplatePublic(template))

    const developerIds = Array.from(
      new Set(
        selected
          .map((template) => template.developer_id)
          .filter((developerId): developerId is string => Boolean(developerId))
      )
    )

    const profileMap = await fetchProfilesById(developerIds)

    return selected.map((template) => normalizeTemplate(template, profileMap.get(String(template.developer_id))))
  } catch (error) {
    console.error('listMarketplaceTemplates failed, falling back to catalog:', error)
    return listCatalogTemplates()
  }
}

export async function getMarketplaceTemplateBySlugOrId(slugOrId: string): Promise<TemplateRecord | null> {
  const templates = await listMarketplaceTemplates()
  const exact = templates.find((template) => template.id === slugOrId || template.slug === slugOrId)
  if (exact) return exact

  return getCatalogTemplateBySlug(slugOrId)
}

export async function listMarketplaceCategories(): Promise<string[]> {
  const templates = await listMarketplaceTemplates()
  return Array.from(new Set(templates.map((template) => template.category))).sort((a, b) => a.localeCompare(b))
}
