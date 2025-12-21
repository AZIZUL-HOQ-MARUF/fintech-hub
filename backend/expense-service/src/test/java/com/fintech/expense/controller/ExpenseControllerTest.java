package com.fintech.expense.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fintech.common.util.JwtUtils;
import com.fintech.expense.dto.ExpenseDto;
import com.fintech.expense.service.ExpenseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ExpenseController.class)
public class ExpenseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ExpenseService expenseService;

    @MockBean
    private JwtUtils jwtUtils;

    @Autowired
    private ObjectMapper objectMapper;

    private ExpenseDto expenseDto;

    @BeforeEach
    void setUp() {
        expenseDto = ExpenseDto.builder()
                .id(1L)
                .description("Test Expense")
                .amount(new BigDecimal("100.00"))
                .currency("USD")
                .userId(1L)
                .build();
    }

    @Test
    void createExpense_Success() throws Exception {
        String token = "Bearer test-token";
        when(jwtUtils.extractUserId(anyString())).thenReturn(1L);
        when(jwtUtils.extractUsername(anyString())).thenReturn("test@example.com");
        when(expenseService.createExpense(any(), any(), anyString())).thenReturn(expenseDto);

        MockMultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "content".getBytes());

        mockMvc.perform(multipart("/api/v1/expenses")
                .file(file)
                .param("expense", objectMapper.writeValueAsString(expenseDto))
                .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.description").value("Test Expense"));
    }

    @Test
    void getMyExpenses_Success() throws Exception {
        String token = "Bearer test-token";
        when(jwtUtils.extractUserId(anyString())).thenReturn(1L);
        when(expenseService.getExpensesByUserId(1L)).thenReturn(List.of(expenseDto));

        mockMvc.perform(get("/api/v1/expenses")
                .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].description").value("Test Expense"));
    }

    @Test
    void updateExpense_Success() throws Exception {
        String token = "Bearer test-token";
        when(expenseService.updateExpense(anyLong(), any(), any())).thenReturn(expenseDto);

        mockMvc.perform(multipart("/api/v1/expenses/1")
                .param("expense", objectMapper.writeValueAsString(expenseDto))
                .with(request -> {
                    request.setMethod("PUT");
                    return request;
                })
                .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.description").value("Test Expense"));
    }

    @Test
    void deactivateExpense_Success() throws Exception {
        String token = "Bearer test-token";

        mockMvc.perform(put("/api/v1/expenses/1/deactivate")
                .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Expense deactivated successfully"));
    }
}
