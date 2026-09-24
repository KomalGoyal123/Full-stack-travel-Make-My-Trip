import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { gethotel } from "@/api";
import Loader from "../Loader";

import LivePriceTicker from "@/components/Pricing/LivePriceTicker";

const HotelList = ({ onSelect }: any) => {
  const [hotel, sethotel] = useState<any[]>([]);
  const [loading, setloading] = useState(true);
  useEffect(() => {
    const fetchhotel = async () => {
      try {
        const data = await gethotel();
        sethotel(data);
      } catch (error) {
        console.error(error);
      } finally {
        setloading(false);
      }
    };
    fetchhotel();
  }, []);

  if (loading) {
    return <Loader />;
  }
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Hotel List</h3>
     
      {hotel.length === 0 && !loading && (
        <p className="text-red-500">Failed to load hotels</p>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Hotel Name</TableHead>
            <TableHead>Location</TableHead>
            
            <TableHead>Base Price</TableHead>
            <TableHead>Live Room Pricing</TableHead>
            <TableHead>Action</TableHead>

          </TableRow>
        </TableHeader>
        <TableBody>
          {hotel.length > 0 ? (
            hotel.map((hotel: any, index: number) => (
              <TableRow key={hotel._id || hotel.id || index}>
                <TableCell>{hotel.hotelName}</TableCell>
                <TableCell>{hotel.location}</TableCell>
                

                <TableCell>
                  <div>
                     ₹ {hotel.pricePerNight}
                  </div>
                 
               </TableCell>

                <TableCell>
                  <div className="flex flex-col gap-2 ">

                    <div className="bg-blue-100 text-blue-700 border border-blue-300 px-2 py-1 rounded-md text-xs font-semibold w-fit">
                      Live Room Price
                    </div>

                    <LivePriceTicker
                      entityType="hotel"
                      entityId={hotel.id || hotel._id}
                    />
                  </div>
                </TableCell>

                <TableCell>
                  <Button onClick={() => onSelect(hotel)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow key="no-hotel-data">
              <TableCell colSpan={4}>No data</TableCell>
            </TableRow>
          )}
        </TableBody>
        
      </Table>
    </div>
  );
};
export default HotelList;
