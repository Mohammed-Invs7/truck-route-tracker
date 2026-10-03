from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .map_service import get_route_details
from .hos_calculator import generate_hos_schedule

@api_view(['POST'])
def calculate_trip(request):
    """API Endpoint to accept trip inputs and return HOS logs + Map details"""
    data = request.data
    current_loc = data.get('current_location', 'Chicago, IL')
    pickup_loc = data.get('pickup_location', 'St. Louis, MO')
    dropoff_loc = data.get('dropoff_location', 'Dallas, TX')
    current_cycle_hrs = float(data.get('current_cycle_used', 0.0))

    # 1. Get route geometry and distance from mapping service
    route_data = get_route_details(current_loc, pickup_loc, dropoff_loc)

    # 2. Generate daily HOS logs based on rules
    daily_logs = generate_hos_schedule(
        total_miles=route_data["total_miles"],
        total_drive_hours=route_data["driving_hours"],
        current_cycle_used=current_cycle_hrs,
        current_loc=current_loc,
        pickup_loc=pickup_loc,
        dropoff_loc=dropoff_loc
    )

    return Response({
        "summary": {
            "total_miles": route_data["total_miles"],
            "driving_hours": route_data["driving_hours"],
            "total_days": len(daily_logs),
            "current_cycle_used": current_cycle_hrs
        },
        "map_data": {
            "geometry": route_data["geometry"],
            "waypoints": route_data["waypoints"]
        },
        "daily_logs": daily_logs
    }, status=status.HTTP_200_OK)