import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import axios from "axios";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8081";


interface BackendPreference {
  id?: string;
  userId: string;
  flightSeatPref?: string;
  hotelRoomPref?: string;
}



export interface SeatPreference {
  id: string;

  type:
  | "ECONOMY"
  | "PREMIUM"
  | "BUSINESS";

  seatCategory:
  | "WINDOW"
  | "AISLE"
  | "MIDDLE";
}



export interface RoomPreference {

  id: string;

  type:
  | "STANDARD"
  | "DELUXE"
  | "SUITE";

  price: number;
}



export interface UserPreferences {

  id?: string;

  userId: string;

  seatPreference?: SeatPreference;

  roomPreference?: RoomPreference;
}



interface PreferencesState {

  seatPreference?: SeatPreference;

  roomPreference?: RoomPreference;

  loading: boolean;

  error?: string;
}

const initialState: PreferencesState = {

  seatPreference: undefined,

  roomPreference: undefined,

  loading: false,

  error: undefined,
};



const parseSeatPreference = (
  seatPref?: string
): SeatPreference | undefined => {

  if (!seatPref) return undefined;

  try {

    return JSON.parse(seatPref);

  } catch (error) {

    console.error(
      "Invalid seat preference JSON:",
      error
    );

    return undefined;
  }
};

const parseRoomPreference = (
  roomPref?: string
): RoomPreference | undefined => {

  if (!roomPref) return undefined;

  try {

    return JSON.parse(roomPref);

  } catch (error) {

    console.error(
      "Invalid room preference JSON:",
      error
    );

    return undefined;
  }
};



export const fetchPreferences =
  createAsyncThunk<
    UserPreferences | null,
    string
  >(
    "preferences/fetch",

    async (
      userId,
      { rejectWithValue }
    ) => {

      try {

        
        const res = await axios.get<BackendPreference[]>(
          `${BACKEND_URL}/api/preferences/${userId}`
        );
        const data = res.data;

        if (
          !data ||
          data.length === 0
        ) {

          return null;
        }

        return {

          id: data[0]?.id,

          userId:
            data[0]?.userId,

          seatPreference:
            parseSeatPreference(
              data[0]
                ?.flightSeatPref
            ),

          roomPreference:
            parseRoomPreference(
              data[0]
                ?.hotelRoomPref
            ),
        };

      } catch (err: any) {

        return rejectWithValue(

          err?.response?.data
            ?.message ||

          err?.message ||

          "Failed to fetch preferences"
        );
      }
    }
  );



export const savePreferences =
  createAsyncThunk<
    UserPreferences,
    UserPreferences
  >(
    "preferences/save",

    async (
      payload,
      { rejectWithValue }
    ) => {

      try {

        const res = await axios.post<BackendPreference>(
          `${BACKEND_URL}/api/preferences`,

          {
            userId:
              payload.userId,

            flightSeatPref:
              payload.seatPreference
                ? JSON.stringify(
                  payload.seatPreference
                )
                : null,

            hotelRoomPref:
              payload.roomPreference
                ? JSON.stringify(
                  payload.roomPreference
                )
                : null,
          }
        );

        return {

          id: res.data?.id,

          userId:
            res.data?.userId,

          seatPreference:
            parseSeatPreference(
              res.data
                ?.flightSeatPref
            ),

          roomPreference:
            parseRoomPreference(
              res.data
                ?.hotelRoomPref
            ),
        };

      } catch (err: any) {

        return rejectWithValue(

          err?.response?.data
            ?.message ||

          err?.message ||

          "Failed to save preferences"
        );
      }
    }
  );



const preferencesSlice =
  createSlice({

    name: "preferences",

    initialState,

    reducers: {



      saveSeatPreference: (

        state,

        action:
          PayloadAction<SeatPreference>

      ) => {

        state.seatPreference =
          action.payload;
      },



      saveRoomPreference: (

        state,

        action:
          PayloadAction<RoomPreference>

      ) => {

        state.roomPreference =
          action.payload;
      },



      clearPreferences: (
        state
      ) => {

        state.seatPreference =
          undefined;

        state.roomPreference =
          undefined;

        state.error =
          undefined;
      },
    },



    extraReducers: (
      builder
    ) => {

      builder


        .addCase(
          fetchPreferences.pending,

          (state) => {

            state.loading = true;

            state.error =
              undefined;
          }
        )

        .addCase(
          fetchPreferences.fulfilled,

          (
            state,
            action
          ) => {

            state.loading =
              false;

            if (
              action.payload
            ) {

              state.seatPreference =
                action.payload
                  .seatPreference;

              state.roomPreference =
                action.payload
                  .roomPreference;
            }
          }
        )

        .addCase(
          fetchPreferences.rejected,

          (
            state,
            action
          ) => {

            state.loading =
              false;

            state.error =
              action.payload as string;
          }
        )



        .addCase(
          savePreferences.pending,

          (state) => {

            state.loading = true;

            state.error =
              undefined;
          }
        )

        .addCase(
          savePreferences.fulfilled,

          (
            state,
            action
          ) => {

            state.loading =
              false;

            state.seatPreference =
              action.payload
                .seatPreference;

            state.roomPreference =
              action.payload
                .roomPreference;
          }
        )

        .addCase(
          savePreferences.rejected,

          (
            state,
            action
          ) => {

            state.loading =
              false;

            state.error =
              action.payload as string;
          }
        );
    },
  });


export const {

  saveSeatPreference,

  saveRoomPreference,

  clearPreferences,

} = preferencesSlice.actions;

export default preferencesSlice.reducer;
