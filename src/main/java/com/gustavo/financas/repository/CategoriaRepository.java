package com.gustavo.financas.repository;

import com.gustavo.financas.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Sort;

import java.util.List;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    List<Categoria> findByTipo(String tipo, Sort sort);

    boolean existsByNomeIgnoreCase(String nome);

    List<Categoria> findByNomeContainingIgnoreCase(String nome, Sort sort);
}