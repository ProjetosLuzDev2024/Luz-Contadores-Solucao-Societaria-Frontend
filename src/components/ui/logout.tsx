'use client'
import { useLogout } from "@/hooks/useLogout";
import { Button } from "./button";
import { LogOut } from "lucide-react";

const Logout = () => {
  const { logout } = useLogout();

  const handleLogout = async () => {
    try {
      await logout();
      console.log("logout realizado com sucesso");
    } catch (error: any) {
      console.log("logout deu merda");
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      className="w-full justify-start text-red-600 hover:bg-red-50 transition-colors duration-200"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sair
    </Button>
  );
};

export default Logout;