import { Itinerary } from '../types';

export class ExportService {
  /**
   * Generates a printable PDF of the itinerary.
   * Returns a mock URL for the generated file.
   */
  async exportToPDF(itinerary: Itinerary): Promise<string> {
    console.log(`Exporting itinerary ${itinerary.id} to PDF...`);
    // In a real implementation, this would use a library like PDFKit or Puppeteer
    // to render the itinerary into a PDF format.
    await new Promise(resolve => setTimeout(resolve, 2000));
    return `/exports/itineraries/${itinerary.id}.pdf`;
  }

  /**
   * Generates an iCal string for the itinerary.
   */
  exportToICal(itinerary: Itinerary): string {
    console.log(`Generating iCal for itinerary ${itinerary.id}...`);
    let ical = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Raido AI//Travel Planner//EN\n";

    itinerary.dailyPlans.forEach(day => {
      day.activities.forEach(activity => {
        const timeParts = activity.timeSlot.split(' - ');
        const start = this.formatDateForICal(day.date, timeParts[0]);
        const end = this.formatDateForICal(day.date, timeParts[1] || timeParts[0]);
        
        ical += "BEGIN:VEVENT\n";
        ical += `SUMMARY:${activity.title}\n`;
        ical += `DESCRIPTION:${activity.description}\n`;
        ical += `DTSTART:${start}\n`;
        ical += `DTEND:${end}\n`;
        ical += `LOCATION:${activity.location.name || activity.location.address || ''}\n`;
        ical += "END:VEVENT\n";
      });
    });

    ical += "END:VCALENDAR";
    return ical;
  }

  /**
   * Generates a CSV budget export.
   */
  exportBudgetCSV(itinerary: Itinerary): string {
    let csv = "Day,Activity,Cost,Category\n";
    itinerary.dailyPlans.forEach(day => {
      day.activities.forEach(activity => {
        csv += `${day.dayNumber},"${activity.title.replace(/"/g, '""')}",${activity.cost},"${activity.category}"\n`;
      });
    });
    return csv;
  }

  /**
   * Generates a Google Calendar link for a specific activity.
   */
  getGoogleCalendarLink(activity: any, date: string): string {
    const timeParts = activity.timeSlot.split(' - ');
    const start = this.formatDateForICal(date, timeParts[0]);
    const end = this.formatDateForICal(date, timeParts[1] || timeParts[0]);
    
    const baseUrl = "https://www.google.com/calendar/render?action=TEMPLATE";
    const params = new URLSearchParams({
      text: activity.title,
      details: activity.description,
      location: activity.location.name || activity.location.address || '',
      dates: `${start}/${end}`
    });
    
    return `${baseUrl}&${params.toString()}`;
  }

  private formatDateForICal(dateStr: string, timeStr: string): string {
    try {
      const [hours, minutes] = timeStr.trim().split(':');
      const date = new Date(dateStr);
      if (hours) date.setHours(parseInt(hours));
      if (minutes) date.setMinutes(parseInt(minutes));
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    } catch (e) {
      return dateStr.replace(/[-:]/g, '').split('T')[0] + 'T000000Z';
    }
  }
}
