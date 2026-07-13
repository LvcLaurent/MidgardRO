package fr.lsi.reign.exposition.account.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(@NotBlank String currentPassword, @NotBlank @Size(max = 32) String newPassword) {
}
