package com.sudoku.service;

import com.sudoku.dto.SudokuGameDto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class SudokuGenerator {

    private int solutionCounter;

    // Hàm chính để tạo game
    public SudokuGameDto generateGame(String level) {
        int[][] board = new int[9][9];
        int[][] solution = new int[9][9];

        // 1. Tạo một lời giải đầy đủ ngẫu nhiên
        fillBoard(board);

        // 2. Sao chép lời giải ra
        for (int i = 0; i < 9; i++) {
            System.arraycopy(board[i], 0, solution[i], 0, 9);
        }

        // 3. Đục lỗ
        int holes = getHolesByLevel(level);
        digHoles(board, holes);

        // 4. Chuyển đổi sang List<List<String>>
        List<List<String>> puzzleList = boardToList(board);
        List<List<String>> solutionList = boardToList(solution);

        return new SudokuGameDto(puzzleList, solutionList);
    }

    // Xác định số lỗ dựa trên cấp độ
    private int getHolesByLevel(String level) {
        switch (level.toLowerCase()) {
            case "medium":
                return 48; // (33 gợi ý)
            case "hard":
                return 55; // (26 gợi ý)
            case "easy":
            default:
                return 40; // (41 gợi ý)
        }
    }

    // Đệ quy backtracking để điền đầy bảng
    private boolean fillBoard(int[][] board) {
        for (int row = 0; row < 9; row++) {
            for (int col = 0; col < 9; col++) {
                if (board[row][col] == 0) {
                    List<Integer> numbers = new ArrayList<>();
                    for (int i = 1; i <= 9; i++) numbers.add(i);
                    Collections.shuffle(numbers); // Xáo trộn để tạo ngẫu nhiên

                    for (int num : numbers) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;
                            if (fillBoard(board)) {
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

    // Đục lỗ
    private void digHoles(int[][] board, int holes) {
        List<int[]> coords = new ArrayList<>();
        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++) {
                coords.add(new int[]{i, j});
            }
        }
        Collections.shuffle(coords); // Xáo trộn vị trí các ô

        int holesDug = 0;
        for (int[] coord : coords) {
            if (holesDug >= holes) break;

            int row = coord[0];
            int col = coord[1];
            int temp = board[row][col];
            board[row][col] = 0;

            // Kiểm tra xem lời giải có còn duy nhất không
            solutionCounter = 0;
            countSolutions(board, 0);

            if (solutionCounter != 1) {
                // Nếu xóa ô này mà có > 1 lời giải (hoặc 0), thì điền lại
                board[row][col] = temp;
            } else {
                holesDug++;
            }
        }
    }

    // Đếm số lời giải (để đảm bảo tính duy nhất)
    private void countSolutions(int[][] board, int index) {
        if (solutionCounter > 1) return; // Tối ưu: dừng nếu đã > 1

        if (index == 81) {
            solutionCounter++;
            return;
        }

        int row = index / 9;
        int col = index % 9;

        if (board[row][col] != 0) {
            countSolutions(board, index + 1);
            return;
        }

        for (int num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
                board[row][col] = num;
                countSolutions(board, index + 1);
                board[row][col] = 0; // Backtrack
            }
        }
    }

    // Hàm kiểm tra hợp lệ
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

    // Chuyển đổi mảng 2D int sang List
    private List<List<String>> boardToList(int[][] board) {
        List<List<String>> list = new ArrayList<>();
        for (int i = 0; i < 9; i++) {
            List<String> row = new ArrayList<>();
            for (int j = 0; j < 9; j++) {
                row.add(board[i][j] == 0 ? "" : String.valueOf(board[i][j]));
            }
            list.add(row);
        }
        return list;
    }
}