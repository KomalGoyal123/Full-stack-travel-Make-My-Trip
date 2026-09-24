import axios from "axios";

// const BASE_URL = "http://localhost:8081/pricing";

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8081"}/pricing`;


export const getLivePrice = async (
    entityType: string,
    entityId: string
): Promise<any> => {

    const response = await axios.get(
        `${BASE_URL}/live/${entityType}/${entityId}`
    );

    return response.data;
};



export const updateDynamicPrice = async (
    entityType: string,
    entityId: string
): Promise<any> => {

    const response = await axios.post(
        `${BASE_URL}/update/${entityType}/${entityId}`
    );

    return response.data;
};



export const getPriceHistory = async (
    entityId: string
): Promise<any[]> => {

    const response = await axios.get<any[]>(
        `${BASE_URL}/history/${entityId}`
    );

    return response.data;
};



export const getPriceTrend = async (
    entityId: string
): Promise<any> => {

    const response = await axios.get(
        `${BASE_URL}/trend/${entityId}`
    );

    return response.data;
};



export const freezePrice = async (
    userId: string,
    entityId: string,
    entityType: string,
    freezeMinutes: number
): Promise<any> => {

    const response = await axios.post(
        `${BASE_URL}/freeze`,
        {
            userId,
            entityId,
            entityType,
            freezeMinutes
        }
    );

    return response.data;
};



export const getUserFreezes = async (
    userId: string
): Promise<any[]> => {

    const response = await axios.get<any[]>(
        `${BASE_URL}/freeze/user/${userId}`
    );

    return response.data;
};


export const getActiveFreezes = async (
    userId: string
): Promise<any[]> => {

    const response = await axios.get<any[]>(
        `${BASE_URL}/freeze/active/${userId}`
    );

    return response.data;
};


export const cancelFreeze = async (
    freezeId: string
): Promise<any> => {

    const response = await axios.put(
        `${BASE_URL}/freeze/cancel/${freezeId}`
    );

    return response.data;
};



export const createPriceStream = (
    entityType: string,
    entityId: string,
    onMessage: (data: any) => void
) => {

    const eventSource = new EventSource(
        `${BASE_URL}/stream/${entityType}/${entityId}`
    );

    eventSource.onmessage = (event) => {

        const parsedData =
            JSON.parse(event.data);

        onMessage(parsedData);
    };

    eventSource.onerror = () => {

        eventSource.close();
    };

    return eventSource;
};
