import { NextResponse } from 'next/server';
import { WeatherService } from '../../../lib/weather-service';

/**
 * GET /api/weather
 * Retrieves weather forecast/climatology for a specific destination and optional date range.
 * Query parameters:
 *  - destination (string, required)
 *  - start_date (ISO date string, optional)
 *  - end_date (ISO date string, optional)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get('destination');
    const startDate = searchParams.get('start_date') || undefined;
    const endDate = searchParams.get('end_date') || undefined;

    if (!destination) {
      return NextResponse.json(
        { error: 'bad_request', message: 'Query parameter "destination" is required.' },
        { status: 400 }
      );
    }

    const weather = await WeatherService.getWeatherForDestination(destination, startDate, endDate);

    return NextResponse.json({
      destination,
      weather,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'server_error', message: err.message },
      { status: 500 }
    );
  }
}
