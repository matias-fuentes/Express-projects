import { isEditingEnumAT, StateAction } from '../actionType.model';

interface isEditingAction {
    type: string;
    payload: StateAction;
}

let initialState: StateAction = null;

const isEditingReducer = (state: StateAction = initialState, action: isEditingAction) => {
    if (action.type === isEditingEnumAT.IS_EDITING || action.type === isEditingEnumAT.IS_NOT_EDITING) {
        return action.payload;
    } else {
        return state;
    }
};

export default isEditingReducer;
