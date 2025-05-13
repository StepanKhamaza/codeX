package ru.platform.gateway.security.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.platform.gateway.security.entities.Token;

import java.util.List;
import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {
    @Query("""
            select t from Token t inner join User u on t.user.username = u.username
            where t.user.username = :username and t.loggedOut = false
            """)
    Optional<List<Token>> findAllTokensByUser(String username);

    Optional<Token> findByToken(String token);
}
