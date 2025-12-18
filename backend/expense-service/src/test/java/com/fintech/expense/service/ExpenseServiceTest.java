package com.fintech.expense.service;

import com.fintech.expense.dto.ExpenseDto;
import com.fintech.expense.entity.Expense;
import com.fintech.expense.entity.ExpenseStatus;
import com.fintech.expense.repository.ExpenseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ExpenseServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;

    @InjectMocks
    private ExpenseService expenseService;

    private ExpenseDto expenseDto;
    private Expense expense;

    @BeforeEach
    void setUp() {
        expenseDto = ExpenseDto.builder()
                .description("Test Expense")
                .amount(new BigDecimal("100.00"))
                .currency("USD")
                .userId(1L)
                .build();

        expense = Expense.builder()
                .id(1L)
                .description("Test Expense")
                .amount(new BigDecimal("100.00"))
                .currency("USD")
                .userId(1L)
                .status(ExpenseStatus.PENDING)
                .build();
    }

    @Test
    void createExpense_Success() throws Exception {
        when(expenseRepository.save(any(Expense.class))).thenReturn(expense);

        ExpenseDto result = expenseService.createExpense(expenseDto, null, "test@example.com");

        assertNotNull(result);
        assertEquals(expenseDto.getDescription(), result.getDescription());
        verify(expenseRepository, times(1)).save(any(Expense.class));
        verify(kafkaTemplate, times(1)).send(eq("expense-created-topic"), any());
    }

    @Test
    void updateExpense_Success() throws Exception {
        when(expenseRepository.findById(1L)).thenReturn(Optional.of(expense));
        when(expenseRepository.save(any(Expense.class))).thenReturn(expense);

        ExpenseDto updatedDto = ExpenseDto.builder()
                .description("Updated Description")
                .amount(new BigDecimal("150.00"))
                .currency("USD")
                .build();

        ExpenseDto result = expenseService.updateExpense(1L, updatedDto, null);

        assertNotNull(result);
        assertEquals("Updated Description", result.getDescription());
        assertEquals(new BigDecimal("150.00"), result.getAmount());
        verify(expenseRepository, times(1)).findById(1L);
        verify(expenseRepository, times(1)).save(any(Expense.class));
    }

    @Test
    void updateExpense_NotFound() {
        when(expenseRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> expenseService.updateExpense(1L, expenseDto, null));
    }

    @Test
    void deleteExpense_Success() {
        when(expenseRepository.findById(1L)).thenReturn(Optional.of(expense));
        when(expenseRepository.save(any(Expense.class))).thenReturn(expense);

        assertDoesNotThrow(() -> expenseService.deleteExpense(1L));

        assertFalse(expense.isLive());
        verify(expenseRepository, times(1)).findById(1L);
        verify(expenseRepository, times(1)).save(expense);
    }

    @Test
    void deleteExpense_NotFound() {
        when(expenseRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> expenseService.deleteExpense(1L));
    }
}
