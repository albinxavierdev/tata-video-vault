import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Vehicle {
  id: string;
  image: string;
  name: string;
  spec_gvw: string;
  spec_fuel: string;
  spec_engine: string;
}

export const FindYourDriveSection = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });
      setVehicles(data || []);
      setLoading(false);
    };
    fetchVehicles();
  }, []);

  return (
    <section className="bg-[#307FE2] py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
        Find Your Drive For Success
      </h2>
      <p className="text-lg text-gray-300 text-center mb-10 max-w-2xl mx-auto">
        Tata Intra range of pickup trucks combines enhanced levels of visual richness and sophistication with robustness and reliability
      </p>
      {loading ? (
        <div className="text-center text-white">Loading vehicles...</div>
      ) : vehicles.length === 0 ? (
        <div className="text-center text-white">No vehicles found.</div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-[#222] rounded-lg overflow-hidden shadow-lg flex flex-col items-center p-6">
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="w-full h-48 object-contain mb-6 bg-[#333] rounded"
              />
              <div className="text-xl font-bold text-white text-center mb-4">
                {vehicle.name}
              </div>
              <hr className="border-t border-gray-500 w-full mb-4" />
              <div className="w-full">
                <div className="flex justify-between text-white mb-2 text-base">
                  <span className="font-light text-gray-300">GVW</span>
                  <span className="font-semibold">{vehicle.spec_gvw}</span>
                </div>
                <div className="flex justify-between text-white mb-2 text-base">
                  <span className="font-light text-gray-300">Payload</span>
                  <span className="font-semibold">{vehicle.spec_fuel}</span>
                </div>
                <div className="flex justify-between text-white mb-2 text-base">
                  <span className="font-light text-gray-300">Engine</span>
                  <span className="font-semibold">{vehicle.spec_engine}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}; 