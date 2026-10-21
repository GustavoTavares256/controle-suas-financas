package com.gustavo.financas.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categorias")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50, unique = true)
    private String nome;

    @Column(nullable = false, length = 20)
    private String tipo; // RECEITA ou DESPESA

    @Column(length = 200)
    private String descricao;

    @Column(length = 7)
    private String cor; // Hex color: #RRGGBB

    @Column(name = "criado_em", nullable = false, updatable = false)
    private java.time.LocalDateTime criadoEm;

    @PrePersist
    void aoCriar() {
        this.criadoEm = java.time.LocalDateTime.now();
    }
}