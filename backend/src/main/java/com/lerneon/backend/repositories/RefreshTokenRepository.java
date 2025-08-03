package com.lerneon.backend.repositories;

import com.lerneon.backend.models.entity.RefreshToken;
import com.lerneon.backend.models.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Integer> {
    Optional<List<RefreshToken>> findAllByUser(User user);

    Optional<RefreshToken> findByToken(String token);

    void deleteAllByUser(User user);
}
