package com.skillplus.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skillplus.backend.entity.LearningPlan;
import com.skillplus.backend.entity.LearningPlanResponse;
import com.skillplus.backend.entity.User;
import com.skillplus.backend.repository.LearningPlanRepository;

@Service
public class LearningPlanService {

    @Autowired
    private LearningPlanRepository learningPlanRepository;

    public LearningPlan save(LearningPlan plan) {
        return learningPlanRepository.save(plan);
    }

    public List<LearningPlanResponse> getAllPlansAsResponse() {
        List<LearningPlan> plans = learningPlanRepository.findAll();

        return plans.stream()
                .map(plan -> {
                    User user = plan.getUser(); // make sure this is not lazy/null
                    String username = (user != null) ? user.getUsername() : "Anonymous";
                    String profileImage = (user != null) ? user.getProfileImage() : null;

                    return new LearningPlanResponse(
                            plan.getId(),
                            plan.getTitle(),
                            plan.getTopics(),
                            plan.getResources(),
                            plan.getTargetDate(),
                            plan.getProgress(),
                            username,
                            profileImage
                    );
                })
                .toList();
    }

    public List<LearningPlan> getPlansByUser(User user) {
        return learningPlanRepository.findByUser(user);
    }

    public void deleteById(Long id) {
        learningPlanRepository.deleteById(id);
    }

    public LearningPlan getPlanById(Long id) {
        return learningPlanRepository.findById(id).orElseThrow();
    }

}
