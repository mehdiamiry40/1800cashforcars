import carsPhoto from "@/assets/vehicles-cars-4wds.png";
import commercialPhoto from "@/assets/vehicles-commercial.png";
import scrapPhoto from "@/assets/vehicles-scrap.png";

export const vehicleVisuals = {
  cars: { image: carsPhoto, alt: "An older blue sedan and a charcoal 4WD on a white background" },
  commercial: { image: commercialPhoto, alt: "A white ute, panel van and tray truck on a white background" },
  scrap: { image: scrapPhoto, alt: "An old blue sedan with dents, worn paint and rust on a white background" },
};

type VehicleVisual = (typeof vehicleVisuals)[keyof typeof vehicleVisuals];

export const serviceVisuals: Partial<Record<string, VehicleVisual>> = {
  "/cash-for-cars": vehicleVisuals.cars,
  "/car-removals": vehicleVisuals.cars,
  "/car-removal-brisbane": vehicleVisuals.cars,
  "/services": vehicleVisuals.commercial,
  "/truck-removal": vehicleVisuals.commercial,
  "/scrap-car-removal": vehicleVisuals.scrap,
  "/car-wreckers": vehicleVisuals.scrap,
  "/car-disposal": vehicleVisuals.scrap,
};
