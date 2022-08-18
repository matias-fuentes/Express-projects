import Pokemon from '../../Pokemon.model';
import { Dispatch } from 'redux';
import { isEditingEnumAT } from '../actionType.model';

export const setIsEditing = (whatIsEditing: Pokemon) => {
    return (dispatch: Dispatch) => {
        dispatch({
            type: isEditingEnumAT.IS_EDITING,
            payload: whatIsEditing,
        });
    };
};

export const setIsNotEditing = () => {
    return (dispatch: Dispatch) => {
        dispatch({
            type: isEditingEnumAT.IS_NOT_EDITING,
            payload: null,
        });
    };
};
