"use client";

import {
    useEffect,
    useState
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
    fetchLivePrice,
    refreshDynamicPrice,
    createPriceFreeze,
    setLivePriceRealtime
} from "@/store/pricingSlice";

import {
    createPriceStream
} from "@/api/pricing";

interface Props {

    entityId: string;

    entityType: string;

    userId?: string;
}

export default function DynamicPriceCard({

    entityId,

    entityType,

    userId

}: Props) {

    const dispatch =
        useDispatch<AppDispatch>();

    const {
        livePrice,
        loading
    } = useSelector(
        (state: RootState) =>
            state.pricing
    );

    const [freezeLoading,
        setFreezeLoading] =
        useState(false);

    

    useEffect(() => {

        dispatch(
            fetchLivePrice({
                entityType,
                entityId
            })
        );

    }, [
        dispatch,
        entityType,
        entityId
    ]);

   

    useEffect(() => {

        const stream =
            createPriceStream(
                entityType,
                entityId,

                (data) => {

                    dispatch(
                        setLivePriceRealtime(data)
                    );
                }
            );

        return () => {

            stream.close();
        };

    }, [
        dispatch,
        entityType,
        entityId
    ]);

   

    const handleRefreshPrice =
        async () => {

            dispatch(
                refreshDynamicPrice({
                    entityType,
                    entityId
                })
            );
        };



    const handleFreezePrice =
        async () => {

            if (!userId) {

                alert(
                    "Please login first"
                );

                return;
            }

            try {

                setFreezeLoading(true);

                await dispatch(
                    createPriceFreeze({
                        userId,
                        entityId,
                        entityType,
                        freezeMinutes: 15
                    })
                );

                alert(
                    "Price frozen for 15 minutes"
                );

            } catch (error) {

                console.log(error);

            } finally {

                setFreezeLoading(false);
            }
        };

 

    return (

        <div className=" w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-md  ">

            {/* TITLE */}

            <div
                className="
                flex
                items-center
                justify-between
                mb-4
            "
            >

                <h2
                    className="
                    text-xl
                    font-bold
                    text-gray-800
                "
                >
                    Live Dynamic Pricing
                </h2>

                <button
                    onClick={
                        handleRefreshPrice
                    }
                    className="
                    rounded-lg
                    bg-black
                    px-4
                    py-2
                    text-sm
                    text-white
                    hover:opacity-90
                "
                >
                    Refresh
                </button>
            </div>

            {/* LOADING */}

            {
                loading && (

                    <p
                        className="
                        text-sm
                        text-gray-500
                    "
                    >
                        Updating live price...
                    </p>
                )
            }

            {/* PRICE */}

            {
                livePrice && (

                    <div
                        className="
                        space-y-3
                    "
                    >

                        <div>

                            <p
                                className="
                                text-sm
                                text-gray-500
                            "
                            >
                                Current Price
                            </p>

                            <h1
                                className="
                                text-4xl
                                font-bold
                                text-green-600
                            "
                            >
                                ₹
                                {
                                    livePrice.currentPrice
                                }
                            </h1>
                        </div>

                        {/* ORIGINAL */}

                        <div
                            className="
                            flex
                            items-center
                            gap-3
                        "
                        >

                            <p
                                className="
                                text-sm
                                text-gray-500
                            "
                            >
                                Base Price:
                            </p>

                            <span
                                className="
                                text-gray-700
                                font-medium
                            "
                            >
                                ₹
                                {
                                    livePrice.basePrice
                                }
                            </span>
                        </div>

                        {/* SURGE */}

                        <div
                            className="
                            flex
                            items-center
                            gap-3
                        "
                        >

                            <p
                                className="
                                text-sm
                                text-gray-500
                            "
                            >
                                Surge Multiplier:
                            </p>

                            <span
                                className="
                                font-semibold
                                text-orange-500
                            "
                            >
                                x
                                {
                                    livePrice
                                        .surgeMultiplier
                                }
                            </span>
                        </div>

                        {/* DEMAND */}

                        <div
                            className="
                            flex
                            items-center
                            gap-3
                        "
                        >

                            <p
                                className="
                                text-sm
                                text-gray-500
                            "
                            >
                                Demand Level:
                            </p>

                            <span
                                className="
                                rounded-full
                                bg-red-100
                                px-3
                                py-1
                                text-xs
                                font-semibold
                                text-red-600
                            "
                            >
                                {
                                    livePrice
                                        .demandLevel
                                }
                            </span>
                        </div>

                        {/* LAST UPDATED */}

                        <div>

                            <p
                                className="
                                text-xs
                                text-gray-400
                            "
                            >
                                Last Updated:
                            </p>

                            <span
                                className="
                                text-xs
                                text-gray-500
                            "
                            >
                                {
                                    livePrice.updatedAt
                                }
                            </span>
                        </div>

                        {/* FREEZE BUTTON */}

                        <button
                            onClick={
                                handleFreezePrice
                            }
                            disabled={
                                freezeLoading
                            }
                            className="
                            mt-4
                            w-full
                            rounded-xl
                            bg-blue-600
                            px-4
                            py-3
                            text-white
                            font-semibold
                            hover:bg-blue-700
                            transition
                        "
                        >
                            {
                                freezeLoading
                                    ? "Freezing Price..."
                                    : "Freeze Price For 15 Minutes"
                            }
                        </button>
                    </div>
                )
            }
        </div>
    );
}