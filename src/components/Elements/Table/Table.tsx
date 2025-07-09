import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTableContext } from '../../Context/ElementContext/TableContext';
import type { TableObjectType } from '../../Context/ElementContext/TableContext';

type TableProps = {
  table: TableObjectType;
};

export default function Table({ table }: TableProps) {
  const [isHovered, setIsHovered] = useState(false);

  const tableStore = useTableContext();
  const updateCell = tableStore.getState().updateCell;
  const updateColumnTitle = tableStore.getState().updateColumnTitle;
  const addColumn = tableStore((state) => state.addColumn)
  const addRow = tableStore((state) => state.addRow)
  const deleteColumn = tableStore((state) => state.deleteColumn)
  const deleteRow = tableStore((state) => state.deleteRow)

  const { id: tableObjectId, parentTableId, columns, row: rows } = table;

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

    updateCell(parentTableId, tableObjectId, rowId, colId, value);
  };

  const handleColumnTitleChange = (colId: string, newTitle: string) => {
    updateColumnTitle(parentTableId, tableObjectId, colId, newTitle);
  };


  return (
    <div className="table-wrapper">
      <motion.div
        className="table-container"
        style={{
          display: 'grid',
          gridTemplateColumns: `${columns.map(() => 'minmax(80px, auto)').join(' ')} 40px`,
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Header */}
        {columns.map((col) => (
          <div key={col.id} className="table-header-cell">
          <button className='table-delete-btn' onClick={() => deleteColumn(parentTableId, table.id, col.id)}>x</button>
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
          onClick={() => addColumn(parentTableId, tableObjectId)}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          +
        </motion.div>

        {/* Rows */}
        {rows.map((row) =>
          columns.map((col, colIndex) => (
            <div key={`${row.id}-${col.id}`} className="table-cell">
              {colIndex === 0 && (
                <button className='table-delete-btn' onClick={() => deleteRow(parentTableId, table.id, row.id)}>x</button>
              )}
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
          onClick={() => addRow(parentTableId, tableObjectId)}
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
