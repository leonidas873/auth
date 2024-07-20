import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Correct import

const persistConfig = {
    key: 'root',
    storage
}

const persistedUserReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
    reducer: {
        user: persistedUserReducer
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
            }
        }) 
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
