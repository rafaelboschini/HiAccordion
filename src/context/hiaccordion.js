import React from 'react';

const HiAccordionContext = React.createContext();

export const HiAccordionContextProvider = ({ children }) => {  
    const [ selectedNodes, setSelectedNodes ] = React.useState([])

    React.useEffect(() => {
        let checkedList = JSON.parse(localStorage.getItem('itemsChecked'));
        setSelectedNodes(checkedList==null ? [] : checkedList);
    }, [])

    const checkAllChildrens = (item, status) => {
        let items = { ...selectedNodes }

        Object.values(item.children).forEach((children, index) => {
            items = {
                ...items,
                [children.id] : { ...children, status }
            }
        });
        
        let itemCheckedIds = JSON.parse(localStorage.getItem('itemsChecked')) || [] // get local storage data
        Object.keys(items).forEach((item) => {
            if(itemCheckedIds.filter(checkId=> checkId === item).length === 0){
                if(isNaN(item) && status==='checked') { // add item
                    itemCheckedIds.push(item);
                }
            }else if(isNaN(item) && status==='unchecked') {
                itemCheckedIds = itemCheckedIds.filter(id=> id !== item);
            }
        });

        localStorage.setItem('itemsChecked', JSON.stringify(itemCheckedIds));
        setSelectedNodes(itemCheckedIds);
    }

    return (
        <HiAccordionContext.Provider value={{ selectedNodes, checkAllChildrens }}>
            { children }
        </HiAccordionContext.Provider>
    )
};

export const useHiAccordionContext = () => {
    const context = React.useContext(HiAccordionContext)
    const { selectedNodes, checkAllChildrens } = context
    
    return { selectedNodes, checkAllChildrens }
}