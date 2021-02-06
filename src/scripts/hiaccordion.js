/** 
 * @desc HiAcordion is a component for work with nested list, thats is a part of HiFrameWorkUI 
 * @author Rafael Boschini <rafaelboischini@gmail.com>
 * @repo htps://github.com/rafaelboschini/hiaccordion
 */
class HiAccordion {    
    constructor(options) {
        this.elem = options.elem;
        this.data = options.data;
        this.errorCallback = options.errorCallback;
        this.checkItemCallBack = options.checkItemCallBack;
        this.expandItemCallBack = options.expandItemCallBack;
        this.enableLocalStorage = (!options.enableLocalStorage ? true : options.enableLocalStorage); // enable use the localstorage, default is true
        this.wildcard = options.elem.id;

        /** render component in container */
        if (this.elem) {
            this.keyselected = `selected-${this.elem.id}`;
            this.keyexpanded = `expanded-${this.elem.id}`;

            if (this.data && this.data !== null) this.bind(this.data);
        } else {
            this.handleError('Element container not found', {});
        }
    }

    /** you can bind component by constructor option or using this fn */
    bind = (data) => {
        this.data = data;
        this.elem.appendChild(this.render(this.data));

        if(this.enableLocalStorage) this.loadStorageData(); // recovery previous state
    }

    serviceStorage = (key, value) => {
        if(localStorage){
            localStorage.setItem(this.keyselected, this.getAllSelected());
            localStorage.setItem(this.keyexpanded, this.getAllExpanded());
        }
    };

    loadStorageData = () => {
        try{
            var expanded = localStorage.getItem(this.keyexpanded);
            var checked = localStorage.getItem(this.keyselected);
    
            /** restore expanded state */
            if (expanded) {
                expanded = expanded.split(',');
                for (let x = 0; x < expanded.length; x++) {
                    this.elem.querySelector('ul[parent-id="'+expanded[x]+'"]').setAttribute('aria-expanded', true);
                }
            }; 
            
            /** restore checked state */
            if(checked){
                checked = checked.split(',');
                for (let x = 0; x < checked.length; x++) {
                    this.elem.querySelector('span[data-id="'+ checked[x] +'"]').setAttribute('aria-selected',true);
                }
            }
        } catch(ex) {
            this.handleError('Error when load storage data', ex);
        }
    };

    /** handle click at toggle arrow icon */
    handleToggleClick = (e) => {
        try {
            var ul = e.target.parentNode.querySelector('ul');
            var expanded = ul.getAttribute('aria-expanded') === 'true';

            if (ul && ul !== null) {
                ul.setAttribute('aria-expanded', !expanded);
                                
                if(this.expandItemCallBack) this.expandItemCallBack(); // option callback

                if(localStorage && this.enableLocalStorage) {
                    /** this timeout is an workaround to prevent false unchecked */
                    setTimeout(() => {
                        this.serviceStorage();
                    }, 50);
                }
            }
        } catch(ex) {
            this.handleError('Item click Exception', ex);
        }
    };

    /** handle click at accordion item */
    handleClick = (e) => {
        try{
            var check = e.target.parentNode.querySelector('span');
            if (check) check.click();
        } catch(ex) {
            this.handleError('Item click Exception', ex);
        }
    };

    /** handle click in virtual checkbox */
    handleCheckItem = (e) => {
        try {
            var itemId = e.target.getAttribute('data-id');
            var selected = e.target.getAttribute('aria-selected') === 'true';
    
            /** set attribute to indicate selected items */
            e.target.setAttribute('aria-selected', !selected);
    
            /** Check all childrens when the parent has checked */
            if(e.target.parentNode.querySelector('ul')){
                var checkChildrens = e.target.parentNode.querySelector('ul').querySelectorAll('span');            
                for(let x=0; x < checkChildrens.length; x++){
                    checkChildrens[x].setAttribute('aria-selected',!selected);
                }
            }

            if(this.checkItemCallBack) this.checkItemCallBack(e);  // option callback

            /** Persist component state */
            /** @TODO implements fallback in case of unsupported localstorage */
            if(localStorage && this.enableLocalStorage) {
                setTimeout(() => {
                    this.serviceStorage();
                }, 50);
            }
        } catch(ex) {
            this.handleError('Check click Exception', ex);
        }
    }

    /** get all checkeds items id */
    getAllSelected = () => {
        var checkList = this.elem.querySelectorAll('span[aria-selected="true"]');
        
        var checkedList = [];
        for(let x=0; x < checkList.length; x++){
            checkedList.push(checkList[x].getAttribute('data-id'));
        }

        return checkedList;
    };

    /** get all expanded items id */
    getAllExpanded = () => {
        var checkList = this.elem.querySelectorAll('ul[aria-expanded=true]');
        var ids = [];

        for (let x = 0; x < checkList.length; x++) {
            ids.push(checkList[x].getAttribute('parent-id'));
        }

        return ids;
    };

    /** render all UI of component */
    render = (listData, name) => {
        var nestedList = document.createElement('ul');
        nestedList.classList.add('hiaccordion');

        if (name) {
            nestedList.setAttribute("parent-id", name);
        } else {
            /** define an unique name for container instance */
            nestedList.setAttribute("id", this.wildcard);
        }

        /** @private label factory */
        const renderLabel = function(id, name, wildcard) {
            let label = document.createElement("label");
            label.setAttribute('for', `ck${wildcard}-${id}`);
            label.innerText = name;

            return label;
        };

        var countItems = 0;
        while (true) {
            if (!listData[countItems]) break; /** get out of while when items list is over */

            /** create a parent item */
            let nestedItem = document.createElement("li");

            nestedItem.classList.add('hiaccordion-item');

            /** create label */
            let label = renderLabel(listData[countItems].id, listData[countItems].name, this.wildcard);
            label.addEventListener("click", this.handleClick, true);

            nestedItem.appendChild(label);           

            /** create virtual checkbox */
            let virtualcheck = document.createElement("span");
            virtualcheck.setAttribute('data-id',listData[countItems].id);
            virtualcheck.addEventListener("click", this.handleCheckItem, true);
            nestedItem.appendChild(virtualcheck);

            /** create children items */
            let childrensDOM = this.render(listData[countItems].children, `${this.wildcard}-${listData[countItems].id}`);
            if (childrensDOM != null) {


                //let nestedChildren = document.createElement("li");
                //nestedChildren.classList.add('hiaccordion-item');
                
                nestedItem.appendChild(childrensDOM);

                let toggleIcon = document.createElement("i");
                toggleIcon.addEventListener("click", this.handleToggleClick, true);
                nestedItem.appendChild(toggleIcon); // create colapse arrow
            }

            /** insert item at component list */
            nestedList.appendChild(nestedItem);

            countItems++;
        }

        /** prevent empty items */
        if (countItems === 0) return null;

        return nestedList;
    };

    handleError(msg, e) {
        if (this.errorCallback) {
            /** You can use a custom fn to handle with errors */
            this.errorCallback(e, msg);
        } else {
            console.error(msg, e);
        }
    }
}