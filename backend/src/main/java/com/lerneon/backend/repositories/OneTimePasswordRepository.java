package com.lerneon.backend.repositories;

import com.lerneon.backend.models.entity.OneTimePassword;
import com.lerneon.backend.models.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OneTimePasswordRepository extends JpaRepository<OneTimePassword, Integer> {
    Optional<OneTimePassword> findByCode(String code);

    void deleteAllByUser(User user);

    Optional<List<OneTimePassword>> findAllByUser(User user);
}
