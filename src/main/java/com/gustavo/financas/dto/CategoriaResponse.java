package com.gustavo.financas.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaResponse {

    private Long id;
    private String nome;
    private String tipo;
    private String descricao;
    private String cor;
    private LocalDateTime criadoEm;
}