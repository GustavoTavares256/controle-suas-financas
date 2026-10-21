package com.gustavo.financas.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaRequest {

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 50, message = "Nome deve ter no máximo 50 caracteres")
    private String nome;

    @NotBlank(message = "Tipo é obrigatório (RECEITA ou DESPESA)")
    @Pattern(regexp = "^(RECEITA|DESPESA)$", message = "Tipo deve ser RECEITA ou DESPESA")
    private String tipo;

    @Size(max = 200, message = "Descrição deve ter no máximo 200 caracteres")
    private String descricao;

    @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "Cor deve ser hexadecimal (ex: #FF5733)")
    private String cor;
}