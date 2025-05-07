package com.skillplus.backend.controller;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillplus.backend.entity.Comment;
import com.skillplus.backend.entity.Post;
import com.skillplus.backend.entity.User;
import com.skillplus.backend.repository.PostRepository;
import com.skillplus.backend.repository.UserRepository;
import com.skillplus.backend.service.CommentService;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;
    //comment controller

    @PostMapping("/{postId}")
    public Comment addComment(@PathVariable Long postId, @RequestBody Comment comment, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        Post post = postRepository.findById(postId).orElseThrow();
        comment.setUser(user);
        comment.setPost(post);
        return commentService.save(comment);
    }

    @GetMapping("/{postId}")
    public List<Comment> getComments(@PathVariable Long postId) {
        Post post = postRepository.findById(postId).orElseThrow();
        return commentService.getCommentsByPost(post);
    }
//commentid
    @PutMapping("/{commentId}")
    public ResponseEntity<Comment> updateComment(@PathVariable Long commentId, @RequestBody Map<String, String> request, Principal principal) {
        Comment comment = commentService.getCommentById(commentId);
        if (!comment.getUser().getEmail().equals(principal.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        comment.setContent(request.get("content"));
        return ResponseEntity.ok(commentService.save(comment));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId, Principal principal) {
        Comment comment = commentService.getCommentById(commentId);
        String currentUser = principal.getName();
        boolean isOwner = comment.getUser().getEmail().equals(currentUser);
        boolean isPostOwner = comment.getPost().getUser().getEmail().equals(currentUser);
//create a if
        if (isOwner || isPostOwner) {
            commentService.deleteById(commentId);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

}
