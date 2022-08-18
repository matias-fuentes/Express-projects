import { errorEnumAT } from '../actionType.model';

type errorType = string | null;

const errorReducer = (state: errorType = null, action: { type: string; payload: errorType }) => {
    if (action.type === errorEnumAT.SET_ERROR) {
        return action.payload;
    } else {
        return state;
    }
};

export default errorReducer;
