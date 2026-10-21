package com.gustavo.financas.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TransacaoRequest {

    @NotBlank(message = "Descrição é obrigatória")
    @Size(max = 150, message = "Descrição deve ter no máximo 150 caracteres")
    private String descricao;

    @NotNull(message = "Valor é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    @Digits(integer = 13, fraction = 2, message = "Valor inválido (máx. 13 dígitos inteiros e 2 decimais)")
    private BigDecimal valor;

    @NotNull(message = "Tipo é obrigatório (RECEITA ou DESPESA)")
    private TipoTransacaoRequest tipo;

    @NotBlank(message = "Categoria é obrigatória")
    @Size(max = 50, message = "Categoria deve ter no máximo 50 caracteres")
    private String categoria;

    @NotNull(message = "Data da transação é obrigatória")
    @PastOrPresent(message = "Data não pode ser futura")
    private LocalDate data;

    @Size(max = 500, message = "Observação deve ter no máximo 500 caracteres")
    private String observacao;
}