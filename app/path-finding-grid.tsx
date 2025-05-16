'use client'
import React, { useEffect, useState } from "react";
import PF from "pathfinding";

const GRID_ROWS = 10;
const GRID_COLS = 15;

const CellType = {
  EMPTY: "empty",
  WALL: "wall",
  START: "start",
  END: "end",
  PATH: "path",
};

export default function PathfindingGrid() {
  const [grid, setGrid] = useState([]);
  const [start, setStart] = useState({ row: 0, col: 0 });
  const [end, setEnd] = useState({ row: 9, col: 14 });

  useEffect(() => {
    const initialGrid = Array.from({ length: GRID_ROWS }, (_, row) =>
      Array.from({ length: GRID_COLS }, (_, col) => ({
        row,
        col,
        type:
          row === start.row && col === start.col
            ? CellType.START
            : row === end.row && col === end.col
            ? CellType.END
            : CellType.EMPTY,
      }))
    );
    setGrid(initialGrid);
  }, [start, end]);

  const handleCellClick = (row, col) => {
    setGrid((prev) => {
      return prev.map((r) =>
        r.map((cell) => {
          if (cell.row === row && cell.col === col) {
            if (cell.type === CellType.EMPTY) return { ...cell, type: CellType.WALL };
            if (cell.type === CellType.WALL) return { ...cell, type: CellType.EMPTY };
          }
          return cell;
        })
      );
    });
  };

  const visualizePath = () => {
    const matrix = grid.map((row) =>
      row.map((cell) => (cell.type === CellType.WALL ? 1 : 0))
    );

    const finder = new PF.AStarFinder();
    const pfGrid = new PF.Grid(matrix);
    const path = finder.findPath(
      start.col,
      start.row,
      end.col,
      end.row,
      pfGrid
    );

    setGrid((prev) =>
      prev.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isPath = path.some(
            ([x, y]) => y === rowIndex && x === colIndex
          );
          if (
            cell.type === CellType.EMPTY &&
            isPath &&
            !(rowIndex === start.row && colIndex === start.col) &&
            !(rowIndex === end.row && colIndex === end.col)
          ) {
            return { ...cell, type: CellType.PATH };
          }
          return cell;
        })
      )
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">A* Pathfinding Visualizer</h1>
      <div className="grid" style={{ display: "grid", gridTemplateColumns: `repeat(${GRID_COLS}, 24px)` }}>
        {grid.flat().map((cell) => (
          <div
            key={`${cell.row}-${cell.col}`}
            onClick={() => handleCellClick(cell.row, cell.col)}
            className={`w-6 h-6 border border-gray-300 cursor-pointer
              ${cell.type === CellType.START ? "bg-green-500" : ""}
              ${cell.type === CellType.END ? "bg-red-500" : ""}
              ${cell.type === CellType.WALL ? "bg-gray-700" : ""}
              ${cell.type === CellType.PATH ? "bg-blue-400" : ""}
            `}
          />
        ))}
      </div>
      <button onClick={visualizePath} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
        Visualize A*
      </button>
    </div>
  );
}
