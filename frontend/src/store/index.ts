import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import refundReducer from "./refundSlice";
import reviewReducer from "./reviewSlice";
import preferencesReducer from "./preferencesSlice";
import pricingReducer from "./pricingSlice";


import recommendationReducer from "./recommendationSlice";


export const store = configureStore({
    reducer: {
        user: userReducer,
        refund: refundReducer,
        reviews: reviewReducer,
        preferences: preferencesReducer,
        pricing: pricingReducer,
        
        recommendations: recommendationReducer,
    }
});


export type RootState =
    ReturnType<typeof store.getState>;

export type AppDispatch =
    typeof store.dispatch;

export default store;

