package com.gustavo.financas.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    private BigDecimal totalReceitas;
    private BigDecimal totalDespesas;
    private BigDecimal saldo;           // totalReceitas - totalDespesas
    private Long quantidadeTransacoes;
    private List<CategoriaResumo> receitasPorCategoria;
    private List<CategoriaResumo> despesasPorCategoria;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoriaResumo {
        private String categoria;
        private BigDecimal total;
        private Long quantidade;
    }
}