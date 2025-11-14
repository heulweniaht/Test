package com.sudoku.controller;

import com.sudoku.dto.SudokuGameDto; // Import DTO
import com.sudoku.service.SudokuGenerator; // Import Service
import org.springframework.beans.factory.annotation.Autowired; // Thêm
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RequestMapping("/api/sudoku")
public class SudokuController {

    // Tiêm (Inject) service
    @Autowired
    private SudokuGenerator sudokuGenerator;

    // === ENDPOINT MỚI ===
    @GetMapping("/generate")
    public SudokuGameDto generate(@RequestParam String level) {
        return sudokuGenerator.generateGame(level);
    }

    // === ENDPOINT CŨ CỦA BẠN ===
    @PostMapping("/solve")
    public Map<String, Object> solve(@RequestBody Map<String, Object> payload) {
        List<List<String>> grid = (List<List<String>>) payload.get("grid");
        int[][] board = new int[9][9];
        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++) {
                String val = grid.get(i).get(j);
                board[i][j] = val != null && !val.isEmpty() ? Integer.parseInt(val) : 0;
            }
        }
        boolean solved = solveSudoku(board);
        Map<String, Object> result = new HashMap<>();
        if (solved) {
            List<List<String>> solution = new ArrayList<>();
            for (int i = 0; i < 9; i++) {
                List<String> row = new ArrayList<>();
                for (int j = 0; j < 9; j++) {
                    row.add(String.valueOf(board[i][j]));
                }
                solution.add(row);
            }
            result.put("solution", solution);
        } else {
            result.put("solution", null);
        }
        return result;
    }

    private boolean solveSudoku(int[][] board) {
        for (int row = 0; row < 9; row++) {
            for (int col = 0; col < 9; col++) {
                if (board[row][col] == 0) {
                    for (int num = 1; num <= 9; num++) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;
                            if (solveSudoku(board)) {
                                return true;
                            }
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    private boolean isValid(int[][] board, int row, int col, int num) {
        for (int i = 0; i < 9; i++) {
            if (board[row][i] == num || board[i][col] == num) return false;
        }
        int startRow = row - row % 3, startCol = col - col % 3;
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (board[startRow + i][startCol + j] == num) return false;
            }
        }
        return true;
    }
}   