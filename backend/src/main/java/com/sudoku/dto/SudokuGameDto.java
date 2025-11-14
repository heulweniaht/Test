package com.sudoku.dto;

import java.util.List;

public class SudokuGameDto {
    private List<List<String>> puzzle;
    private List<List<String>> solution;

    public SudokuGameDto(List<List<String>> puzzle, List<List<String>> solution) {
        this.puzzle = puzzle;
        this.solution = solution;
    }

    // Getters
    public List<List<String>> getPuzzle() {
        return puzzle;
    }

    public List<List<String>> getSolution() {
        return solution;
    }
}