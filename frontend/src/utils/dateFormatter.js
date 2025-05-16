// utils/dateFormatter.js
export function formatDateOrToday(isoDate) {
    const inputDate = new Date(isoDate);
    const today = new Date();

    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (inputDate.getTime() === today.getTime()) {
        return "Today";
    }

    const day = String(inputDate.getDate()).padStart(2, '0');
    const month = String(inputDate.getMonth() + 1).padStart(2, '0');
    const year = inputDate.getFullYear();

    return `${day}-${month}-${year}`;
}