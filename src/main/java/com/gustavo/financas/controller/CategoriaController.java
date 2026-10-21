package com.gustavo.financas.controller;

import com.gustavo.financas.dto.CategoriaRequest;
import com.gustavo.financas.dto.CategoriaResponse;
import com.gustavo.financas.service.CategoriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaService service;

    @GetMapping
    public ResponseEntity<List<CategoriaResponse>> listar(
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String nome) {

        List<CategoriaResponse> resultado;

        if (tipo != null && nome != null) {
            // Se tem ambos, filtra por tipo e depois por nome (em memória)
            resultado = service.listarPorTipo(tipo)
                    .stream()
                    .filter(c -> c.getNome().toLowerCase().contains(nome.toLowerCase()))
                    .toList();
        } else if (tipo != null) {
            resultado = service.listarPorTipo(tipo);
        } else if (nome != null) {
            resultado = service.buscarPorNome(nome);
        } else {
            resultado = service.listarTodas();
        }

        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<CategoriaResponse> criar(@Valid @RequestBody CategoriaRequest request) {
        CategoriaResponse response = service.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaResponse> atualizar(@PathVariable Long id,
                                                        @Valid @RequestBody CategoriaRequest request) {
        return ResponseEntity.ok(service.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}