import carsPhoto from "@/assets/vehicles-cars-4wds.png";
import commercialPhoto from "@/assets/vehicles-commercial.png";
import scrapPhoto from "@/assets/vehicles-scrap.png";
import cashPhoto from "@/assets/distinct/service-cash.webp";
import removalPhoto from "@/assets/distinct/service-removal.webp";
import truckPhoto from "@/assets/distinct/service-truck.webp";
import scrapServicePhoto from "@/assets/distinct/service-scrap.webp";
import wreckersPhoto from "@/assets/distinct/service-wreckers.webp";
import disposalPhoto from "@/assets/distinct/service-disposal.webp";
import ownerPhoto from "@/assets/distinct/seller-owner.webp";
import businessPhoto from "@/assets/distinct/seller-business.webp";
import valuePhoto from "@/assets/distinct/advice-value.webp";
import preparationPhoto from "@/assets/distinct/advice-pickup.webp";
import collectionDetailPhoto from "@/assets/distinct/collection-detail.webp";

export const vehicleVisuals = {
  cars: { image: carsPhoto, alt: "An older blue sedan and a charcoal 4WD on a white background" },
  commercial: { image: commercialPhoto, alt: "A white ute, panel van and tray truck on a white background" },
  scrap: { image: scrapPhoto, alt: "An old blue sedan with dents, worn paint and rust on a white background" },
};

type VehicleVisual = (typeof vehicleVisuals)[keyof typeof vehicleVisuals];

export const servicePhotos = {
  cash: { image: cashPhoto, alt: "An older burgundy sedan with lightly weathered paint" },
  removal: { image: removalPhoto, alt: "A white tow truck carrying a silver hatchback" },
  truck: { image: truckPhoto, alt: "A used blue cab-over tray truck" },
  scrap: { image: scrapServicePhoto, alt: "A beige sedan with a dented wing and rusty bonnet" },
  wreckers: { image: wreckersPhoto, alt: "A dismantled red hatchback with a salvaged wheel and headlight" },
  disposal: { image: disposalPhoto, alt: "An old green station wagon with faded paint" },
} satisfies Record<string, VehicleVisual>;

export const sellerPhotos = {
  owner: { image: ownerPhoto, alt: "An older white hatchback with its key in the foreground" },
  business: { image: businessPhoto, alt: "A yellow work ute with a toolbox beside a grey panel van" },
} satisfies Record<string, VehicleVisual>;

export const advicePhotos = {
  value: { image: valuePhoto, alt: "A grey 4WD with its bonnet open for a condition inspection" },
  preparation: { image: preparationPhoto, alt: "An emptied sedan boot with a box of personal belongings beside it" },
} satisfies Record<string, VehicleVisual>;

export const collectionPhoto = {
  image: collectionDetailPhoto,
  alt: "A car wheel secured to a tow truck deck with orange ratchet straps",
};

export const serviceVisuals: Partial<Record<string, VehicleVisual>> = {
  "/cash-for-cars": servicePhotos.cash,
  "/car-removals": servicePhotos.removal,
  "/car-removal-brisbane": servicePhotos.removal,
  "/services": vehicleVisuals.commercial,
  "/truck-removal": servicePhotos.truck,
  "/scrap-car-removal": servicePhotos.scrap,
  "/car-wreckers": servicePhotos.wreckers,
  "/car-disposal": servicePhotos.disposal,
};
