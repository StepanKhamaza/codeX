package ru.platform.gateway.main.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.platform.gateway.main.entities.Testcase;

import java.util.Optional;

@Repository
public interface TestcaseRepository extends JpaRepository<Testcase, Long> {
    Optional<Testcase> findById(Long id);
}
