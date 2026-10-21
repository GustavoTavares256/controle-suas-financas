package com.gustavo.financas.service;

import com.gustavo.financas.dto.CategoriaRequest;
import com.gustavo.financas.dto.CategoriaResponse;
import com.gustavo.financas.entity.Categoria;
import com.gustavo.financas.exception.RecursoNaoEncontradoException;
import com.gustavo.financas.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoriaService {

    private final CategoriaRepository repository;

    public List<CategoriaResponse> listarTodas() {
        return repository.findAll(Sort.by("nome"))
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<CategoriaResponse> listarPorTipo(String tipo) {
        return repository.findByTipo(tipo, Sort.by("nome"))
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<CategoriaResponse> buscarPorNome(String nome) {
        return repository.findByNomeContainingIgnoreCase(nome, Sort.by("nome"))
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public CategoriaResponse buscarPorId(Long id) {
        Categoria categoria = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Categoria não encontrada com id: " + id));
        return toResponse(categoria);
    }

    @Transactional
    public CategoriaResponse criar(CategoriaRequest request) {
        if (repository.existsByNomeIgnoreCase(request.getNome())) {
            throw new IllegalArgumentException("Já existe uma categoria com este nome: " + request.getNome());
        }

        Categoria categoria = toEntity(request);
        Categoria salva = repository.save(categoria);
        return toResponse(salva);
    }

    @Transactional
    public CategoriaResponse atualizar(Long id, CategoriaRequest request) {
        Categoria existente = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Categoria não encontrada com id: " + id));

        if (!existente.getNome().equalsIgnoreCase(request.getNome())
                && repository.existsByNomeIgnoreCase(request.getNome())) {
            throw new IllegalArgumentException("Já existe uma categoria com este nome: " + request.getNome());
        }

        existente.setNome(request.getNome());
        existente.setTipo(request.getTipo());
        existente.setDescricao(request.getDescricao());
        existente.setCor(request.getCor());

        Categoria atualizada = repository.save(existente);
        return toResponse(atualizada);
    }

    @Transactional
    public void excluir(Long id) {
        if (!repository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Categoria não encontrada com id: " + id);
        }
        repository.deleteById(id);
    }

    private Categoria toEntity(CategoriaRequest request) {
        Categoria categoria = new Categoria();
        categoria.setNome(request.getNome());
        categoria.setTipo(request.getTipo());
        categoria.setDescricao(request.getDescricao());
        categoria.setCor(request.getCor());
        return categoria;
    }

    private CategoriaResponse toResponse(Categoria c) {
        return CategoriaResponse.builder()
                .id(c.getId())
                .nome(c.getNome())
                .tipo(c.getTipo())
                .descricao(c.getDescricao())
                .cor(c.getCor())
                .criadoEm(c.getCriadoEm())
                .build();
    }
}