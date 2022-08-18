export enum isLoadingType {
    IS_NOT_LOADING = 'isNotLoading',
}

let initialState = true;

const isLoadingReducer = (state: boolean = initialState, action: { type: string }) => {
    if (action.type === isLoadingType.IS_NOT_LOADING) {
        return false;
    } else {
        return state;
    }
};

export default isLoadingReducer;
