package ru.platform.gateway.main.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.platform.gateway.main.entities.Submission;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    Optional<List<Submission>> findByUsernameOrderByCreatedDesc(String username);

    Optional<List<Submission>> findByUsernameAndProblemIdOrderByCreatedDesc(String username, Long problemId);

    Optional<Submission> findById(Long id);

    Optional<List<Submission>> findAllByOrderByCreatedDesc();

    Page<Submission> findAllByOrderByCreatedDesc(Pageable pageable);
}
