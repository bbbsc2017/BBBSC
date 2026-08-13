export interface SessionUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  localRole: { id: number; name: string; label: string; color: string } | null
  permissions: Record<string, boolean>
}

export const PANEL_PERMISSIONS = {
  dashboardView: 'dashboard.view', postsView: 'posts.view', postsViewAll: 'posts.viewAll', postsCreate: 'posts.create', postsEdit: 'posts.edit',
  postsPublish: 'posts.publish', postsDelete: 'posts.delete', mediaView: 'media.view', mediaManage: 'media.manage',
  commentsView: 'comments.view', commentsManage: 'comments.manage', usersView: 'users.view',
  usersManageAccess: 'users.manageAccess', usersAssignRoles: 'users.assignRoles', analyticsView: 'analytics.view',
  trackingManage: 'tracking.manage', rolesView: 'roles.view', rolesManage: 'roles.manage',
  offersView: 'offers.view', offersManage: 'offers.manage', offersAssign: 'offers.assign', offersExport: 'offers.export',
} as const

export function can(user: SessionUser | null, permission: string) {
  return Boolean(user && (user.role === 'SUPER_ADMIN' || user.permissions?.[permission]))
}

export interface AdminPostSummary {
  id: number
  slug: string
  title: string
  excerpt: string
  category: 'Embajada' | 'Programas' | 'Consejos'
  status: 'draft' | 'published' | 'withdrawn'
  publishedAt: string | null
  updatedAt: string
  imageSrc: string
  authorName: string
}

export interface PostForm extends AdminPostSummary {
  contentHtml: string
  imageAlt: string
  authorRole: string
  readTime: string
  createdAt?: string
}

export const STAFF_ROLES = ['SUPER_ADMIN', 'ADMIN', 'GURU', 'STAFF', 'INSTRUCTOR']

export async function requestJson(path: string, options?: RequestInit) {
  const response = await fetch(path, options)
  const data = await response.json().catch(() => ({ ok: false }))
  if (!response.ok || !data.ok) throw new Error(data.error || 'No pudimos completar la solicitud.')
  return data
}

export function formatPanelDate(value?: string | null) {
  if (!value) return 'Sin publicar'
  return new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value))
}

export function emptyPost(user: SessionUser) {
  return {
    slug: '', title: '', excerpt: '', category: 'Programas' as const,
    contentHtml: '<p>Escribe aquí el contenido de la publicación.</p>', imageSrc: '', imageAlt: '',
    authorName: `${user.firstName} ${user.lastName}`.trim(), authorRole: 'Equipo BBBSC',
    readTime: '5 min de lectura', status: 'draft' as const,
  }
}
