package com.gustavo.financas.exception;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.net.URI;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<org.springframework.http.ProblemDetail> handleNotFound(RecursoNaoEncontradoException ex) {
        var problem = org.springframework.http.ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        problem.setTitle("Recurso não encontrado");
        problem.setType(URI.create("https://api.financas.com/errors/not-found"));
        problem.setProperty("timestamp", Instant.now());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(problem);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<org.springframework.http.ProblemDetail> handleValidation(MethodArgumentNotValidException ex) {
        var problem = org.springframework.http.ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Dados de entrada inválidos");
        problem.setTitle("Erro de validação");
        problem.setType(URI.create("https://api.financas.com/errors/validation"));
        problem.setProperty("timestamp", Instant.now());

        Map<String, String> erros = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(err ->
                erros.put(err.getField(), err.getDefaultMessage())
        );
        problem.setProperty("erros", erros);

        return ResponseEntity.badRequest().body(problem);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<org.springframework.http.ProblemDetail> handleConstraintViolation(ConstraintViolationException ex) {
        var problem = org.springframework.http.ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Parâmetros inválidos");
        problem.setTitle("Erro de validação");
        problem.setType(URI.create("https://api.financas.com/errors/validation"));
        problem.setProperty("timestamp", Instant.now());

        Map<String, String> erros = new HashMap<>();
        ex.getConstraintViolations().forEach(v ->
                erros.put(v.getPropertyPath().toString(), v.getMessage())
        );
        problem.setProperty("erros", erros);

        return ResponseEntity.badRequest().body(problem);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<org.springframework.http.ProblemDetail> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        var problem = org.springframework.http.ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "JSON inválido ou campo com valor incorreto");
        problem.setTitle("Erro de formato");
        problem.setType(URI.create("https://api.financas.com/errors/bad-request"));
        problem.setProperty("timestamp", Instant.now());
        
        String msg = ex.getMostSpecificCause() != null ? ex.getMostSpecificCause().getMessage() : ex.getMessage();
        if (msg != null && msg.contains("Enum")) {
            problem.setProperty("detail", "Valor de enum inválido. Use RECEITA ou DESPESA.");
        }
        
        return ResponseEntity.badRequest().body(problem);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<org.springframework.http.ProblemDetail> handleIllegalArgument(IllegalArgumentException ex) {
        var problem = org.springframework.http.ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());
        problem.setTitle("Argumento inválido");
        problem.setType(URI.create("https://api.financas.com/errors/bad-request"));
        problem.setProperty("timestamp", Instant.now());
        return ResponseEntity.badRequest().body(problem);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<org.springframework.http.ProblemDetail> handleGeneric(Exception ex) {
        var problem = org.springframework.http.ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno do servidor");
        problem.setTitle("Erro interno");
        problem.setType(URI.create("https://api.financas.com/errors/internal"));
        problem.setProperty("timestamp", Instant.now());
        problem.setProperty("mensagem", ex.getMessage());
        return ResponseEntity.internalServerError().body(problem);
    }
}