package com.gustavo.financas.service;

import com.gustavo.financas.dto.TransacaoRequest;
import com.gustavo.financas.dto.TransacaoResponse;
import com.gustavo.financas.dto.TipoTransacaoRequest;
import com.gustavo.financas.entity.TipoTransacao;
import com.gustavo.financas.entity.Transacao;
import com.gustavo.financas.exception.RecursoNaoEncontradoException;
import com.gustavo.financas.repository.TransacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TransacaoService {

    private final TransacaoRepository repository;

    public Page<TransacaoResponse> listarComFiltros(TipoTransacaoRequest tipo,
                                                     String categoria,
                                                     LocalDate inicio,
                                                     LocalDate fim,
                                                     Pageable pageable) {

        Page<Transacao> page;

        if (tipo != null && categoria != null && inicio != null && fim != null) {
            TipoTransacao tipoEntity = TipoTransacao.valueOf(tipo.name());
            page = repository.findByTipoAndCategoriaIgnoreCaseAndDataBetween(
                    tipoEntity, categoria, inicio, fim, pageable);
        } else if (tipo != null && categoria != null) {
            TipoTransacao tipoEntity = TipoTransacao.valueOf(tipo.name());
            page = repository.findByTipoAndCategoriaIgnoreCase(tipoEntity, categoria, pageable);
        } else if (tipo != null && inicio != null && fim != null) {
            TipoTransacao tipoEntity = TipoTransacao.valueOf(tipo.name());
            page = repository.findByTipoAndDataBetween(tipoEntity, inicio, fim, pageable);
        } else if (tipo != null) {
            TipoTransacao tipoEntity = TipoTransacao.valueOf(tipo.name());
            page = repository.findByTipo(tipoEntity, pageable);
        } else if (categoria != null && inicio != null && fim != null) {
            page = repository.findByCategoriaIgnoreCaseAndDataBetween(categoria, inicio, fim, pageable);
        } else if (categoria != null) {
            page = repository.findByCategoriaIgnoreCase(categoria, pageable);
        } else if (inicio != null && fim != null) {
            page = repository.findByDataBetween(inicio, fim, pageable);
        } else {
            page = repository.findAll(pageable);
        }

        return page.map(this::toResponse);
    }

    // Mantém métodos antigos para compatibilidade (DashboardService usa)
    public List<TransacaoResponse> listarTodas() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "data", "criadoEm"))
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<TransacaoResponse> listarPorTipo(TipoTransacaoRequest tipo) {
        TipoTransacao tipoEntity = TipoTransacao.valueOf(tipo.name());
        return repository.findByTipo(tipoEntity, Sort.by(Sort.Direction.DESC, "data", "criadoEm"))
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<TransacaoResponse> listarPorCategoria(String categoria) {
        return repository.findByCategoriaIgnoreCase(categoria, Sort.by(Sort.Direction.DESC, "data", "criadoEm"))
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<TransacaoResponse> listarPorPeriodo(LocalDate inicio, LocalDate fim) {
        return repository.findByDataBetween(inicio, fim, Sort.by(Sort.Direction.DESC, "data", "criadoEm"))
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<TransacaoResponse> listarPorTipoECategoria(TipoTransacaoRequest tipo, String categoria) {
        TipoTransacao tipoEntity = TipoTransacao.valueOf(tipo.name());
        return repository.findByTipoAndCategoriaIgnoreCase(tipoEntity, categoria, Sort.by(Sort.Direction.DESC, "data", "criadoEm"))
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<TransacaoResponse> listarPorTipoEPeriodo(TipoTransacaoRequest tipo, LocalDate inicio, LocalDate fim) {
        TipoTransacao tipoEntity = TipoTransacao.valueOf(tipo.name());
        return repository.findByTipoAndDataBetween(tipoEntity, inicio, fim, Sort.by(Sort.Direction.DESC, "data", "criadoEm"))
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public TransacaoResponse buscarPorId(Long id) {
        Transacao transacao = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Transação não encontrada com id: " + id));
        return toResponse(transacao);
    }

    @Transactional
    public TransacaoResponse criar(TransacaoRequest request) {
        Transacao transacao = toEntity(request);
        Transacao salva = repository.save(transacao);
        return toResponse(salva);
    }

    @Transactional
    public TransacaoResponse atualizar(Long id, TransacaoRequest request) {
        Transacao existente = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Transação não encontrada com id: " + id));

        existente.setDescricao(request.getDescricao());
        existente.setValor(request.getValor());
        existente.setTipo(TipoTransacao.valueOf(request.getTipo().name()));
        existente.setCategoria(request.getCategoria());
        existente.setData(request.getData());
        existente.setObservacao(request.getObservacao());

        Transacao atualizada = repository.save(existente);
        return toResponse(atualizada);
    }

    @Transactional
    public void excluir(Long id) {
        if (!repository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Transação não encontrada com id: " + id);
        }
        repository.deleteById(id);
    }

    private Transacao toEntity(TransacaoRequest request) {
        Transacao transacao = new Transacao();
        transacao.setDescricao(request.getDescricao());
        transacao.setValor(request.getValor());
        transacao.setTipo(TipoTransacao.valueOf(request.getTipo().name()));
        transacao.setCategoria(request.getCategoria());
        transacao.setData(request.getData());
        transacao.setObservacao(request.getObservacao());
        return transacao;
    }

    private TransacaoResponse toResponse(Transacao t) {
        return TransacaoResponse.builder()
                .id(t.getId())
                .descricao(t.getDescricao())
                .valor(t.getValor())
                .tipo(t.getTipo().name())
                .categoria(t.getCategoria())
                .data(t.getData())
                .observacao(t.getObservacao())
                .criadoEm(t.getCriadoEm())
                .build();
    }

    // --- Métodos auxiliares para Dashboard ---
    public BigDecimal somarReceitas() {
        return repository.sumByTipo(TipoTransacao.RECEITA);
    }

    public BigDecimal somarDespesas() {
        return repository.sumByTipo(TipoTransacao.DESPESA);
    }

    public List<Object[]> agruparReceitasPorCategoria() {
        return repository.groupByCategoriaAndTipo(TipoTransacao.RECEITA);
    }

    public List<Object[]> agruparDespesasPorCategoria() {
        return repository.groupByCategoriaAndTipo(TipoTransacao.DESPESA);
    }

    public long contarTransacoes() {
        return repository.count();
    }
}