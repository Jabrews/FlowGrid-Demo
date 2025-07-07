import { useState } from 'react';
import { motion } from 'framer-motion';

type TableColumn = {
  id: string;
  title: string;
};

type TableRow = {
  id: string;
  title: string;
  cells: Record<string, string>;
};

let colCount = 2;
let rowCount = 2;

export default function Table() {
  const [columns, setColumns] = useState<TableColumn[]>([
    { id: 'col1', title: 'Title 1' },
    // { id: 'col2', title: 'Title 2' },
  ]);

  const [rows, setRows] = useState<TableRow[]>([
    {
      id: 'row1',
      title: 'Row 1',
      cells: { col1: 'Alice', col2: '23' },
    },
    // {
    //   id: 'row2',
    //   title: 'Row 2',
    //   cells: { col1: 'Bob', col2: '30' },
    // },
  ]);

  const [isHovered, setIsHovered] = useState(false);

  const addColumn = () => {
    colCount++;
    const newColId = `col${colCount}`;
    const newColumn: TableColumn = {
      id: newColId,
      title: `Title ${colCount}`,
    };
    setColumns((prev) => [...prev, newColumn]);

    setRows((prevRows) =>
      prevRows.map((row) => ({
        ...row,
        cells: { ...row.cells, [newColId]: '' },
      }))
    );
  };

  const addRow = () => {
    rowCount++;
    const newRow: TableRow = {
      id: `row${rowCount}`,
      title: `Row ${rowCount}`,
      cells: columns.reduce((acc, col) => {
        acc[col.id] = '';
        return acc;
      }, {} as Record<string, string>),
    };
    setRows((prev) => [...prev, newRow]);
  };

  const handleCellChange = (
    rowId: string,
    colId: string,
    value: string,
    textarea?: HTMLTextAreaElement
  ) => {
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }

    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === rowId
          ? { ...row, cells: { ...row.cells, [colId]: value } }
          : row
      )
    );
  };

  const handleColumnTitleChange = (colId: string, newTitle: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === colId ? { ...col, title: newTitle } : col
      )
    );
  };

  return (
    <div className="table-wrapper">
      <motion.div
        className="table-container"
        style={{
          gridTemplateColumns: `${columns.map(() => 'minmax(80px, auto)').join(' ')} 40px`,
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Header */}
        {columns.map((col) => (
          <div key={col.id} className="table-header-cell">
            <input
              type="text"
              value={col.title}
              onChange={(e) => handleColumnTitleChange(col.id, e.target.value)}
              className="column-title"
            />
          </div>
        ))}
        <motion.div
          className="table-header-cell add-btn"
          onClick={addColumn}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          +
        </motion.div>

        {/* Rows */}
        {rows.map((row) =>
          columns.map((col) => (
            <div key={`${row.id}-${col.id}`} className="table-cell">
              <textarea
                value={row.cells[col.id]}
                onChange={(e) =>
                  handleCellChange(row.id, col.id, e.target.value, e.target)
                }
              />
            </div>
          )).concat(
            <div key={`${row.id}-spacer`} className="table-cell empty" />
          )
        )}

        {/* Add Row Button */}
        <motion.div
          className="table-cell add-btn"
          onClick={addRow}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          +
        </motion.div>
        {columns.slice(1).map((col) => (
          <div key={col.id} className="table-cell empty" />
        ))}
      </motion.div>
    </div>
  );
}
