// Avatar generation utility
export const generateAvatar = (name, size = 100) => {
    // Get initials from name
    const initials = name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .slice(0, 2);

    // Generate a color based on the name
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
        '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
    ];
    
    const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    const backgroundColor = colors[colorIndex];

    // Create SVG avatar
    const svg = `
        <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="${backgroundColor}"/>
            <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" 
                  font-weight="bold" text-anchor="middle" dy="0.35em" fill="white">
                ${initials}
            </text>
        </svg>
    `;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Generate avatar URL for a user
export const getAvatarUrl = (user) => {
    if (user.avatar) {
        return user.avatar;
    }
    
    const name = user.name || user.fullName || 'User';
    return generateAvatar(name);
};

// Default avatar for different roles
export const getDefaultRoleAvatar = (role) => {
    const roleAvatars = {
        farmer: '🌾',
        laborer: '👷',
        serviceProvider: '🔧'
    };
    
    return roleAvatars[role] || '👤';
};

