import { useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { getProject, updateProject, getTags } from '../../services/projectService'
import TagInput from '../../components/ui/TagInput'
import { getCategories } from '../../services/categoryService'
import { useAuth } from '../../context/useAuth'
import { type Project } from '../../types'
import { type Category } from '../../types'
import { type Tag } from '../../types'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'

const schema = Yup.object({
  title:       Yup.string().min(10, 'At least 10 characters').required('Required'),
  details:     Yup.string().min(50, 'At least 50 characters').required('Required'),
  categoryId:  Yup.string().required('Pick a category'),
  totalTarget: Yup.number().min(1, 'Must be at least 1 EGP').required('Required'),
  startDate:   Yup.string().required('Required'),
  endDate:     Yup.string()
    .required('Required')
    .test('after-start', 'Must be after start date', function (val) {
      return !this.parent.startDate || !val || val > this.parent.startDate
    }),
})

const fieldClass = (touched: boolean | undefined, error: string | undefined) =>
  `w-full bg-white rounded-lg px-4 py-3 text-sm text-text-body outline-none transition-all placeholder:text-text-muted ${
    touched && error
      ? 'ring-2 ring-danger border-transparent'
      : 'ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-primary border-transparent'
  }`

function EditForm({ project, categories, allTags }: {
  project: Project
  categories: Category[] | undefined
  allTags: Tag[] | undefined
}) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const mutation = useMutation({
    mutationFn: (formData: FormData) => updateProject(Number(id), formData),
    onSuccess: () => navigate(`/projects/${id}`),
  })

  const f = useFormik({
    initialValues: {
      title:       project.title,
      details:     project.details,
      categoryId:  String(project.category?.id ?? ''),
      totalTarget: String(project.totalTarget),
      startDate: project.startTime?.slice(0, 16) ?? '',
      endDate: project.endTime?.slice(0, 16) ?? '',
      tagNames: Array.isArray(project.tags) ? project.tags.map(t => t.name) : [] as string[],
      images: [] as File[],
    },
    validationSchema: schema,
    onSubmit: (values, { setFieldError }) => {
      const form = new FormData()
      form.append('title',        values.title)
      form.append('details',      values.details)
      form.append('category',     values.categoryId)
      form.append('total_target', values.totalTarget)
      form.append('start_time',   values.startDate)
      form.append('end_time',     values.endDate)
      values.tagNames.forEach(name => form.append('tag_names', name))
      values.images.forEach(img => form.append('uploaded_images', img))

      mutation.mutate(form, {
        onError: (err: unknown) => {
          const details = (err as { response?: { data?: { details?: Record<string, string[]> } } })
            ?.response?.data?.details
          if (details) {
            if (details.start_time)   setFieldError('startDate',   details.start_time[0])
            if (details.end_time)     setFieldError('endDate',     details.end_time[0])
            if (details.title)        setFieldError('title',       details.title[0])
            if (details.details)      setFieldError('details',     details.details[0])
            if (details.category)     setFieldError('categoryId',  details.category[0])
            if (details.total_target) setFieldError('totalTarget', details.total_target[0])
          }
        },
      })
    },
  })


  const pct = project.donationPercentage ?? 0

  return (
    <div className="min-h-screen bg-surface-page">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-10">

        <section>
          <Link
            to={`/projects/${id}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Project
          </Link>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-text-primary">Edit Campaign</h1>
          <p className="text-text-body max-w-2xl text-lg mt-3">
            Update your project details, adjust your funding goal, or add new images.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <div className="lg:col-span-8 space-y-6">

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-8 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-text-primary">Campaign Foundation</h2>
              </div>
              <form id="edit-form" onSubmit={f.handleSubmit} noValidate>
                <div className="p-8 space-y-6">

                  <div className="space-y-2">
                    <label className="block text-xs font-medium uppercase tracking-widest text-text-muted">Campaign Title</label>
                    <input
                      name="title"
                      value={f.values.title}
                      onChange={f.handleChange}
                      onBlur={f.handleBlur}
                      className={fieldClass(f.touched.title, f.errors.title)}
                    />
                    {f.touched.title && f.errors.title && <p className="text-xs text-danger">{f.errors.title}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-medium uppercase tracking-widest text-text-muted">Target Goal (EGP)</label>
                      <input
                        type="number"
                        name="totalTarget"
                        min={1}
                        value={f.values.totalTarget}
                        onChange={f.handleChange}
                        onBlur={f.handleBlur}
                        className={fieldClass(f.touched.totalTarget, f.errors.totalTarget)}
                      />
                      {f.touched.totalTarget && f.errors.totalTarget && <p className="text-xs text-danger">{f.errors.totalTarget}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-medium uppercase tracking-widest text-text-muted">Category</label>
                      <select
                        name="categoryId"
                        value={f.values.categoryId}
                        onChange={f.handleChange}
                        onBlur={f.handleBlur}
                        className={fieldClass(f.touched.categoryId, f.errors.categoryId) + ' appearance-none bg-white'}
                      >
                        <option value="">Select a category</option>
                        {Array.isArray(categories) && categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      {f.touched.categoryId && f.errors.categoryId && <p className="text-xs text-danger">{f.errors.categoryId}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-medium uppercase tracking-widest text-text-muted">
                      Tags <span className="normal-case font-normal text-text-muted">(optional)</span>
                    </label>
                    <TagInput
                      value={f.values.tagNames}
                      onChange={names => f.setFieldValue('tagNames', names)}
                      suggestions={allTags ?? []}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-medium uppercase tracking-widest text-text-muted">Start Date</label>
                      <input
                        type="datetime-local"
                        name="startDate"
                        value={f.values.startDate}
                        onChange={f.handleChange}
                        onBlur={f.handleBlur}
                        className={fieldClass(f.touched.startDate, f.errors.startDate)}
                      />
                      {f.touched.startDate && f.errors.startDate && <p className="text-xs text-danger">{f.errors.startDate}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-medium uppercase tracking-widest text-text-muted">End Date</label>
                      <input
                        type="datetime-local"
                        name="endDate"
                        min={f.values.startDate || undefined}
                        value={f.values.endDate}
                        onChange={f.handleChange}
                        onBlur={f.handleBlur}
                        className={fieldClass(f.touched.endDate, f.errors.endDate)}
                      />
                      {f.touched.endDate && f.errors.endDate && <p className="text-xs text-danger">{f.errors.endDate}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-medium uppercase tracking-widest text-text-muted">Detailed Narrative</label>
                    <textarea
                      name="details"
                      value={f.values.details}
                      onChange={f.handleChange}
                      onBlur={f.handleBlur}
                      rows={6}
                      className={fieldClass(f.touched.details, f.errors.details) + ' resize-none'}
                    />
                    {f.touched.details && f.errors.details && <p className="text-xs text-danger">{f.errors.details}</p>}
                  </div>

                </div>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-8 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-text-primary">Visual Identity</h2>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Array.isArray(project.pictures) && project.pictures.map(pic => (
                    <div key={pic.id} className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <img src={pic.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-video rounded-lg border-2 border-dashed border-gray-200 hover:border-brand-primary flex flex-col items-center justify-center text-text-muted hover:text-brand-primary transition-colors"
                  >
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-xs font-medium uppercase tracking-widest">Add Photo</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={e => {
                      const files = Array.from(e.target.files ?? []).slice(0, 5)
                      f.setFieldValue('images', files)
                    }}
                  />
                </div>
                {f.values.images.length > 0 && (
                  <p className="text-xs text-text-muted mt-3">
                    {f.values.images.length} new file(s) selected — will be added on save
                  </p>
                )}
              </div>
            </div>

          </div>

          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h3 className="text-xs font-medium uppercase tracking-widest text-text-muted">Live Funding Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-bold text-text-primary">EGP {project.totalDonated.toLocaleString()}</span>
                  <span className="text-sm font-bold text-brand-primary">{pct}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-primary rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
                <p className="text-xs text-text-muted">of EGP {project.totalTarget.toLocaleString()} goal</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                form="edit-form"
                disabled={mutation.isPending}
                className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-4 px-8 rounded-xl shadow-sm transition-all active:scale-95 flex justify-between items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{mutation.isPending ? 'Saving…' : 'Save Changes'}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <Button type="button" variant="secondary" className="w-full justify-center" onClick={() => navigate(`/projects/${id}`)}>
                Discard Changes
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProject(Number(id)),
    enabled: !!id,
  })

  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: getCategories })
  const { data: allTags }    = useQuery({ queryKey: ['tags'],       queryFn: getTags })

  if (isLoading) return <Spinner centered />
  if (!project) return <p className="text-center py-16 text-text-muted">Project not found.</p>
  if (user && user.id !== project.ownerId) { navigate(`/projects/${id}`); return null }

  return <EditForm project={project} categories={categories} allTags={allTags} />
}
