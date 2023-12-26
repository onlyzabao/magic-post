export default {
    BOSS: "BOSS",
    STORAGE_MANAGER: "STORAGE-MANAGER",
    POSTOFFICE_MANAGER: "POSTOFFICE-MANAGER",
    STORAGE_EMPLOYEE: "STORAGE-EMPLOYEE",
    POSTOFFICE_EMPLOYEE: "POSTOFFICE-EMPLOYEE",

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
    },
    getManager: () => {
        return ["STORAGE-MANAGER", "POSTOFFICE-MANAGER"]
    },
    getEmployee: () => {
        return ["STORAGE-EMPLOYEE", "POSTOFFICE-EMPLOYEE"]
    }
}