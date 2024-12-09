import { Event } from '@prisma/client';

export class RemoveDuplicates {
  events(events: Event[]) {
    const uniqueEvents = events.reduce<Map<string, Event>>((map, event) => {
      const key = event.type.toString();

      if (
        !map.has(key) ||
        (key === 'REGISTRATION' && event.eventDate < map.get(key)!.eventDate)
      ) {
        map.set(key, event);
      } else if (event.eventDate > map.get(key)!.eventDate) {
        map.set(key, event);
      }

      return map;
    }, new Map());

    return Array.from(uniqueEvents.values());
  }
}
