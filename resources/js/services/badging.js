/**
 * App Badging Service
 * 
 * Manages the PWA app badge (notification count indicator)
 * Uses the Badging API for supported browsers
 */

class BadgingService {
    constructor() {
        this.isSupported = typeof navigator !== 'undefined' && 'setAppBadge' in navigator;
    }

    /**
     * Check if Badging API is supported
     */
    checkSupport() {
        return this.isSupported;
    }

    /**
     * Set the app badge to a specific count
     * @param {number} count - The number to display (0 clears the badge)
     */
    async setBadge(count) {
        if (!this.isSupported) {

            return false;
        }

        try {
            if (count > 0) {
                await navigator.setAppBadge(count);

            } else {
                await navigator.clearAppBadge();

            }
            return true;
        } catch (error) {
            console.error('Error setting badge:', error);
            return false;
        }
    }

    /**
     * Clear the app badge
     */
    async clearBadge() {
        if (!this.isSupported) {
            return false;
        }

        try {
            await navigator.clearAppBadge();

            return true;
        } catch (error) {
            console.error('Error clearing badge:', error);
            return false;
        }
    }

    /**
     * Fetch pending items count from API and update badge
     */
    async updateBadgeFromAPI() {
        try {
            const response = await fetch('/api/pending-count');
            if (!response.ok) return false;

            const data = await response.json();
            const count = data.count || 0;

            return this.setBadge(count);
        } catch (error) {
            console.error('Error fetching pending count:', error);
            return false;
        }
    }
}

// Singleton instance
const badgingService = new BadgingService();

// Export functions for easy use
export const setBadge = (count) => badgingService.setBadge(count);
export const clearBadge = () => badgingService.clearBadge();
export const updateBadge = () => badgingService.updateBadgeFromAPI();
export const isBadgingSupported = () => badgingService.checkSupport();

export default badgingService;
