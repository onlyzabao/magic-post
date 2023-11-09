export default {
    LOGIN: {
        USER_NOT_FOUND: {
            errorCode: "USER_NOT_FOUND",
            message: "Tài khoản không tồn tại"
        },
        USED_EXPIRED: {
            errorCode: "USED_EXPIRED",
            message: "Tài khoản hết hạn sử dụng"
        },
        PASSWORD_INVALID: {
            errorCode: "PASSWORD_INVALID",
            message: "Mật khẩu không chính xác"
        },
        LOCK_LOGIN: {
            errorCode: "LOCK_LOGIN",
            message: "Nhập sai mật khẩu quá 5 lần."
        }
    },
    REGISTER: {
        USERNAME_EXISTS: {
            errorCode: "USERNAME_EXISTS",
            message: "Tên đăng nhập đã tồn tại"
        }
    },
    AUTH: {
        TOKEN_NOT_FOUND: {
            errorCode: "TOKEN_NOT_FOUND",
            message: "Yêu cầu đăng nhập"
        },
        TOKEN_EXPIRED: {
            errorCode: "TOKEN_EXPIRED",
            message: "Token hết hạn"
        },
        TOKEN_INVALID: {
            errorCode: "TOKEN_INVALID",
            message: "Token không thể xác thực"
        },
        ROLE_INVALID: {
            errorCode: "ROLE_INVALID",
            message: "Vai trò của bạn không thể sử dụng chức năng này"
        },
        USER_EXPIRED: {
            errorCode: "USER_EXPIRED",
            message: "Tài khoản đã hết hạn sử dụng"
        },
        USER_DELETED: {
            errorCode: "USER_DELETED",
            message: "Tài khoản đã bị xóa khỏi hệ thống"
        },
        TOKEN_BLOCKED: {
            errorCode: "TOKEN_BLOCKED",
            message: "Tài khoản vừa đổi mật khẩu hoặc bị kick"
        }
    },
    CREATE_USER: {
        USER_EXISTS: {
            errorCode: "USER_EXISTS",
            message: "Tài khoản đã tồn tại"
        },
    },
    CHANGE_PASSWORD: {
        USER_NOT_EXISTS: {
            errorCode: "USER_NOT_EXISTS",
            message: "Tài khoản không tồn tại hoặc đã bị xóa"
        },
    },
    GET_INFO: {
        USER_NOT_EXISTS: {
            errorCode: "USER_NOT_EXISTS",
            message: "Tài khoản không tồn tại hoặc đã bị xóa"
        },
    },
    UPDATE_USER_FOR_FAST_REGISTER: {
        UPDATE_FAIL: {
            errorCode: "UPDATE_FAIL",
            message: "Tài khoản đã cập thông tin tên đăng nhập/mật khẩu"
        },
        NEW_USERNAME_EXISTS: {
            errorCode: "NEW_USERNAME_EXISTS",
            message: "Tên đăng nhập đã tồn tại"
        }
    },
    GENERAL_ERROR: "GENERAL_ERROR",
    SUCCESS: "SUCCESS",
    PARAMS_INVALID: "PARAMS_INVALID"

}