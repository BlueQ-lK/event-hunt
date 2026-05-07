import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router'
import { createEvent } from '@/server/events'
import { Footer } from '@/components/Footer'
import { getSession } from '#/lib/auth.functions'
import { EventForm } from '@/components/EventForm'

export const Route = createFileRoute('/manage/create')({
  component: CreateEventPage,
  beforeLoad: async () => {
    const session = await getSession();

    if(!session){
      throw redirect({to: "/login"})
    }
    return { user: session.user };
  }
})

function CreateEventPage() {
  const navigate = useNavigate()

  const handleSubmit = async (data: any) => {
    await createEvent({ data })
    navigate({ to: '/manage/events' })
  }

  return (
    <div className="min-h-screen pb-20 sm:pb-40">
      <main className="container-custom px-4 py-12 sm:py-20">
        <EventForm 
          onSubmit={handleSubmit}
          submitLabel="Publish Event"
          submittingLabel="Publishing..."
        />
      </main>
      <Footer />
    </div>
  )
}
