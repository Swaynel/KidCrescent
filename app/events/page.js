import { useEvents } from '../../lib/hooks/useEvents';

export default function EventsPage() {
  const { events, loading } = useEvents();

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Events</h1>
      {events.map(event => (
        <div key={event.id} className="mb-8">
          <h3 className="text-xl font-bold">{event.title}</h3>
          <p>{event.venue}, {event.city}</p>
          <p>{event.date?.toLocaleDateString()}</p>
          <p>Price: {event.price}</p>
          <p>Status: {event.status}</p>
          <p>{event.description}</p>
          {event.ticketUrl && <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400">Buy Tickets</a>}
        </div>
      ))}
    </div>
  );
}