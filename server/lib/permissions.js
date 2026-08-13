export const PERMISSIONS = {
  DASHBOARD_VIEW: 'dashboard.view',
  POSTS_VIEW: 'posts.view',
  POSTS_VIEW_ALL: 'posts.viewAll',
  POSTS_CREATE: 'posts.create',
  POSTS_EDIT: 'posts.edit',
  POSTS_PUBLISH: 'posts.publish',
  POSTS_DELETE: 'posts.delete',
  MEDIA_VIEW: 'media.view',
  MEDIA_MANAGE: 'media.manage',
  COMMENTS_VIEW: 'comments.view',
  COMMENTS_MANAGE: 'comments.manage',
  USERS_VIEW: 'users.view',
  USERS_MANAGE_ACCESS: 'users.manageAccess',
  USERS_ASSIGN_ROLES: 'users.assignRoles',
  ANALYTICS_VIEW: 'analytics.view',
  TRACKING_MANAGE: 'tracking.manage',
  ROLES_VIEW: 'roles.view',
  ROLES_MANAGE: 'roles.manage',
  OFFERS_VIEW: 'offers.view',
  OFFERS_MANAGE: 'offers.manage',
  OFFERS_ASSIGN: 'offers.assign',
  OFFERS_EXPORT: 'offers.export',
}

export const ALL_PERMISSIONS = Object.values(PERMISSIONS)

export const ROLE_SEEDS = [
  {
    name: 'administrator', label: 'Administrador web', color: 'purple', isSystem: 1,
    description: 'Control total del panel de bbbsc.com.',
    permissions: Object.fromEntries(ALL_PERMISSIONS.map((permission) => [permission, true])),
  },
  {
    name: 'editor', label: 'Editor', color: 'blue', isSystem: 1,
    description: 'Gestiona contenido, medios y comentarios, incluida la publicación.',
    permissions: {
      [PERMISSIONS.DASHBOARD_VIEW]: true, [PERMISSIONS.POSTS_VIEW]: true, [PERMISSIONS.POSTS_VIEW_ALL]: true, [PERMISSIONS.POSTS_CREATE]: true,
      [PERMISSIONS.POSTS_EDIT]: true, [PERMISSIONS.POSTS_PUBLISH]: true, [PERMISSIONS.POSTS_DELETE]: true,
      [PERMISSIONS.MEDIA_VIEW]: true, [PERMISSIONS.MEDIA_MANAGE]: true,
      [PERMISSIONS.COMMENTS_VIEW]: true, [PERMISSIONS.COMMENTS_MANAGE]: true,
      [PERMISSIONS.ANALYTICS_VIEW]: true,
      [PERMISSIONS.OFFERS_VIEW]: true, [PERMISSIONS.OFFERS_MANAGE]: true,
    },
  },
  {
    name: 'author', label: 'Autor', color: 'orange', isSystem: 1,
    description: 'Crea y edita entradas, pero no puede publicarlas ni eliminarlas.',
    permissions: {
      [PERMISSIONS.DASHBOARD_VIEW]: true, [PERMISSIONS.POSTS_VIEW]: true, [PERMISSIONS.POSTS_VIEW_ALL]: true,
      [PERMISSIONS.POSTS_CREATE]: true, [PERMISSIONS.POSTS_EDIT]: true,
      [PERMISSIONS.MEDIA_VIEW]: true, [PERMISSIONS.MEDIA_MANAGE]: true,
    },
  },
  {
    name: 'moderator', label: 'Moderador', color: 'green', isSystem: 1,
    description: 'Revisa y administra comentarios del blog.',
    permissions: {
      [PERMISSIONS.DASHBOARD_VIEW]: true, [PERMISSIONS.POSTS_VIEW]: true, [PERMISSIONS.POSTS_VIEW_ALL]: true,
      [PERMISSIONS.COMMENTS_VIEW]: true, [PERMISSIONS.COMMENTS_MANAGE]: true,
    },
  },
  {
    name: 'reader', label: 'Lector', color: 'gray', isSystem: 1,
    description: 'Acceso de lectura al dashboard y a las entradas publicadas.',
    permissions: { [PERMISSIONS.DASHBOARD_VIEW]: true, [PERMISSIONS.POSTS_VIEW]: true },
  },
]

export function normalizePermissions(value = {}) {
  const result = Object.fromEntries(ALL_PERMISSIONS.map((permission) => [permission, value[permission] === true]))
  if ([PERMISSIONS.POSTS_CREATE, PERMISSIONS.POSTS_EDIT, PERMISSIONS.POSTS_PUBLISH, PERMISSIONS.POSTS_DELETE].some((permission) => result[permission])) {
    result[PERMISSIONS.POSTS_VIEW] = true
    result[PERMISSIONS.POSTS_VIEW_ALL] = true
  }
  if (result[PERMISSIONS.MEDIA_MANAGE]) result[PERMISSIONS.MEDIA_VIEW] = true
  if (result[PERMISSIONS.COMMENTS_MANAGE]) result[PERMISSIONS.COMMENTS_VIEW] = true
  if (result[PERMISSIONS.USERS_MANAGE_ACCESS] || result[PERMISSIONS.USERS_ASSIGN_ROLES]) result[PERMISSIONS.USERS_VIEW] = true
  if (result[PERMISSIONS.ROLES_MANAGE]) result[PERMISSIONS.ROLES_VIEW] = true
  if (result[PERMISSIONS.ANALYTICS_VIEW]) result[PERMISSIONS.DASHBOARD_VIEW] = true
  if (result[PERMISSIONS.OFFERS_MANAGE]) result[PERMISSIONS.OFFERS_VIEW] = true
  if (result[PERMISSIONS.OFFERS_ASSIGN]) result[PERMISSIONS.OFFERS_VIEW] = true
  if (result[PERMISSIONS.OFFERS_ASSIGN] || result[PERMISSIONS.OFFERS_EXPORT]) result[PERMISSIONS.USERS_VIEW] = true
  return result
}
