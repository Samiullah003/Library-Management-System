package com.library.model;

/** Uniform envelope for every endpoint: { success, message, data }. */
public class ApiResponse {
    private boolean success;
    private String message;
    private Object data;

    public ApiResponse(boolean success, String message, Object data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    public static ApiResponse ok(String message, Object data) { return new ApiResponse(true, message, data); }
    public static ApiResponse ok(Object data) { return new ApiResponse(true, "OK", data); }
    public static ApiResponse error(String message) { return new ApiResponse(false, message, null); }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public Object getData() { return data; }
}
