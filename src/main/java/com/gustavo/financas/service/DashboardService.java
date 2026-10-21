package com.gustavo.financas.service;

import com.gustavo.financas.dto.DashboardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TransacaoService transacaoService;

    public DashboardResponse obterResumo() {
        BigDecimal totalReceitas = transacaoService.somarReceitas();
        BigDecimal totalDespesas = transacaoService.somarDespesas();

        // Tratar null (quando não há transações)
        if (totalReceitas == null) totalReceitas = BigDecimal.ZERO;
        if (totalDespesas == null) totalDespesas = BigDecimal.ZERO;

        BigDecimal saldo = totalReceitas.subtract(totalDespesas);
        long quantidade = transacaoService.contarTransacoes();

        List<DashboardResponse.CategoriaResumo> receitasPorCat = transacaoService.agruparReceitasPorCategoria()
                .stream()
                .map(row -> DashboardResponse.CategoriaResumo.builder()
                        .categoria((String) row[0])
                        .total((BigDecimal) row[1])
                        .quantidade(((Number) row[2]).longValue())
                        .build())
                .collect(Collectors.toList());

        List<DashboardResponse.CategoriaResumo> despesasPorCat = transacaoService.agruparDespesasPorCategoria()
                .stream()
                .map(row -> DashboardResponse.CategoriaResumo.builder()
                        .categoria((String) row[0])
                        .total((BigDecimal) row[1])
                        .quantidade(((Number) row[2]).longValue())
                        .build())
                .collect(Collectors.toList());

        return DashboardResponse.builder()
                .totalReceitas(totalReceitas)
                .totalDespesas(totalDespesas)
                .saldo(saldo)
                .quantidadeTransacoes(quantidade)
                .receitasPorCategoria(receitasPorCat)
                .despesasPorCategoria(despesasPorCat)
                .build();
    }
}