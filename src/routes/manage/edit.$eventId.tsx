import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router'
import { getEvent, updateEvent } from '@/server/events'
import { Footer } from '@/components/Footer'
import { getSession } from '#/lib/auth.functions'
import { EventForm } from '@/components/EventForm'
import type { EventForm as EventFormType } from '@/lib/types'

export const Route = createFileRoute('/manage/edit/$eventId')({
  component: EditEventPage,
  loader: async ({ params }) => {
    const event = await getEvent({ data: params.eventId })
    if (!event) {
      throw redirect({ to: '/profile', search: { tab: 'manage' } })
    }
    return { event }
  },
  beforeLoad: async () => {
    const session = await getSession();
    if (!session) {
      throw redirect({ to: "/login" })
    }
    return { user: session.user };
  }
})

function EditEventPage() {
  const { event } = Route.useLoaderData()
  const navigate = useNavigate()

  // Transform event data to form data
  const initialData: EventFormType = {
    title: event.title,
    description: event.description || '',
    startDate: new Date(event.startDate).toISOString().split('T')[0],
    endDate: event.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '',
    startTime: event.startTime?.slice(0, 5) || '',
    endTime: event.endTime?.slice(0, 5) || '',
    location: {
      name: '',
      address: event.address || '',
      city: event.city || ''
    },
    category: event.category as EventFormType['category'],
    bannerImage: event.bannerImage || '',
    facebook: event.facebook || '',
    instagram: event.instagram || '',
    twitter: event.twitter || '',
  }

  const handleSubmit = async (data: any) => {
    await updateEvent({ 
      data: {
        id: event.id, 
        data 
      }
    })
    navigate({ to: '/profile', search: { tab: 'manage' } })
  }

  return (
    <div className="min-h-screen pb-20 sm:pb-40">
      <main className="container-custom px-4 py-12 sm:py-20">
        <EventForm 
          initialData={initialData}
          isEditing={true}
          onSubmit={handleSubmit}
          submitLabel="Update Event"
          submittingLabel="Updating..."
        />
      </main>
      <Footer />
    </div>
  )
}
