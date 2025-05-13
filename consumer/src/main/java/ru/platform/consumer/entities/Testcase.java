package ru.platform.consumer.entities;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "testcases")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "testcaseId")
public class Testcase implements Serializable {
    @Id
    @GeneratedValue
    @Column(name = "testcase_id")
    private Long testcaseId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "problem_id")
    @JsonIgnore
    private Problem problem;

    @Column
    private String input;

    @Column
    private String output;
}
