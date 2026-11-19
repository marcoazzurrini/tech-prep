from collections import defaultdict


def find_itinerary(tickets: list[list[str]]) -> list[str]:
    # Sort in reverse, so pop() takes the smallest destination first.
    flights = defaultdict(list)
    for src, dst in sorted(tickets, reverse=True):
        flights[src].append(dst)

    route = []

    def visit(airport: str) -> None:
        # Use up every ticket out of this airport. pop() deletes the ticket.
        while flights[airport]:
            visit(flights[airport].pop())
        # No tickets left here: the airport goes on the route, back to front.
        route.append(airport)

    visit("JFK")
    return route[::-1]
