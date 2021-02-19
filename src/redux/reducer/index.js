/**
 * reducer
 * 根据action来对state进行操作
 */
let initialBreadList = []
try {
    if (localStorage.breadcrumb) {
        initialBreadList = JSON.parse(localStorage.breadcrumb)
    }
  } catch (e) {}

const initialState = {
    breadList: initialBreadList
  }

export default (state = initialState, action) => {
    if (action.type === 'changeBreadList') {
        let initState = JSON.parse(JSON.stringify(state))
        initState.breadList = action.breadList
        localStorage.setItem('breadcrumb', JSON.stringify(action.breadList))
        return initState;
    }
    return state;
}