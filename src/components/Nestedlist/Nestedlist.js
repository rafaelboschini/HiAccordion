import React from 'react';
import { hasSelectedChildren } from '../../helpers/nodehelper';
import { useHiAccordionContext } from '../../context/hiaccordion';
import Checkbox from '../Checkbox/Checkbox';
import ToggleIcon from '../Toggleicon/Toggleicon';

import styles from './Nestedlist.module.scss';

export default function Nestedlist({ nodeItem }) {
  const { selectedNodes, checkAllChildrens } = useHiAccordionContext();
  const [ItemToggle, toggleChildren] = React.useState(false);
  const [ItemChecked, changeCheckStatus] = React.useState("unchecked");

  const hasChildren = nodeItem.children && Object.keys(nodeItem.children).length > 0;

  const toggleItem = React.useCallback(() => {
    let childrensOpenIds = JSON.parse(localStorage.getItem('itemsToggleIds')) || [] // get local storage data

    if(childrensOpenIds.filter(id=> nodeItem.id === id).length > 0) {
      childrensOpenIds = childrensOpenIds.filter(id=> nodeItem.id !== id); // remove item
    } else {
      childrensOpenIds.push(nodeItem.id); // add item
    }

    localStorage.setItem('itemsToggleIds',JSON.stringify(childrensOpenIds)); // save in localstorage

    
    toggleChildren(() => !ItemToggle);
  });

  const checkItem = React.useCallback(() => {
    let itemCheckedIds = JSON.parse(localStorage.getItem('itemsChecked')) || [] // get local storage data
    
    let checkStatus = "checked";

    if(itemCheckedIds.filter(id=> nodeItem.id === id).length > 0) {
      itemCheckedIds = itemCheckedIds.filter(id=> nodeItem.id !== id); // remove item
      checkStatus = "unchecked";
    } else {
      itemCheckedIds.push(nodeItem.id);
    }
    
    localStorage.setItem('itemsChecked', JSON.stringify(itemCheckedIds)); // save in localstorage
    
    checkAllChildrens(nodeItem, checkStatus);
    changeCheckStatus(() => checkStatus);
  });

  React.useEffect(() => {
    /** Keep toggle state */
    let childrensOpenIds = JSON.parse(localStorage.getItem('itemsToggleIds')) || [];
    if(childrensOpenIds.filter(item=>item===nodeItem.id).length > 0) 
      toggleChildren(() => true);

    /** keeps checked state */
    if(selectedNodes.filter(item=>item===nodeItem.id).length > 0) {
      changeCheckStatus('checked');
    } else {
      changeCheckStatus((hasSelectedChildren(nodeItem, selectedNodes) ? 'halfchecked' : 'unchecked'));      
    }      
  }, [selectedNodes]);

  return (
    <div className={styles.Nestedlist} data-testid="Nestedlist">
      <div className={styles.parent}>
        <div onClick={() => checkItem()}><Checkbox status={ItemChecked}></Checkbox></div>
        <div onClick={() => checkItem()}>{nodeItem.name}</div>
        <div onClick={() => toggleItem()}>
          {hasChildren && (     
              <ToggleIcon collapsed={ItemToggle}></ToggleIcon>
          )} 
        </div>               
      </div>
      {hasChildren && ItemToggle && (
        <div className={styles.children}>
          {Object.values(nodeItem.children).map((value, index) => (
              <Nestedlist key={index} nodeItem={value} />
          ))}
        </div>
      )}
    </div>
  );
};
