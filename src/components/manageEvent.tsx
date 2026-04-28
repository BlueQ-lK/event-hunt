import { createFileRoute } from '@tanstack/react-router'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  type SortingState,
  getFilteredRowModel,
  type ColumnDef,
} from '@tanstack/react-table'
import {
  BarChart3,
  Calendar,
  MoreHorizontal,
  Plus,
  Search,
  MapPin,
  Clock,
  ExternalLink,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react'
import * as React from 'react'
import { Link } from '@tanstack/react-router'

import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '#/components/ui/tabs'
import { cn } from '#/lib/utils'
import { getMyManagedEvents } from '@/server/events'
import { authClient } from '#/lib/auth-client'

type Event = {
  id: string
  title: string
  startDate: Date | string
  startTime: string | null
  location: string
  category: string
  status: 'ongoing' | 'upcoming' | 'past'
  interests: number
}

function getEventStatus(startDate: Date | string, endDate?: Date | string | null): Event['status'] {
  const now = new Date()
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : null

  if (start > now) return 'upcoming'
  if (end && end < now) return 'past'
  return 'ongoing'
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function ManageEvents() {
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [activeTab, setActiveTab] = React.useState('upcoming')
  const [eventsData, setEventsData] = React.useState<Event[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [loadError, setLoadError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (isSessionPending) return

    if (!session) {
      setEventsData([])
      setIsLoading(false)
      return
    }

    const load = async () => {
      setIsLoading(true)
      setLoadError(null)
      try {
        const rows = await getMyManagedEvents()
        const mapped: Event[] = rows.map((item) => ({
          id: item.id,
          title: item.title,
          startDate: item.startDate,
          startTime: item.startTime,
          location: item.locationName || item.city || item.address || 'Location to be announced',
          category: item.category,
          status: getEventStatus(item.startDate, item.endDate),
          interests: item.interestCount,
        }))
        setEventsData(mapped)
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : 'Failed to load your events.')
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [session, isSessionPending])

  const columns = React.useMemo<ColumnDef<Event>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Event Name',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">
              {row.getValue('title')}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 uppercase">
                {row.original.category}
              </Badge>
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'startDate',
        header: 'Date & Time',
        cell: ({ row }) => (
          <div className="flex flex-col text-sm">
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5 text-muted-foreground" />
              <span>{formatDate(row.getValue('startDate'))}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground mt-0.5">
              <Clock className="size-3.5" />
              <span>{row.original.startTime}</span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'location',
        header: 'Location',
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-sm">
            <MapPin className="size-3.5 text-muted-foreground shrink-0" />
            <span className="truncate max-w-[150px]">
              {row.getValue('location')}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'interests',
        header: 'Engagement',
        cell: ({ row }) => (
          <div className="flex flex-col text-sm">
            <div className="flex items-center gap-1.5">
              {row.original.interests} interested
            </div>
          </div>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="icon" className="size-8">
              <Edit className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="size-8 text-destructive">
              <Trash2 className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  )

  const filteredData = React.useMemo(() => {
    return eventsData.filter((event) => event.status === activeTab)
  }, [activeTab, eventsData])

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Events</h1>
          <p className="text-muted-foreground">
            Monitor and manage your hosted events and their performance.
          </p>
        </div>
        <Button asChild className="w-full md:w-auto gap-2">
          <Link to="/manage/create">
            <Plus className="size-4" /> Create New Event
          </Link>
        </Button>
      </div>

      {/* Analytics Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventsData.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all statuses
            </p>
          </CardContent>
        </Card>
        <Card className="bg-chart-1/5 border-chart-1/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interests</CardTitle>
            <BarChart3 className="size-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {eventsData.reduce((acc, curr) => acc + curr.interests, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all your hosted events
            </p>
          </CardContent>
        </Card>
        <Card className="bg-chart-2/5 border-chart-2/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Interest</CardTitle>
            <Eye className="size-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                eventsData.length
                  ? eventsData.reduce((acc, curr) => acc + curr.interests, 0) /
                    eventsData.length
                  : 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Per event average
            </p>
          </CardContent>
        </Card>
        <Card className="bg-chart-3/5 border-chart-3/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <ExternalLink className="size-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {eventsData.filter((e) => e.status === 'ongoing').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Live now
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Events Table Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Event List</CardTitle>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-9 h-9"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="upcoming"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="ongoing" className="gap-2">
                Ongoing
                <Badge variant="secondary" className="px-1.5 py-0 h-4 min-w-[1.25rem] justify-center">
                  {eventsData.filter((e) => e.status === 'ongoing').length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="gap-2">
                Upcoming
                <Badge variant="secondary" className="px-1.5 py-0 h-4 min-w-[1.25rem] justify-center">
                  {eventsData.filter((e) => e.status === 'upcoming').length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="past" className="gap-2">
                Past
                <Badge variant="secondary" className="px-1.5 py-0 h-4 min-w-[1.25rem] justify-center">
                  {eventsData.filter((e) => e.status === 'past').length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {!session && !isSessionPending && (
              <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                Login required to manage events.
              </div>
            )}
            {loadError && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {loadError}
              </div>
            )}
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="h-10 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={columns.length} className="h-24 text-center">
                          Loading events...
                        </td>
                      </tr>
                    ) : table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <tr
                          key={row.id}
                          className="border-b transition-colors hover:bg-muted/30 data-[state=selected]:bg-muted"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className="p-4 align-middle"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          No events found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
