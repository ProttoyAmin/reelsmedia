function getTimeAgo(dateString: string): string {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHrs = Math.floor(diffMin / 60);
        const diffDays = Math.floor(diffHrs / 24);
        const diffWeeks = Math.floor(diffDays / 7);
        const diffMonths = Math.floor(diffDays / 30);
        const diffYears = Math.floor(diffDays / 365);

        if (diffSec < 60) return "Uploaded just now";
        if (diffMin < 60) return `Uploaded ${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
        if (diffHrs < 24) return `Uploaded ${diffHrs} hour${diffHrs > 1 ? "s" : ""} ago`;
        if (diffDays === 1) return "Uploaded yesterday";
        if (diffDays < 7) return `Uploaded ${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
        if (diffWeeks < 4) return `Uploaded ${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
        if (diffMonths < 12) return `Uploaded ${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
        return `Uploaded ${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
    }


export default getTimeAgo;