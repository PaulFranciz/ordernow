import { Location } from "@/app/api/types";
import { LocationMap } from "./location-map";

interface Props {
  location: Location;
}

const NavMenu = ({ location }: Props) => (
  <div className="space-y-1">
    <p className="text-xs">{location.description}</p>
    <div className="h-24 w-full rounded-md overflow-hidden">
      <LocationMap
        lat={location.coordinates.lat}
        lng={location.coordinates.lng}
      />
    </div>
  </div>
);

export default NavMenu; 