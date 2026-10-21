package com.gustavo.financas.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransacaoResponse {

    private Long id;
    private String descricao;
    private BigDecimal valor;
    private String tipo;        // "RECEITA" ou "DESPESA" - String para JSON simples
    private String categoria;
    private LocalDate data;
    private String observacao;
    private LocalDateTime criadoEm;
}