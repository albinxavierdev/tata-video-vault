import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User, LogOut, LogIn, Search, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const APPLICATION_OPTIONS = [
  { label: 'Fruits and Vegetables', id: 'fruits-and-vegetables' },
  { label: 'Cereal', id: 'cereal' },
  { label: 'Construction', id: 'construction' },
  { label: 'Logistics', id: 'logistics' },
  { label: 'Poultry', id: 'poultry' },
  { label: 'Fisheries', id: 'fisheries' },
  { label: 'FMCG', id: 'fmcg' },
  { label: 'Milk', id: 'milk' },
  { label: 'Refrigerated Vans', id: 'refrigerated-vans' },
];

export const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-[#307FE2] text-white border-b border-gray-800">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center group">
            <img
              src="/tata-motors-logo.png"
              alt="Tata Motors Logo"
              className="h-10 w-auto transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Navigation Menu */}
          <nav className="flex items-center space-x-8">
            <a href="#vehicles" className="text-white hover:text-blue-100 transition-colors text-lg font-semibold">Vehicles</a>
            <a href="#success-stories" className="text-white hover:text-blue-100 transition-colors text-lg font-semibold">Success Stories</a>
            <a href="#contact-us" className="text-white hover:text-blue-100 transition-colors text-lg font-semibold">Contact Us</a>
            {user && (
              <Link to="/admin" className="text-white bg-[#1A4FA0] hover:bg-blue-800 px-4 py-2 rounded-full font-bold shadow transition">
                Admin Panel
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
