export const hasSelectedChildren = (item, selectedNodes) => {
    let hasChildrenchecked = false;

    Object.keys(item.children).forEach(index => {
      if(selectedNodes.filter(node=>node===item.children[index].id).length > 0) {
        hasChildrenchecked = true; 
        return;
      }
    });

    return hasChildrenchecked;
};