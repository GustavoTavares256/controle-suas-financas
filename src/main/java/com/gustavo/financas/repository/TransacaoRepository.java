package com.gustavo.financas.repository;

import com.gustavo.financas.entity.TipoTransacao;
import com.gustavo.financas.entity.Transacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface TransacaoRepository extends JpaRepository<Transacao, Long> {

    // Métodos com Pageable (para paginação)
    Page<Transacao> findByTipo(TipoTransacao tipo, Pageable pageable);

    Page<Transacao> findByCategoriaIgnoreCase(String categoria, Pageable pageable);

    Page<Transacao> findByDataBetween(LocalDate inicio, LocalDate fim, Pageable pageable);

    Page<Transacao> findByTipoAndCategoriaIgnoreCase(TipoTransacao tipo, String categoria, Pageable pageable);

    Page<Transacao> findByTipoAndDataBetween(TipoTransacao tipo, LocalDate inicio, LocalDate fim, Pageable pageable);

    Page<Transacao> findByCategoriaIgnoreCaseAndDataBetween(String categoria, LocalDate inicio, LocalDate fim, Pageable pageable);

    Page<Transacao> findByTipoAndCategoriaIgnoreCaseAndDataBetween(TipoTransacao tipo, String categoria, LocalDate inicio, LocalDate fim, Pageable pageable);

    // Métodos antigos com Sort (mantidos para compatibilidade)
    List<Transacao> findByTipo(TipoTransacao tipo, Sort sort);

    List<Transacao> findByCategoriaIgnoreCase(String categoria, Sort sort);

    List<Transacao> findByDataBetween(LocalDate inicio, LocalDate fim, Sort sort);

    List<Transacao> findByTipoAndCategoriaIgnoreCase(TipoTransacao tipo, String categoria, Sort sort);

    List<Transacao> findByTipoAndDataBetween(TipoTransacao tipo, LocalDate inicio, LocalDate fim, Sort sort);

    @Query("SELECT SUM(t.valor) FROM Transacao t WHERE t.tipo = :tipo")
    BigDecimal sumByTipo(@Param("tipo") TipoTransacao tipo);

    @Query("SELECT t.categoria, SUM(t.valor), COUNT(t) FROM Transacao t WHERE t.tipo = :tipo GROUP BY t.categoria ORDER BY SUM(t.valor) DESC")
    List<Object[]> groupByCategoriaAndTipo(@Param("tipo") TipoTransacao tipo);
}