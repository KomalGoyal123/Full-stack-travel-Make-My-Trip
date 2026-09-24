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
    fetchLivePrice,
    setLivePriceRealtime
} from "@/store/pricingSlice";

import {
    createPriceStream
} from "@/api/pricing";

interface Props {

    entityId: string;

    entityType: string;
}

export default function LivePriceBar({

    entityId,

    entityType

}: Props) {

    const dispatch =
        useDispatch<AppDispatch>();

    const {
        livePrice
    } = useSelector(
        (state: RootState) =>
            state.pricing
    );

    

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

    let stream: EventSource | null = null;

    stream = createPriceStream(
        entityType,
        entityId,

        (data) => {

            dispatch(
                setLivePriceRealtime(data)
            );
        }
    );

    stream.onerror = () => {

        console.log("SSE connection closed");

        stream?.close();
    };

    return () => {

        if (stream) {
            stream.close();
        }
    };

}, [
    dispatch,
    entityType,
    entityId
]);

 

    return (

        <div
            className="
            w-full
            overflow-hidden
            rounded-xl
            border
            border-green-200
            bg-gradient-to-r
            from-green-50
            to-emerald-100
            p-4
            shadow-sm
        "
        >

            <div
                className="
                flex
                items-center
                justify-between
                gap-4
            "
            >

                {/* LIVE BADGE */}

                <div
                    className="
                    flex
                    items-center
                    gap-2
                "
                >

                    <div
                        className="
                        h-3
                        w-3
                        animate-pulse
                        rounded-full
                        bg-green-500
                    "
                    />

                    <span
                        className="
                        text-sm
                        font-bold
                        uppercase
                        tracking-wide
                        text-green-700
                    "
                    >
                        Live Pricing
                    </span>
                </div>

                {/* PRICE */}

                <div
                    className="
                    flex
                    items-center
                    gap-4
                "
                >

                    <div
                        className="
                        text-right
                    "
                    >

                        <p
                            className="
                            text-xs
                            text-gray-500
                        "
                        >
                            Current Price
                        </p>

                        <h2
                            className="
                            text-3xl
                            font-bold
                            text-green-700
                        "
                        >
                            ₹
                            {
                                livePrice?.currentPrice
                            }
                        </h2>
                    </div>

                    {/* TREND */}

                    <div
                        className="
                        rounded-full
                        bg-white
                        px-4
                        py-2
                        shadow-sm
                    "
                    >

                        <p
                            className="
                            text-xs
                            text-gray-500
                        "
                        >
                            Surge
                        </p>

                        <span
                            className="
                            text-sm
                            font-bold
                            text-orange-600
                        "
                        >
                            x
                            {
                                livePrice
                                    ?.surgeMultiplier
                            }
                        </span>
                    </div>
                </div>
            </div>

            {/* DEMAND */}

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
                    flex
                    items-center
                    gap-2
                "
                >

                    <span
                        className="
                        text-sm
                        text-gray-600
                    "
                    >
                        Demand:
                    </span>

                    <span
                        className="
                        rounded-full
                        bg-red-100
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        text-red-700
                    "
                    >
                        {
                            livePrice
                                ?.demandLevel
                        }
                    </span>
                </div>

                <p
                    className="
                    text-xs
                    text-gray-500
                "
                >
                    Prices update automatically
                </p>
            </div>
        </div>
    );
}