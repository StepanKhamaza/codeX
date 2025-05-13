package ru.platform.consumer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.platform.consumer.entities.Submission;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
}
