import * as actions from '../actions/request.actions';

const initialState = {
  queue: [],
  currentAction: {},
};

export default function requestReducer(state = initialState, action) {
  let newState = {
    ...state,
    currentAction: {},
  };
  let queue = newState.queue.slice(0); // clone array before modifying it
  const actionToModify = action.payload;
  switch (action.type) {
    case actions.REQUEST:
      // Queue all requests
      if (actionToModify.data.method === 'POST' && actionToModify.action.includes('SAVE')) {
        // Map only POST requests
        let jsonBody = JSON.parse(actionToModify.data.body);
        const jsonBodyId = jsonBody.ID;
        if (Object.prototype.hasOwnProperty.call(action.payload, 'isConnected')) {
          const { isConnected } = actionToModify;
          delete actionToModify.isConnected;
          if (isConnected) {
            // delete jsonBody.ID;
            // Phone its in ONLINE mode
            if (jsonBodyId) {
              /* eslint-disable */
              if (isNaN(jsonBodyId)) {
                /* eslint-enable */
                // ONLINE POST (Existing autogenerated ID) Merge request in queue and process it
                // If entity has ID, search it in queue, if exist, merge it
                const requestIndex = queue.findIndex(request => request.data.method === 'POST' && JSON.parse(request.data.body).ID && JSON.parse(request.data.body).ID === jsonBodyId);
                if (requestIndex > -1) {
                  queue[requestIndex] = actionToModify;
                  newState = {
                    ...newState,
                    queue: [...queue],
                    currentAction: actionToModify,
                  };
                  return newState;
                }
              }
            }
          } else if (jsonBodyId) {
            // OFFLINE PUT ( Numeric ID / Existing entity or Autogenerated ID / New entity ) search it in queue and merge it (if exist)
            const requestIndex = queue.findIndex((request) => {
              if (actionToModify.url === request.url) {
                const jsonParseBody = JSON.parse(request.data.body);
                if (jsonParseBody.ID) {
                  return (jsonParseBody.ID === jsonBodyId);
                }
                return false;
              }
              return false;
            });
            if (requestIndex > -1) {
              let requestFromQueue = queue[requestIndex];
              requestFromQueue = {
                ...actionToModify,
              };
              // Do merge of old request body with new request body
              const oldRequestBody = JSON.parse(requestFromQueue.data.body);
              const newRequestBody = {
                ...oldRequestBody,
                ...jsonBody,
              };
              requestFromQueue.data.body = JSON.stringify(newRequestBody);
              queue[requestIndex] = requestFromQueue;
              newState = {
                ...newState,
                queue: [...queue],
                currentAction: requestFromQueue,
              };
              return newState;
            }
          } else {
            // OFFLINE POST (New entity, add autogenerated ID)
            let existingIdInQueue; let
              newID;
            do {
              // Generate ID
              /* eslint-disable */
               newID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                 const r = Math.random() * 16 | 0;
                 const v = c === 'x' ? r : ((r && 0x3) | 0x8);
                 return v.toString(16);
               });
              // Check if generated ID exist in queue
              existingIdInQueue = queue.findIndex(request => (request.data.method === 'POST' && JSON.parse(request.data.body).ID && JSON.parse(request.data.body).ID === newID));
              /* eslint-enable */
              // If ID exist, generate another one
            } while (existingIdInQueue > -1);
            // if not, use it
            jsonBody = {
              ...jsonBody,
              ID: newID,
            };
          }
        }
        actionToModify.data.body = JSON.stringify(jsonBody);
      } else if (actionToModify.data.method === 'GET') {
        // filter out redundant GET requests
        queue = queue.filter(existing => existing.url !== actionToModify.url);
      }
      newState = {
        ...newState,
        queue: [...queue, actionToModify],
        currentAction: actionToModify,
      };
      return newState;
    case actions.RESPONSE:
      // loop through every item in local storage and filter out the successful request
      queue = queue.filter(request => JSON.stringify(request) !== JSON.stringify(action.payload));
      newState = {
        ...newState,
        queue,
      };
      return newState;
    default:
      return newState;
  }
}
