package fr.lsi.reign.exposition.account.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangeEmailRequest(@NotBlank @Email @Size(max = 39) String email) {
}
