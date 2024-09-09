
/**
 * Converts a MongoDB date object to a readable date string.
 * @param {Date} date - The MongoDB date object.
 * @returns {string} - The formatted date string.
 */
export const formatDate = (date) => {
    if (!date) return '';
    
    const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(new Date(date));
};
