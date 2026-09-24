import {
    createAsyncThunk,
    createSlice,
    PayloadAction
} from "@reduxjs/toolkit";

import {
    getLivePrice,
    getPriceHistory,
    getPriceTrend,
    freezePrice,
    getUserFreezes,
    getActiveFreezes,
    cancelFreeze,
    updateDynamicPrice
} from "@/api/pricing";



interface PricingState {

    livePrice: any;

    priceHistory: any[];

    priceTrend: any;

    freezes: any[];

    activeFreezes: any[];

    loading: boolean;

    error: string | null;
}



const initialState: PricingState = {

    livePrice: null,

    priceHistory: [],

    priceTrend: null,

    freezes: [],

    activeFreezes: [],

    loading: false,

    error: null
};



export const fetchLivePrice =
    createAsyncThunk<any, {
        entityType: string;
        entityId: string;
    }>(
        "pricing/fetchLivePrice",

        async ({
                   entityType,
                   entityId
               }) => {

            return await getLivePrice(
                entityType,
                entityId
            );
        }
    );



export const refreshDynamicPrice =
    createAsyncThunk<any, {
        entityType: string;
        entityId: string;
    }>(
        "pricing/refreshDynamicPrice",

        async ({
                   entityType,
                   entityId
               }) => {

            return await updateDynamicPrice(
                entityType,
                entityId
            );
        }
    );



export const fetchPriceHistory =
    createAsyncThunk<any[], string>(
        "pricing/fetchPriceHistory",

        async (entityId) => {

            const data =
                await getPriceHistory(
                    entityId
                );

            return data as any[];
        }
    );



export const fetchPriceTrend =
    createAsyncThunk<any, string>(
        "pricing/fetchPriceTrend",

        async (entityId) => {

            return await getPriceTrend(
                entityId
            );
        }
    );



export const createPriceFreeze =
    createAsyncThunk<any, {
        userId: string;
        entityId: string;
        entityType: string;
        freezeMinutes: number;
    }>(
        "pricing/createPriceFreeze",

        async ({
                   userId,
                   entityId,
                   entityType,
                   freezeMinutes
               }) => {

            return await freezePrice(
                userId,
                entityId,
                entityType,
                freezeMinutes
            );
        }
    );



export const fetchUserFreezes =
    createAsyncThunk<any[], string>(
        "pricing/fetchUserFreezes",

        async (userId) => {

            const data =
                await getUserFreezes(
                    userId
                );

            return data as any[];
        }
    );


export const fetchActiveFreezes =
    createAsyncThunk<any[], string>(
        "pricing/fetchActiveFreezes",

        async (userId) => {

            const data =
                await getActiveFreezes(
                    userId
                );

            return data as any[];
        }
    );



export const removeFreeze =
    createAsyncThunk<any, string>(
        "pricing/removeFreeze",

        async (freezeId) => {

            return await cancelFreeze(
                freezeId
            );
        }
    );


const pricingSlice = createSlice({

    name: "pricing",

    initialState,

    reducers: {

        setLivePriceRealtime: (
            state,
            action: PayloadAction<any>
        ) => {

            state.livePrice =
                action.payload;
        },

        clearPricingError: (
            state
        ) => {

            state.error = null;
        }
    },

    extraReducers: (builder) => {

      

        builder.addCase(
            fetchLivePrice.pending,

            (state) => {

                state.loading = true;
            }
        );

        builder.addCase(
            fetchLivePrice.fulfilled,

            (
                state,
                action: PayloadAction<any>
            ) => {

                state.loading = false;

                state.livePrice =
                    action.payload;
            }
        );

        builder.addCase(
            fetchLivePrice.rejected,

            (
                state,
                action
            ) => {

                state.loading = false;

                state.error =
                    action.error.message || null;
            }
        );

      

        builder.addCase(
            refreshDynamicPrice.fulfilled,

            (
                state,
                action: PayloadAction<any>
            ) => {

                state.livePrice =
                    action.payload;
            }
        );

   

        builder.addCase(
            fetchPriceHistory.fulfilled,

            (
                state,
                action: PayloadAction<any[]>
            ) => {

                state.priceHistory =
                    action.payload;
            }
        );


        builder.addCase(
            fetchPriceTrend.fulfilled,

            (
                state,
                action: PayloadAction<any>
            ) => {

                state.priceTrend =
                    action.payload;
            }
        );

       

        builder.addCase(
            createPriceFreeze.fulfilled,

            (
                state,
                action: PayloadAction<any>
            ) => {

                state.freezes.push(
                    action.payload
                );

                state.activeFreezes.push(
                    action.payload
                );
            }
        );

     

        builder.addCase(
            fetchUserFreezes.fulfilled,

            (
                state,
                action: PayloadAction<any[]>
            ) => {

                state.freezes =
                    action.payload;
            }
        );

       

        builder.addCase(
            fetchActiveFreezes.fulfilled,

            (
                state,
                action: PayloadAction<any[]>
            ) => {

                state.activeFreezes =
                    action.payload;
            }
        );

     

        builder.addCase(
            removeFreeze.fulfilled,

            (
                state,
                action: PayloadAction<any>
            ) => {

                state.freezes =
                    state.freezes.map(
                        (freeze: any) => {

                            if (
                                freeze.id ===
                                action.payload.id
                            ) {

                                return action.payload;
                            }

                            return freeze;
                        }
                    );

                state.activeFreezes =
                    state.activeFreezes.filter(
                        (freeze: any) =>
                            freeze.id !==
                            action.payload.id
                    );
            }
        );
    }
});



export const {
    setLivePriceRealtime,
    clearPricingError
} = pricingSlice.actions;

export default pricingSlice.reducer;