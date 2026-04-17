import api from './api'

export interface Comment {
  id: number
  content: string
  author: {
    id: number
    username: string
    profilePicture?: string
  }
  createdAt: string
  updatedAt: string
  replies?: Comment[]
  _count?: { replies: number }
}

interface BackendComment {
  id: number
  body: string
  author: {
    id: number
    first_name: string
    last_name: string
    email: string
    profile_picture: string | null
  }
  created_at: string
  updated_at: string
  replies?: BackendComment[]
  _count?: { replies: number }
}

function transformComment(backend: BackendComment): Comment {
  // Build a readable username from first_name + last_name
  const firstName = backend.author.first_name || ''
  const lastName = backend.author.last_name || ''
  let username = `${firstName} ${lastName}`.trim()
  if (!username) {
    // Fallback to email or ID if no name
    username = backend.author.email || `User ${backend.author.id}`
  }

  return {
    id: backend.id,
    content: backend.body,
    author: {
      id: backend.author.id,
      username: username,
      profilePicture: backend.author.profile_picture || undefined,
    },
    createdAt: backend.created_at,
    updatedAt: backend.updated_at,
    replies: backend.replies?.map(transformComment),
    _count: backend._count,
  }
}

// GET /api/projects/:projectId/comments/
export async function getProjectComments(projectId: number): Promise<Comment[]> {
  const { data } = await api.get<BackendComment[]>(`/projects/${projectId}/comments/`)
  return data.map(transformComment)
}

// POST /api/comments/
export async function createProjectComment(
  projectId: number,
  input: { content: string }
): Promise<Comment> {
  const { data } = await api.post<BackendComment>('/comments/', {
    body: input.content,
    project: projectId,
  })
  return transformComment(data)
}

// PATCH /api/comments/:commentId/
export async function updateProjectComment(
  _projectId: number,
  commentId: number,
  input: { content: string }
): Promise<Comment> {
  const { data } = await api.patch<BackendComment>(`/comments/${commentId}/`, {
    body: input.content,
  })
  return transformComment(data)
}

// DELETE /api/comments/:commentId/
export async function deleteProjectComment(
  _projectId: number,
  commentId: number
): Promise<void> {
  await api.delete(`/comments/${commentId}/`)
}

// POST /api/comments/ (reply)
export async function createCommentReply(
  _projectId: number,
  parentCommentId: number,
  input: { content: string }
): Promise<Comment> {
  const { data } = await api.post<BackendComment>('/comments/', {
    body: input.content,
    parent: parentCommentId,
  })
  return transformComment(data)
}

// PATCH /api/comments/:replyId/
export async function updateCommentReply(
  _projectId: number,
  _parentCommentId: number,
  replyId: number,
  input: { content: string }
): Promise<Comment> {
  const { data } = await api.patch<BackendComment>(`/comments/${replyId}/`, {
    body: input.content,
  })
  return transformComment(data)
}

// DELETE /api/comments/:replyId/
export async function deleteCommentReply(
  _projectId: number,
  _parentCommentId: number,
  replyId: number
): Promise<void> {
  await api.delete(`/comments/${replyId}/`)
}

// POST /api/reports/comments/:commentId/report/
export async function reportComment(commentId: number, reason?: string): Promise<void> {
  const payload = reason ? { reason } : {};
  await api.post(`/reports/comments/${commentId}/report/`, payload);
}