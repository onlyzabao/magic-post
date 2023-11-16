export default {
    BOSS: "BOSS",
    STORAGE_MANAGER: "STORAGE-MANAGER",
    POSTOFFICE_MANAGER: "POSTOFFICE-MANAGER",
    STORAGE_EMMPLOYEE: "STORAGE-EMPLOYEE",
    POSTOFFICE_EMMPLOYEE: "POSTOFFICE-EMPLOYEE",
    
    isManager: (role) => {
        return [
            "STORAGE-MANAGER",
            "POSTOFFICE-MANAGER"
        ].includes(role);
    },
    isEmployee: (role) => {
        return [
            "STORAGE-EMPLOYEE",
            "POSTOFFICE-EMPLOYEE"
        ].includes(role);
    }
}