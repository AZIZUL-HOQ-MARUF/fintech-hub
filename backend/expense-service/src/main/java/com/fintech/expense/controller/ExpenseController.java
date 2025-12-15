package com.fintech.expense.controller;

import com.fintech.common.dto.ApiResponse;
import com.fintech.common.util.JwtUtils;
import com.fintech.expense.dto.ExpenseDto;
import com.fintech.expense.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;
    private final JwtUtils jwtUtils;
    private final ObjectMapper objectMapper;

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ApiResponse<ExpenseDto>> createExpense(
            @RequestHeader("Authorization") String token,
            @RequestParam("expense") String expenseJson,
            @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {

        String jwt = token.substring(7);
        Long userId = jwtUtils.extractUserId(jwt);
        String userEmail = jwtUtils.extractUsername(jwt);

        ExpenseDto dto = objectMapper.readValue(expenseJson, ExpenseDto.class);
        dto.setUserId(userId); // Set userId from JWT token

        return ResponseEntity.ok(ApiResponse.success(expenseService.createExpense(dto, file, userEmail),
                "Expense created successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExpenseDto>>> getMyExpenses(@RequestHeader("Authorization") String token) {
        String jwt = token.substring(7);
        Long userId = jwtUtils.extractUserId(jwt);

        List<ExpenseDto> expenses = expenseService.getExpensesByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(expenses, "Fetched expenses successfully"));
    }
}
