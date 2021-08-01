var tempArr = [];


export function numberWithCommas(x) {
    return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0;
}

export function filter (array, value, [key, ...keys], recentResult=[]) {
    var filterArr = subFind(array, key, value);
    tempArr = recentResult;
    
    if( value === '') return array;
    if(keys.length){
        if(filterArr.length)
        { 
            var stack = compare2array(tempArr, filterArr);
            tempArr = stack;
        }
        filter( array, value, keys, tempArr );
    }else{
        
        tempArr = compare2array(tempArr, filterArr);
    }
    
    return tempArr;
}

const compare2array = (origin, target) => {
    //find values that are in origin but not in target
    var uniqueOne = origin.filter(org => 
        !target.some(tar => org._id === tar._id)
    );

    //find values that are in target but not in origin
    var uniqueTwo = target.filter(tar => 
        !origin.some(org => org._id === tar._id)
    );

    //combine 2 arrays of unique values
    return uniqueOne.concat(uniqueTwo);
}

const subFind = (array, key, value) => {
    // console.log('key', array, key, value);
    // if( key == 'department_id' ){
    //     console.log('department case -- ')
    //     array.filter( item => {
    //         console.log('item', typeof item[key], item[key])
    //     });
    // }
    
    return array.filter(o => 
        o[key] && typeof o[key] !== 'object' && typeof o[key] !== 'undefined' ? 
        o[key].toLowerCase().includes(value.toLowerCase()) 
        : o[key] ? o[key].name.toLowerCase().includes(value.toLowerCase()) : ''
    );
}
  
