import { LocationMap } from "./location-map";

<div className="space-y-1">
  <p className="text-xs">{location.description}</p>
  <div className="h-24 w-full rounded-md overflow-hidden">
    <LocationMap
      lat={location.coordinates.lat}
      lng={location.coordinates.lng}
    />
  </div>
</div> 