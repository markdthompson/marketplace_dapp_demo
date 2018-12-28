pragma solidity ^0.4.24;

library AccountList {
    
    function SwapSort(address[] storage _arr, uint _index) internal returns(address[]){
        _arr[_index] = _arr[_arr.length - 1];
        delete _arr[_arr.length - 1];
        _arr.length--;
        
        return _arr;
    }
     
    function ReorderSort(address[] storage _arr, uint _index) internal returns(address[]){
        for(uint i = _index; i < _arr.length - 1; i++) {
            _arr[_index] = _arr[_index + 1];
        }
        delete _arr[_arr.length - 1];
        _arr.length--;
        
        return _arr;
    }
}
