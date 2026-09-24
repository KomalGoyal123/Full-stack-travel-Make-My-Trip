import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  fetchPreferences,
  savePreferences,
  clearPreferences,
} from "@/store/preferencesSlice";
import { Button } from "@/components/ui/button";

interface PreferencesProps {
  userId: string;
}

const Preferences: React.FC<PreferencesProps> = ({ userId }) => {

  const dispatch = useDispatch<AppDispatch>();

  const { seatPreference, roomPreference, loading, error } =
    useSelector((state: RootState) => state.preferences);


  useEffect(() => {
    if (userId) {
      dispatch(fetchPreferences(userId));
    }
  }, [dispatch, userId]);


  const handleSaveSeat = () => {
    if (!seatPreference) return;

    dispatch(
      savePreferences({
        userId,
        seatPreference,
        roomPreference,
      })
    );
  };


  const handleSaveRoom = () => {
    if (!roomPreference) return;

    dispatch(
      savePreferences({
        userId,
        seatPreference,
        roomPreference,
      })
    );
  };


  const handleClear = () => {
    dispatch(clearPreferences());
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">
        User Preferences
      </h2>


      {loading && (
        <p className="text-gray-500">
          Loading preferences...
        </p>
      )}

      {error && (
        <p className="text-red-500">
          Error: {error}
        </p>
      )}

      <div className="space-y-4">

        {/* ✅ Seat Preference */}
        <div className="border rounded-lg p-4">
          <p className="text-gray-700 font-semibold mb-2">
            Seat Preference
          </p>

          {seatPreference ? (
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <strong>Seat Type:</strong>{" "}
                {seatPreference.type}
              </p>

              <p>
                <strong>Seat Category:</strong>{" "}
                {seatPreference.seatCategory}
              </p>

              <p>
                <strong>Seat ID:</strong>{" "}
                {seatPreference.id}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">
              Not set
            </p>
          )}

          <Button
            className="mt-3 bg-blue-600 text-white"
            onClick={handleSaveSeat}
            disabled={!seatPreference || loading}
          >
            Save Seat Preference
          </Button>
        </div>

        {/* ✅ Room Preference */}
        <div className="border rounded-lg p-4">
          <p className="text-gray-700 font-semibold mb-2">
            Room Preference
          </p>

          <p className="text-sm text-gray-600">
            {roomPreference ? (
              <>
                <strong>Room Type:</strong> {roomPreference.type}
                {" • "}
                <strong>Price:</strong> ₹{roomPreference.price}
                {" • "}
                <strong>ID:</strong> {roomPreference.id}
              </>
            ) : (
              "Not set"
            )}
          </p>

          <Button
            className="mt-3 bg-purple-600 text-white"
            onClick={handleSaveRoom}
            disabled={!roomPreference || loading}
          >
            Save Room Preference
          </Button>
        </div>

        {/* ✅ Clear */}
        <Button
          className="mt-4 bg-red-600 text-white"
          onClick={handleClear}
          disabled={loading}
        >
          Clear Preferences
        </Button>
      </div>
    </div>
  );
};

export default Preferences;


