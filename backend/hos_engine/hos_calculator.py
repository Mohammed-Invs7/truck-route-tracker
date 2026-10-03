def generate_hos_schedule(total_miles, total_drive_hours, current_cycle_used, current_loc, pickup_loc, dropoff_loc):
    """
    Applied FMCSA HOS Rules:
    - 1 hour On-Duty for pickup and 1 hour for dropoff.
    - Mandatory 30-minute break (Off-Duty) after 8 hours of cumulative driving.
    - Fuel stop every 1,000 miles (30 minutes On-Duty).
    - Max 11 hours driving or 14-hour duty window -> followed by 10 hours rest (Sleeper).
    """
    raw_timeline = []

    # 1. Start Off-Duty before shift (e.g. 6 hours overnight)
    raw_timeline.append({"status": "OFF_DUTY", "duration": 6.0, "remark": "Initial Off Duty"})

    # 2. Pickup (1 hr On Duty)
    raw_timeline.append({"status": "ON_DUTY", "duration": 1.0, "remark": f"Pickup at {pickup_loc}"})

    remaining_drive = total_drive_hours
    driven_since_rest = 0.0
    driven_since_break = 0.0
    driven_since_fuel = 0.0
    shift_duration = 1.0 # 1 hour pickup already spent in current shift

    while remaining_drive > 0:
        # Calculate maximum allowed driving time before a mandatory break or sleep rest
        max_drive_allowed = min(
            8.0 - driven_since_break,
            11.0 - driven_since_rest,
            14.0 - shift_duration
        )

        if max_drive_allowed <= 0:
            # Shift limit reached (11h drive or 14h window) -> Require 10-hour sleeper rest
            raw_timeline.append({"status": "SLEEPER", "duration": 10.0, "remark": "10-Hour Mandatory Sleep Break"})
            driven_since_rest = 0.0
            driven_since_break = 0.0
            shift_duration = 0.0
            continue

        chunk = min(remaining_drive, max_drive_allowed)
        raw_timeline.append({"status": "DRIVING", "duration": round(chunk, 2), "remark": "Driving"})

        remaining_drive -= chunk
        driven_since_rest += chunk
        driven_since_break += chunk
        driven_since_fuel += chunk
        shift_duration += chunk

        # Fuel stop required every 1,000 miles (~18 driving hours)
        if driven_since_fuel >= 18.0 and remaining_drive > 0:
            raw_timeline.append({"status": "ON_DUTY", "duration": 0.5, "remark": "Fueling Stop (1,000 Miles)"})
            shift_duration += 0.5
            driven_since_fuel = 0.0

        # Mandatory 30-minute break required after 8 hours of driving
        elif driven_since_break >= 8.0 and remaining_drive > 0:
            raw_timeline.append({"status": "OFF_DUTY", "duration": 0.5, "remark": "30-Minute Mandatory Rest Break"})
            shift_duration += 0.5
            driven_since_break = 0.0

    # 3. Dropoff (1 hr On Duty)
    raw_timeline.append({"status": "ON_DUTY", "duration": 1.0, "remark": f"Dropoff at {dropoff_loc}"})

    # 4. Split raw continuous timeline into 24h daily sheets for React ELD Grid
    daily_logs = break_timeline_into_24h_days(raw_timeline)
    return daily_logs


def break_timeline_into_24h_days(raw_timeline):
    """Split raw timeline events into 24-hour daily log sheets"""
    days = []
    current_day_events = []
    current_day_num = 1
    current_day_time = 0.0 # From 0.0 to 24.0 hours

    for event in raw_timeline:
        duration = event["duration"]
        status = event["status"]
        remark = event["remark"]

        while duration > 0:
            time_left_today = 24.0 - current_day_time

            if duration <= time_left_today:
                start_h = current_day_time
                end_h = current_day_time + duration
                current_day_events.append({
                    "status": status,
                    "start": round(start_h, 2),
                    "end": round(end_h, 2),
                    "duration": round(duration, 2),
                    "remark": remark
                })
                current_day_time += duration
                duration = 0
            else:
                # Event extends into the next day
                start_h = current_day_time
                end_h = 24.0
                used_today = time_left_today
                current_day_events.append({
                    "status": status,
                    "start": round(start_h, 2),
                    "end": round(end_h, 2),
                    "duration": round(used_today, 2),
                    "remark": remark + " (cont.)"
                })

                # Close current day sheet and initialize a new day
                days.append(format_day_structure(current_day_num, current_day_events))
                current_day_num += 1
                current_day_events = []
                current_day_time = 0.0
                duration -= used_today

    if current_day_time < 24.0:
        # Fill remaining time of the last day with OFF_DUTY
        current_day_events.append({
            "status": "OFF_DUTY",
            "start": round(current_day_time, 2),
            "end": 24.0,
            "duration": round(24.0 - current_day_time, 2),
            "remark": "End of trip rest"
        })

    if current_day_events:
        days.append(format_day_structure(current_day_num, current_day_events))

    return days


def format_day_structure(day_num, events):
    """Calculate daily total hours per status"""
    totals = {"OFF_DUTY": 0.0, "SLEEPER": 0.0, "DRIVING": 0.0, "ON_DUTY": 0.0}
    for e in events:
        st = e["status"]
        if st in totals:
            totals[st] = round(totals[st] + e["duration"], 2)

    return {
        "day_number": day_num,
        "events": events,
        "totals": totals
    }