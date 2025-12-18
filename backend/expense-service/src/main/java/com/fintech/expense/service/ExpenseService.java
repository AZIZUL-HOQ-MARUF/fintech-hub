package com.fintech.expense.service;

import com.fintech.common.event.ExpenseCreatedEvent;
import com.fintech.expense.dto.ExpenseDto;
import com.fintech.expense.entity.Expense;
import com.fintech.expense.entity.FileMetadata;
import com.fintech.expense.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    private final String UPLOAD_DIR = "uploads/";

    @Transactional
    public ExpenseDto createExpense(ExpenseDto dto, MultipartFile file, String userEmail) throws IOException {
        // 1. Save File if exists
        FileMetadata fileMetadata = null;
        if (file != null && !file.isEmpty()) {
            fileMetadata = saveFile(file);
        }

        // 2. Save Expense
        Expense expense = Expense.builder()
                .description(dto.getDescription())
                .amount(dto.getAmount())
                .currency(dto.getCurrency())
                .userId(dto.getUserId())
                .build();

        if (fileMetadata != null) {
            expense.getAttachments().add(fileMetadata);
        }

        Expense saved = expenseRepository.save(expense);

        // 3. Publish Event
        ExpenseCreatedEvent event = ExpenseCreatedEvent.builder()
                .expenseId(saved.getId())
                .userId(saved.getUserId())
                .amount(saved.getAmount())
                .currency(saved.getCurrency())
                .userEmail(userEmail)
                .build();

        kafkaTemplate.send("expense-created-topic", event);
        log.info("Published expense-created event for id: {}", saved.getId());

        // 4. Return DTO
        return mapToDto(saved);
    }

    @Transactional
    public ExpenseDto updateExpense(Long id, ExpenseDto dto, MultipartFile file) throws IOException {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));

        expense.setDescription(dto.getDescription());
        expense.setAmount(dto.getAmount());
        expense.setCurrency(dto.getCurrency());

        if (file != null && !file.isEmpty()) {
            FileMetadata fileMetadata = saveFile(file);
            expense.getAttachments().add(fileMetadata);
        }

        Expense updated = expenseRepository.save(expense);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteExpense(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));
        expense.setLive(false);
        expenseRepository.save(expense);
    }

    public List<ExpenseDto> getExpensesByUserId(Long userId) {
        List<Expense> expenses = expenseRepository.findByUserId(userId);
        return expenses.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private FileMetadata saveFile(MultipartFile file) throws IOException {
        Files.createDirectories(Paths.get(UPLOAD_DIR));
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path path = Paths.get(UPLOAD_DIR + fileName);
        Files.write(path, file.getBytes());

        return FileMetadata.builder()
                .fileName(fileName)
                .fileType(file.getContentType())
                .size(file.getSize())
                .storagePath(path.toString())
                .build();
    }

    private ExpenseDto mapToDto(Expense expense) {
        return ExpenseDto.builder()
                .id(expense.getId())
                .description(expense.getDescription())
                .amount(expense.getAmount())
                .currency(expense.getCurrency())
                .userId(expense.getUserId())
                .createdAt(expense.getCreatedAt())
                .status(expense.getStatus().name())
                .build();
    }
}
