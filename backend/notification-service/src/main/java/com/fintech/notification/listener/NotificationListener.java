package com.fintech.notification.listener;

import com.fintech.common.event.ExpenseCreatedEvent;
import com.fintech.notification.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationListener {

    private final EmailService emailService;

    @KafkaListener(topics = "expense-created-topic", groupId = "notification-group")
    public void handleExpenseCreated(ExpenseCreatedEvent event) {
        log.info("Received ExpenseCreatedEvent for expenseId: {}", event.getExpenseId());

        String subject = "Expense Created: " + event.getCurrency() + " " + event.getAmount();
        String body = "Your expense has been successfully submitted and is pending approval.\n" +
                "Amount: " + event.getAmount() + " " + event.getCurrency();

        emailService.sendEmail(event.getUserEmail(), subject, body);
    }
}
