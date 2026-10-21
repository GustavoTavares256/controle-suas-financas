package com.gustavo.financas.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class Controller {

    @GetMapping("/health")
    public String healthCheck() {
        return "Back-end de Finanças funcionando!";
    }
}
