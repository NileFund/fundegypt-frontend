import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { createProject, getTags } from '../../services/projectService'
import { getCategories } from '../../services/categoryService'
import Button from '../../components/ui/Button'
import TagInput from '../../components/ui/TagInput'

const nowLocal = () => {
  const d = new Date()
  d.setSeconds(0, 0)
  return d.toISOString().slice(0, 16)
}

const schema = Yup.object({
  title: Yup.string().min(10, 'At least 10 characters').required('Required'),
  details: Yup.string().min(50, 'At least 50 characters').required('Required'),
  categoryId: Yup.string().required('Pick a category'),
  totalTarget: Yup.number().min(1, 'Must be at least 1 EGP').required('Required'),
  startDate: Yup.string().required('Required').test('not-past', 'Cannot be in the past', val => !val || val >= nowLocal()),
  endDate: Yup.string()
    .required('Required')
    .test('after-start', 'Must be after start date', function (val) {
      return !this.parent.startDate || !val || val > this.parent.startDate
    }),
})

const fieldClass = (touched: boolean | undefined, error: string | undefined) =>
  `w-full bg-white rounded-lg px-4 py-3 text-sm text-text-body outline-none transition-all placeholder:text-text-muted ${touched && error
    ? 'ring-2 ring-danger border-transparent'
    : 'ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-primary border-transparent'
  }`

export default function CreateProjectPage() {
  const navigate = useNavigate()

  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: getCategories })
  const { data: allTags } = useQuery({ queryKey: ['tags'], queryFn: getTags })

  const mutation = useMutation({
    mutationFn: (formData: FormData) => createProject(formData),
    onSuccess: (project) => navigate(`/projects/${project.id}`),
  })

  const f = useFormik({
    initialValues: {
      title: '',
      details: '',
      categoryId: '',
      totalTarget: '',
      startDate: '',
      endDate: '',
      tagNames: [] as string[],
      images: [] as File[],
    },
    validationSchema: schema,
    onSubmit: (values, { setFieldError }) => {
      const form = new FormData()
      form.append('title', values.title)
      form.append('details', values.details)
      form.append('category', values.categoryId)
      form.append('total_target', values.totalTarget)
      form.append('start_time', values.startDate)
      form.append('end_time', values.endDate)
      values.tagNames.forEach(name => form.append('tag_names', name))
      values.images.forEach(img => form.append('uploaded_images', img))

      mutation.mutate(form, {
        onError: (err: unknown) => {
          const details = (err as { response?: { data?: { details?: Record<string, string[]> } } })
            ?.response?.data?.details
          if (details) {
            if (details.start_time) setFieldError('startDate', details.start_time[0])
            if (details.end_time) setFieldError('endDate', details.end_time[0])
            if (details.title) setFieldError('title', details.title[0])
            if (details.details) setFieldError('details', details.details[0])
            if (details.category) setFieldError('categoryId', details.category[0])
            if (details.total_target) setFieldError('totalTarget', details.total_target[0])
          }
        },
      })
    },
  })


  return (
    <div className="min-h-screen bg-surface-page">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">

        <header className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-text-primary mb-3">
            Launch your vision.
          </h1>
          <p className="text-text-body max-w-2xl text-lg">
            Transform your idea into a professional funding campaign and connect with backers who share your mission.
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-text-primary">Core Project Details</h2>
          </div>

          <form onSubmit={f.handleSubmit} noValidate>
            <div className="p-8 space-y-6">

              <div className="space-y-2">
                <label className="block text-xs font-medium uppercase tracking-widest text-text-muted">Project Title</label>
                <input
                  name="title"
                  value={f.values.title}
                  onChange={f.handleChange}
                  onBlur={f.handleBlur}
                  placeholder="e.g. Clean Water Initiative Aswan"
                  className={fieldClass(f.touched.title, f.errors.title)}
                />
                {f.touched.title && f.errors.title && <p className="text-xs text-danger">{f.errors.title}</p>}
              </div>


              <div className="space-y-2">
                <label className="block text-xs font-medium uppercase tracking-widest text-text-muted">Project Description</label>
                <textarea
                  name="details"
                  value={f.values.details}
                  onChange={f.handleChange}
                  onBlur={f.handleBlur}
                  rows={5}
                  placeholder="Describe the impact and goals of your project (min 50 characters)..."
                  className={fieldClass(f.touched.details, f.errors.details) + ' resize-none'}
                />
                {f.touched.details && f.errors.details && <p className="text-xs text-danger">{f.errors.details}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div className="space-y-2">
                  <label className="block text-xs font-medium uppercase tracking-widest text-text-muted">Funding Target (EGP)</label>
                  <input
                    type="number"
                    name="totalTarget"
                    min={1}
                    value={f.values.totalTarget}
                    onChange={f.handleChange}
                    onBlur={f.handleBlur}
                    placeholder="e.g. 250,000"
                    className={fieldClass(f.touched.totalTarget, f.errors.totalTarget)}
                  />
                  {f.touched.totalTarget && f.errors.totalTarget && <p className="text-xs text-danger">{f.errors.totalTarget}</p>}
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
                    min={nowLocal()}
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
                    min={f.values.startDate || nowLocal()}
                    value={f.values.endDate}
                    onChange={f.handleChange}
                    onBlur={f.handleBlur}
                    className={fieldClass(f.touched.endDate, f.errors.endDate)}
                  />
                  {f.touched.endDate && f.errors.endDate && <p className="text-xs text-danger">{f.errors.endDate}</p>}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-medium uppercase tracking-widest text-text-muted">
                  Project Images (up to 5)
                </label>
                <label className="flex flex-col items-center justify-center w-full aspect-4/1 rounded-lg border-2 border-dashed border-gray-200 hover:border-brand-primary cursor-pointer transition-colors bg-gray-50 hover:bg-brand-mint/10">
                  <svg className="w-8 h-8 text-text-muted mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-text-muted">
                    {f.values.images.length > 0 ? `${f.values.images.length} file(s) selected` : 'Click to upload images'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={e => {
                      const files = Array.from(e.target.files ?? []).slice(0, 5)
                      f.setFieldValue('images', files)
                    }}
                  />
                </label>
                {f.values.images.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(f.values.images) && f.values.images.map((img, i) => (
                      <span key={i} className="text-xs bg-brand-mint text-text-primary px-2 py-1 rounded-full">{img.name}</span>
                    ))}
                  </div>
                )}
              </div>

            </div>

            <div className="px-8 py-6 bg-gray-50 rounded-b-xl flex justify-end gap-3 border-t border-gray-100">
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit" loading={mutation.isPending}>Launch Campaign</Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  )
}
