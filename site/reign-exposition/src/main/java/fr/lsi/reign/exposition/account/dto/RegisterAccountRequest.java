package fr.lsi.reign.exposition.account.dto;

import fr.lsi.reign.domain.account.model.Sex;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterAccountRequest(
        @NotBlank @Size(max = 23) String userId,
        @NotBlank @Size(max = 32) String password,
        @NotBlank @Email @Size(max = 39) String email,
        Sex sex) {
}
