export function timeAgo(date: Date | string): string {
    if (typeof date === "string") {
        date = new Date(date);
    }
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " năm trước";

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " tháng trước";

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " ngày trước";

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " giờ trước";

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " phút trước";

    return Math.floor(seconds) + " giây trước";
}