import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useRequireLocation = (user: any | null) => {
  const [hasLocation, setHasLocation] = useState<boolean | null>(null);

  useEffect(() => {
    // Only run if user is logged in
    if (!user) return;

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      setHasLocation(false);
      return;
    }

    const checkLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location access granted", position.coords);
          setHasLocation(true);
        },
        (error) => {
          console.log("Location access denied", error);
          setHasLocation(false);
          toast(
            "We need your location to enable Clock In/Clock Out. Please allow location access.",
            { duration: 3000 }
          );
        }
      );
    };

    checkLocation();
  }, [user]);

  return hasLocation;
};
