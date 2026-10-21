package com.gustavo.financas.controller;

import com.gustavo.financas.dto.DashboardResponse;
import com.gustavo.financas.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService service;

    @GetMapping("/resumo")
    public ResponseEntity<DashboardResponse> obterResumo() {
        return ResponseEntity.ok(service.obterResumo());
    }
}