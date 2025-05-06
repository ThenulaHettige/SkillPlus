package com.skillplus.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skillplus.backend.entity.LearningPlan;
import com.skillplus.backend.entity.User;

// public interface LearningPlanRepository extends JpaRepository<LearningPlan, Long> {
//     List<LearningPlan> findByUser(User user);
// }
public interface LearningPlanRepository extends JpaRepository<LearningPlan, Long> {

    void deleteByUser(User user); // for manual deletion if needed

    List<LearningPlan> findByUser(User user);
}
