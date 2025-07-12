import { useState, useEffect } from 'react'
import { useTimerMenuContext } from '../../../Context/TrackerMenusContext/TimerMenuContext'
import type { connectedMenuItem } from '../../../Context/TrackerMenusContext/TimerMenuContext'
// pair context
import { usePairFactoryContext } from '../../../Context/PairFactory/PairFactoryContext'

// tracker menus / components
import TrackerTimerMenu from "./TrackerMenus/TrackerTimerMenu"

// connection line context
import { useConnectionLinesContext } from '../../../Context/ConnectionLines/ConnectionLines'

type TrackerProps = {
    id: string;
};

type MenuInfo = {
    activeType : string;
    activeId : string;
}


export default function Tracker({id}: TrackerProps) {
    const [connectedMenuItems, setConnectedMenuItems] = useState<connectedMenuItem[]>([])
    const [activeMenu, setActiveMenu] = useState(0)
    const [activeMenuInfo, setActiveMenuInfo] = useState<MenuInfo[]>([])
    const [currentMenuInfo, setCurrentMenuInfo] = useState<MenuInfo>({activeId : 'none', activeType : 'none'})
    
    // update tracker when connected
    const timerMenuStore = useTimerMenuContext();
    const checkTrackerConnected = timerMenuStore((state) => state.checkTrackerConnected);
    const findTimerTrackerConnections = timerMenuStore((state) => state.findTimerTrackerConnections) 
    const timerTrackerItems = timerMenuStore((state) => state.timerTrackerItems)

    const pairStore = usePairFactoryContext()
    const connectedItems = pairStore((state) => state.connectedItems)
   
    const lineStore = useConnectionLinesContext()
    const connectionLines = lineStore((state) => state.connectionLines)


    useEffect(() => {
        if (connectedMenuItems.length > 0) {
            loadMenuInfoFromIndex(activeMenu);
        }
    }, [connectedMenuItems, activeMenu]);

    // improved sync with full reset logic
    useEffect(() => {
        // 1. rebuild connected menu items
        setConnectedMenuItems(findTimerTrackerConnections(id));

        // 2. rebuild active menu info with numbering
        const newActiveInfo: MenuInfo[] = timerTrackerItems.map((item, index) => {
            const sameTypeCount = timerTrackerItems
                .slice(0, index)
                .filter(other => other.item.type === item.item.type)
                .length;

            const typeWithNumber = sameTypeCount > 0
                ? `${item.item.type}${sameTypeCount + 1}`
                : item.item.type;

            return {
                activeId: item.item.id,
                activeType: typeWithNumber,
            };
        });

        setActiveMenuInfo(newActiveInfo);

        // 3. handle no items left
        if (timerTrackerItems.length === 0) {
            setCurrentMenuInfo({ activeId: 'none', activeType: 'none' });
        } else {
            // clamp active index to valid range
            const validIndex = Math.min(activeMenu, timerTrackerItems.length - 1);
            setActiveMenu(validIndex);
            loadMenuInfoFromIndex(validIndex);
        }
    }, [timerTrackerItems]);

    

    const loadMenuInfoFromIndex = (index: number) => {
        const item = activeMenuInfo[index];
        if (item) {
            setCurrentMenuInfo({
                activeType : item.activeType,
                activeId: item.activeId,
            });
        } else {
            setCurrentMenuInfo({
                activeType: 'none',
                activeId: 'none'
            });
        }
    };

    const handleNavigateBack = () => {
        if (activeMenu !== 0) {
            setActiveMenu(prev => {
                const newIndex = prev - 1;
                setTimeout(() => {
                    loadMenuInfoFromIndex(newIndex);
                }, 0);
                return newIndex;
            });
        }
    };

    const handleNavigateFoward = () => {
        if (activeMenu < connectedMenuItems.length - 1) {
            setActiveMenu(prev => {
                const newIndex = prev + 1;
                setTimeout(() => {
                    loadMenuInfoFromIndex(newIndex);
                }, 0);
                return newIndex;
            });
        }
    };

    return (
        <div className='tracker-container'>
            {/* Tracker Header */}
            <div className='tracker-header'>
                <button onClick={handleNavigateBack}> &lt; </button>
                <h1> {currentMenuInfo.activeType} </h1>
                <button onClick={handleNavigateFoward}> &gt; </button>
            </div>

            {/* Tracker Content */}
            <div className='tracker-menu-container'>
                <div className='tracker-menu-header' style={{overflow: 'visible'}}>
                    <p> Connected to : {currentMenuInfo.activeId}</p>
                </div>
                <div className="tracker-menu-content"> 
                    {connectedMenuItems.length === 0 ? (
                        <p>No connected items.</p>
                    ) : (
                        connectedMenuItems.map((item, idx) => {
                            if (item.type === 'TimerPair') {
                                return (
                                    <div key={idx}
                                        style={{
                                            display : idx === activeMenu ? 'grid' : 'none'
                                        }}
                                    >
                                        <TrackerTimerMenu 
                                        parentTimerId={item.item.id}
                                        parentTrackerId={item.tracker.id}
                                        key={`timerMenu-${item.pairId}-${idx}`}
                                        {...item} />
                                    </div>
                                );
                            }
                            return null;
                        })
                    )}
                </div>
            </div>
        </div>
    )
}
