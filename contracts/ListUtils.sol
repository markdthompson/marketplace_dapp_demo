pragma solidity 0.5.0;

/**
 * @title ListUtils - a library to help manage lists
 * @author Mark D. Thompson <thomesoni@gmail.com>
 */
library ListUtils {
    /**
     * @notice Reorders an array after deleting an item by swapping with the last item in the list
     * @dev This method disregards order in the list
     * @param _arr - an address storage array to rearrange after deleting an item
     * @param _index - the index of the item to delete
     * @return returns the modified array
     */
    function AddressSwapSort(address[] storage _arr, uint _index) internal returns(address[] memory){
        _arr[_index] = _arr[_arr.length - 1];
        delete _arr[_arr.length - 1];
        _arr.length--;

        return _arr;
    }

    /**
     * @notice Reorders an array after deleting an item by sliding values down the list from the end to the _index
     * @dev Preserves order, but is expensive on gas with bigger lists
     * @param _arr - an address storage array to rearrange after deleting an item
     * @param _index - the index of the item to delete
     * @return returns the modified array
     */
    function AddressReorderSort(address[] storage _arr, uint _index) internal returns(address[] memory){
        for(uint i = _index; i < _arr.length - 1; i++) {
            _arr[_index] = _arr[_index + 1];
        }
        delete _arr[_arr.length - 1];
        _arr.length--;

        return _arr;
    }

    /**
     * @notice Reorders an array after deleting an item by swapping with the last item in the list
     * @dev Preserves order, but is expensive on gas with bigger lists
     * @param _arr - a uint storage array to rearrange after deleting an item
     * @param _index - the index of the item to delete
     * @return returns the modified array
     */
    function UintSwapSort(address[] storage _arr, uint _index) internal returns(address[] memory){
        _arr[_index] = _arr[_arr.length - 1];
        delete _arr[_arr.length - 1];
        _arr.length--;

        return _arr;
    }

    /**
     * @notice Reorders an array after deleting an item by sliding values down the list from the end to the _index
     * @dev Preserves order, but is expensive on gas with bigger lists
     * @param _arr - a uint storage array to rearrange after deleting an item
     * @param _index - the index of the item to delete
     * @return returns the modified array
     */

    function UintReorderSort(uint[] storage _arr, uint _index) internal returns(uint[] memory){
        for(uint i = _index; i < _arr.length - 1; i++) {
            _arr[_index] = _arr[_index + 1];
        }
        delete _arr[_arr.length - 1];
        _arr.length--;

        return _arr;
    }
}
