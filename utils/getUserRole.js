// utils/getUserRole.js
export function getUserRole() {
    // Retrieve and parse currentUser from localStorage
    const currentUser = JSON.parse(localStorage.getItem("currentUser") ?? '{}');
    
    // Return the role if currentUser is found and has a role
    return currentUser?.role ?? null;
}

export default getUserRole;
