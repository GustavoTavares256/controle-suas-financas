package com.gustavo.financas.controller;

import com.gustavo.financas.dto.TransacaoRequest;
import com.gustavo.financas.dto.TransacaoResponse;
import com.gustavo.financas.dto.TipoTransacaoRequest;
import com.gustavo.financas.service.TransacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/transacoes")
@RequiredArgsConstructor
public class TransacaoController {

    private final TransacaoService service;

    @GetMapping
    public ResponseEntity<Page<TransacaoResponse>> listar(
            @RequestParam(required = false) TipoTransacaoRequest tipo,
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim,
            @RequestParam(required = false) String busca,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "20") int tamanho,
            @RequestParam(defaultValue = "data,desc") String[] sort,
            @RequestParam(required = false) String ordenacao) {

        // Mapear parâmetros do frontend para backend
        int pageNum = pagina != 0 ? pagina : page;
        int pageSize = tamanho != 20 ? tamanho : size;
        
        // Processar ordenacao do frontend (ex: "-data" ou "data,asc")
        String[] sortParams = parseOrdenacao(ordenacao, sort);
        
        Pageable pageable = PageRequest.of(pageNum, pageSize, Sort.by(
                Sort.Direction.fromString(sortParams[1].toUpperCase()), sortParams[0]));

        // Usar dataInicio/dataFim se fornecidos (frontend), senão inicio/fim (backend)
        LocalDate dataInicioFinal = dataInicio != null ? dataInicio : inicio;
        LocalDate dataFimFinal = dataFim != null ? dataFim : fim;

        // TODO: implementar busca por descrição se necessário
        // Por enquanto ignora o parâmetro 'busca'

        Page<TransacaoResponse> resultado = service.listarComFiltros(tipo, categoria, dataInicioFinal, dataFimFinal, pageable);
        return ResponseEntity.ok(resultado);
    }

    private String[] parseOrdenacao(String ordenacao, String[] defaultSort) {
        if (ordenacao == null || ordenacao.isBlank()) {
            return defaultSort;
        }
        // Frontend envia: "-data" (desc) ou "data" (asc) ou "data,asc"
        if (ordenacao.startsWith("-")) {
            return new String[]{ordenacao.substring(1), "desc"};
        }
        if (ordenacao.contains(",")) {
            return ordenacao.split(",");
        }
        return new String[]{ordenacao, "asc"};
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransacaoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<TransacaoResponse> criar(@Valid @RequestBody TransacaoRequest request) {
        TransacaoResponse response = service.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransacaoResponse> atualizar(@PathVariable Long id,
                                                        @Valid @RequestBody TransacaoRequest request) {
        return ResponseEntity.ok(service.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}