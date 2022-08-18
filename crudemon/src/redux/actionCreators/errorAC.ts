import { Dispatch } from 'redux';

import { errorEnumAT } from '../actionType.model';

export const setError = (error: string | null) => {
    return (dispatch: Dispatch) => {
        dispatch({
            type: errorEnumAT.SET_ERROR,
            payload: error,
        });
    };
};
