import { useEffect, useState } from 'react';
import { useTableContext } from '../../Context/ElementContext/TableContext';

// components
import Table from './Table';

type TableListProps = {
  id: string;
};

export default function TableList({ id }: TableListProps) {
  const INDEXMAX = 2;

  const [activeListIndex, setActiveListIndex] = useState(0);
  const [titleInput, setTitleInput] = useState('');

  const tableStore = useTableContext();
  const createNewTableObject = tableStore.getState().createNewTableObject;
  const createTable = tableStore.getState().createTable;
  const updateTableObjectTitle = tableStore.getState().updateTableObjectTitle;

const tableObjects = useTableContext()((state) => {
  const table = state.tables.find((t) => t.id === id);
  return table?.tableObjects ?? [];
});

  useEffect(() => {
    createTable(id);
  }, [id, createTable]);

  useEffect(() => {
    if (activeListIndex >= tableObjects.length) {
      createNewTableObject(id);
    }
  }, [activeListIndex, tableObjects.length]);

  useEffect(() => {
    const current = tableObjects[activeListIndex];
    if (current) {
      setTitleInput(current.title || 'Untitled Table');
    }
  }, [activeListIndex, tableObjects]);

  const handleListNavigation = (direction: string) => {
    if (direction === 'forward' && activeListIndex < INDEXMAX) {
      setActiveListIndex((prev) => prev + 1);
    }
    if (direction === 'back' && activeListIndex > 0) {
      setActiveListIndex((prev) => prev - 1);
    }
  };

  const currentTableObject = tableObjects[activeListIndex];

  return (
    <div className="table-list-container">
      <div className="table-list-navigation">
        <button onClick={() => handleListNavigation('back')}>&lt;</button>

        {currentTableObject ? (
          <input
            className="table-title-input"
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={() =>
              updateTableObjectTitle(id, currentTableObject.id, titleInput)
            }
            placeholder="Untitled Table"
          />
        ) : (
          <span>Untitled Table</span>
        )}

        <button onClick={() => handleListNavigation('forward')}>&gt;</button>
      </div>

      {currentTableObject ? (
        <Table key={currentTableObject.id} table={currentTableObject} />
      ) : (
        <p>No table object found</p>
      )}
    </div>
  );
}
