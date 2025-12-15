package com.fintech.common.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseCreatedEvent {
    private Long expenseId;
    private Long userId;
    private BigDecimal amount;
    private String currency;
    private String userEmail; // To send notification
}
