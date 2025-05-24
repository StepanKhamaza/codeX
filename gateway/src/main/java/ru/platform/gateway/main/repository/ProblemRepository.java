package ru.platform.gateway.main.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.platform.gateway.main.entities.Problem;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {
    List<Problem> findAll();

    Optional<Problem> findById(Long id);

    @Query(value = """
            select new Problem(
                        p.problemId,
                        p.title,
                        p.text,
                        p.inputFormat,
                        p.outputFormat,
                        p.problemDifficulty,
                        p.timeLimit,
                        p.memoryLimit,
                        p.created)
            from Problem p order by p.problemId
            """)
    Page<Problem> findAllWithoutTestcasesOrderByProblemId(Pageable pageable);
}
