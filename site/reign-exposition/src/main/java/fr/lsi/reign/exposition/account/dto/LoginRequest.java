package fr.lsi.reign.exposition.account.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(@NotBlank String userId, @NotBlank String password) {
}
