
"use client";

import {
    useEffect
} from "react";

import {
    useDispatch,
    useSelector
} from "react-redux";

import {
    RootState,
    AppDispatch
} from "@/store";

import {
    fetchUserFreezes,
    fetchActiveFreezes,
    removeFreeze
} from "@/store/pricingSlice";

interface Props {

    entityType: string;

    entityId: string;

    userId: string;
}
export default function PriceFreezePanel({

    entityType,
    entityId,
    userId

}: Props){

    const dispatch =
        useDispatch<AppDispatch>();

    const {
        freezes,
        activeFreezes,
        loading
    } = useSelector(
        (state: RootState) =>
            state.pricing
    );

   

    useEffect(() => {

        if (!userId) {
            return;
        }

        dispatch(
            fetchUserFreezes(userId)
        );

        dispatch(
            fetchActiveFreezes(userId)
        );

    }, [
        dispatch,
        userId
    ]);



    const handleCancelFreeze =
        async (freezeId: string) => {

            try {

                await dispatch(
                    removeFreeze(freezeId)
                );

                dispatch(
                    fetchUserFreezes(userId)
                );

                dispatch(
                    fetchActiveFreezes(userId)
                );

            } catch (error) {

                console.log(error);
            }
        };

    

    const formatDate = (
        value: string
    ) => {

        return new Date(value)
            .toLocaleString();
    };

    

    return (

        <div
            className="
            w-full
            space-y-6
        "
        >

            {/* ACTIVE FREEZES */}

            <div
                className="
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-5
                shadow-md
            "
            >

                <div
                    className="
                    mb-5
                    flex
                    items-center
                    justify-between
                "
                >

                    <h2
                        className="
                        text-xl
                        font-bold
                        text-gray-800
                    "
                    >
                        Active Price Freezes
                    </h2>

                    <span
                        className="
                        rounded-full
                        bg-blue-100
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        text-blue-700
                    "
                    >
                        {
                            activeFreezes.length
                        }
                        Active
                    </span>
                </div>

                {
                    loading && (

                        <p
                            className="
                            text-sm
                            text-gray-500
                        "
                        >
                            Loading freezes...
                        </p>
                    )
                }

                {
                    !loading
                    &&
                    activeFreezes.length === 0
                    &&
                    (

                        <p
                            className="
                            text-sm
                            text-gray-500
                        "
                        >
                            No active frozen prices
                        </p>
                    )
                }

                <div
                    className="
                    space-y-4
                "
                >

                    {
                        activeFreezes.map(
                            (freeze: any) => (

                                <div
                                    key={freeze.id}
                                    className="
                                    rounded-xl
                                    border
                                    border-gray-100
                                    bg-gray-50
                                    p-4
                                "
                                >

                                    <div
                                        className="
                                        flex
                                        items-center
                                        justify-between
                                    "
                                    >

                                        <div>

                                            <h3
                                                className="
                                                text-lg
                                                font-semibold
                                                text-gray-800
                                            "
                                            >
                                                {
                                                    freeze.entityType
                                                }
                                            </h3>

                                            <p
                                                className="
                                                text-sm
                                                text-gray-500
                                            "
                                            >
                                                ID:
                                                {
                                                    freeze.entityId
                                                }
                                            </p>
                                        </div>

                                        <div
                                            className="
                                            text-right
                                        "
                                        >

                                            <h2
                                                className="
                                                text-2xl
                                                font-bold
                                                text-green-600
                                            "
                                            >
                                                ₹
                                                {
                                                    freeze.lockedPrice
                                                }
                                            </h2>

                                            <span
                                                className="
                                                rounded-full
                                                bg-green-100
                                                px-3
                                                py-1
                                                text-xs
                                                font-semibold
                                                text-green-700
                                            "
                                            >
                                                ACTIVE
                                            </span>
                                        </div>
                                    </div>

                                    <div
                                        className="
                                        mt-4
                                        flex
                                        items-center
                                        justify-between
                                    "
                                    >

                                        <div
                                            className="
                                            space-y-1
                                            text-sm
                                            text-gray-500
                                        "
                                        >

                                            <p>
                                                Created:
                                                {
                                                    formatDate(
                                                        freeze.createdAt
                                                    )
                                                }
                                            </p>

                                            <p>
                                                Expires:
                                                {
                                                    formatDate(
                                                        freeze.expiryTime
                                                    )
                                                }
                                            </p>
                                        </div>

                                        <button
                                            onClick={() =>
                                                handleCancelFreeze(
                                                    freeze.id
                                                )
                                            }
                                            className="
                                            rounded-lg
                                            bg-red-500
                                            px-4
                                            py-2
                                            text-sm
                                            font-medium
                                            text-white
                                            hover:bg-red-600
                                        "
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )
                        )
                    }
                </div>
            </div>

            {/* ALL FREEZES */}

            <div
                className="
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-5
                shadow-md
            "
            >

                <div
                    className="
                    mb-5
                    flex
                    items-center
                    justify-between
                "
                >

                    <h2
                        className="
                        text-xl
                        font-bold
                        text-gray-800
                    "
                    >
                        Freeze History
                    </h2>

                    <span
                        className="
                        rounded-full
                        bg-gray-100
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        text-gray-700
                    "
                    >
                        {
                            freezes.length
                        }
                        Total
                    </span>
                </div>

                {
                    freezes.length === 0
                    &&
                    (

                        <p
                            className="
                            text-sm
                            text-gray-500
                        "
                        >
                            No freeze history available
                        </p>
                    )
                }

                <div
                    className="
                    space-y-3
                "
                >

                    {
                        freezes.map(
                            (freeze: any) => (

                                <div
                                    key={freeze.id}
                                    className="
                                    flex
                                    items-center
                                    justify-between
                                    rounded-xl
                                    border
                                    border-gray-100
                                    p-4
                                "
                                >

                                    <div>

                                        <h3
                                            className="
                                            font-semibold
                                            text-gray-800
                                        "
                                        >
                                            {
                                                freeze.entityType
                                            }
                                        </h3>

                                        <p
                                            className="
                                            text-sm
                                            text-gray-500
                                        "
                                        >
                                            {
                                                freeze.entityId
                                            }
                                        </p>
                                    </div>

                                    <div
                                        className="
                                        text-right
                                    "
                                    >

                                        <p
                                            className="
                                            font-bold
                                            text-green-600
                                        "
                                        >
                                            ₹
                                            {
                                                freeze.lockedPrice
                                            }
                                        </p>

                                        <span
                                            className={`
                                            rounded-full
                                            px-3
                                            py-1
                                            text-xs
                                            font-semibold

                                            ${
                                                freeze.status ===
                                                "ACTIVE"

                                                    ? "bg-green-100 text-green-700"

                                                    : freeze.status ===
                                                      "USED"

                                                    ? "bg-blue-100 text-blue-700"

                                                    : "bg-red-100 text-red-700"
                                            }
                                        `}
                                        >
                                            {
                                                freeze.status
                                            }
                                        </span>
                                    </div>
                                </div>
                            )
                        )
                    }
                </div>
            </div>
        </div>
    );
}