export function date_converter(timestamp: string | number | Date) {
    const date = new Date(timestamp);
    date.setHours(date.getHours() + 3);

    const day = String(date.getDate()).padStart(2, '0');
    const monthOptions = { month: 'short' };
    // @ts-ignore
    const month = date.toLocaleString('ru-RU', monthOptions).replace('.', ''); // Убираем точку после месяца

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes} ${day} ${month}`;
}