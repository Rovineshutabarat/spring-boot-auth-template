package com.lerneon.backend.handlers;

import com.lerneon.backend.models.exceptions.AuthException;
import com.lerneon.backend.models.exceptions.DuplicateElementException;
import com.lerneon.backend.models.exceptions.ResourceNotFoundException;
import com.lerneon.backend.models.payload.response.common.ErrorResponse;
import com.lerneon.backend.models.payload.response.common.ValidationErrorResponse;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException exception,
            HttpServletRequest request) {
        return ResponseHandler.buildValidationErrorResponse(HttpStatus.BAD_REQUEST, request, exception);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
            ResourceNotFoundException exception,
            HttpServletRequest request) {
        return ResponseHandler.buildErrorResponse(HttpStatus.NOT_FOUND, exception.getMessage(), request);
    }

    @ExceptionHandler(DuplicateElementException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateElementException(
            DuplicateElementException exception,
            HttpServletRequest request) {
        return ResponseHandler.buildErrorResponse(HttpStatus.BAD_REQUEST, exception.getMessage(), request);
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ErrorResponse> handleJwtException(
            JwtException exception,
            HttpServletRequest request) {
        return ResponseHandler.buildErrorResponse(HttpStatus.UNAUTHORIZED, exception.getMessage(), request);
    }

    @ExceptionHandler(AuthException.class)
    public ResponseEntity<ErrorResponse> handleAuthException(
            AuthException exception,
            HttpServletRequest request) {
        return ResponseHandler.buildErrorResponse(HttpStatus.UNAUTHORIZED, exception.getMessage(), request);
    }
}
