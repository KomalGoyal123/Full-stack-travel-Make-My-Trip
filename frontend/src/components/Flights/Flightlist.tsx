

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
import { getflight } from "@/api";
import Loader from "../Loader";

import { Badge } from "@/components/ui/badge";

import LivePriceTicker from "@/components/Pricing/LivePriceTicker";

const FlightList = ({ onSelect }: any) => {
  const [flight, setflight] = useState<any[]>([]);
  const [loading, setloading] = useState(true);
  useEffect(() => {
    const fetchflight = async () => {
      try {
        const data = await getflight();
        setflight(data);
      } catch (error) {
        console.error(error);
      } finally {
        setloading(false);
      }
    };
    fetchflight();
  }, []);

  if (loading) {
    return <Loader />;
  }
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Flight List</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Flight Name</TableHead>
            <TableHead>From</TableHead>
           
            <TableHead>To</TableHead>
            <TableHead>Live Price</TableHead>

            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {flight.length > 0 ? (
            flight.map((flight: any, index: number) => (
              <TableRow key={flight._id || index}>
                <TableCell>{flight.flightName}</TableCell>
                <TableCell>{flight.from}</TableCell>
               
                <TableCell>{flight.to}</TableCell>

                <TableCell>
                  <div className="flex flex-col gap-2">

                    <Badge className="bg-green-100 text-green-700 border border-green-300 w-fit">
                      Live Pricing
                    </Badge>

                    <LivePriceTicker
                      entityType="flight"
                      entityId={flight.id || flight._id}
                    />
                  </div>
                </TableCell>

                <TableCell>
                  <Button onClick={() => onSelect(flight)}>
                    Edit
                  </Button>
                </TableCell>

              </TableRow>
            ))
          ) : (
            <TableRow key="no-data">
              
              <TableCell colSpan={5}>No data</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
export default FlightList;
