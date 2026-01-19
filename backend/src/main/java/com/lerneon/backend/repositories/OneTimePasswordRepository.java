package com.lerneon.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lerneon.backend.models.entity.OneTimePassword;
import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.enums.VerificationType;

@Repository
public interface OneTimePasswordRepository extends JpaRepository<OneTimePassword, Integer> {
    Optional<OneTimePassword> findByUserAndVerificationType(User user, VerificationType verificationType);

    void deleteAllByUserAndVerificationType(User user, VerificationType verificationType);

    Optional<List<OneTimePassword>> findAllByUser(User user);
}
