export function formatTime(isoDate: string | Date): string {
    const now = new Date();
    const date = new Date(isoDate);
    const diffMs = now.getTime() - date.getTime();

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;

    if (diffMs < minute) {
        return 'Mới đây';;
    } else if (diffMs < hour) {
        const mins = Math.floor(diffMs / minute);
        return `${mins} phút${mins > 1 ? 's' : ''} trước`;
    } else if (diffMs < day) {
        const hours = Math.floor(diffMs / hour);
        return `${hours} tiếng${hours > 1 ? 's' : ''} trước`;
    } else if (diffMs < week) {
        const days = Math.floor(diffMs / day);
        return `${days} ngày${days > 1 ? 's' : ''} trước`;
    } else {
        // Format date as dd/MM/yyyy
        return formatDate(date);
    }
}

export function formatDate(dateInput: string | Date): string {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `Date ${day}/${month}/${year}`;
  }
  
